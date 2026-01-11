import schedule from "node-schedule";

import { SyncStatus } from "../interfaces/sync.js";
import type { PiHoleItem, SyncLogInput } from "../interfaces/sync.js";
import { ClientController } from "../controllers/client.controller.js";
import { DomainController } from "../controllers/domain.controller.js";
import { QueryController } from "../controllers/query.controller.js";
import { Sync } from "../models/sync.model.js";
import { SyncService } from "../service/sync.service.js";
import { decryptFile } from "../utils/decrypt.js";
import { downloadFile } from "../utils/download.js";

export class SyncController {
    private piHoleURL: string;
    private piHoleDumpPort: string;
    private piHoleDumpKey: string;

    private clientController: ClientController;
    private domainController: DomainController;
    private queryController: QueryController;
    private syncService: SyncService;

    constructor() {
        this.piHoleURL = process.env.PIHOLE_URL ?? "127.0.0.1";
        this.piHoleDumpPort = process.env.PIHOLE_DUMP_PORT ?? "8888";
        this.piHoleDumpKey = process.env.PIHOLE_DUMP_KEY ?? "PASSWORD";

        this.clientController = new ClientController();
        this.domainController = new DomainController();
        this.queryController = new QueryController();

        this.syncService = new SyncService();
    }

    async getLast(): Promise<Sync | null> {
        const result = await this.syncService.getWithLimit(1);
        return result[0] ?? null;
    }

    async getLast100(): Promise<Sync[]> {
        return await this.syncService.getWithLimit(100);
    }

    async log(syncLog: SyncLogInput): Promise<Sync> {
        return await this.syncService.create(syncLog);
    }

    async endStale(): Promise<void> {
        return await this.syncService.endStale();
    }

    async syncNow(): Promise<void> {
        // Check for running sync
        const lastSync = await this.getLast();
        if (lastSync && lastSync.status === SyncStatus.RUNNING) return;

        // Download and decrypt Pi-hole dump
        const ct = await downloadFile(
            `${this.piHoleURL}:${this.piHoleDumpPort}/data`
        );
        const pt = decryptFile(ct, this.piHoleDumpKey);

        // Parse Pi-hole dump
        const data: PiHoleItem[] = JSON.parse(pt);

        // Determine start index
        let startIndex = 0;
        const lastQuery = await this.queryController.getLast();
        if (lastQuery) {
            const i = data.findIndex((item) => item.id === lastQuery.piHoleId);
            if (i !== -1) startIndex = i;
        }

        // Create sync log
        const syncLog = await this.log({
            startTime: new Date(),
            endTime: null,
            status: SyncStatus.RUNNING,
            clients: 0,
            domains: 0,
            queries: 0
        });

        try {
            for (const item of data.slice(startIndex)) {
                // Create or get client
                const [client, isNewClient] =
                    await this.clientController.createIfNotExist(item.client);
                // Create or get domain
                const [domain, isNewDomain] =
                    await this.domainController.createIfNotExist(item.domain);

                if (domain && domain.ignored) continue;

                // Associate domain with client
                await client.addDomain(domain);

                // Create or get query
                const [_query, isNewQuery] =
                    await this.queryController.createIfNotExist(
                        client.id,
                        domain.id,
                        {
                            piHoleId: item.id,
                            timestamp: new Date(item.timestamp * 1000)
                        }
                    );

                // Update sync log counters
                if (isNewClient) syncLog.clients++;
                if (isNewDomain) syncLog.domains++;
                if (isNewQuery) syncLog.queries++;

                await syncLog.save();
            }

            await syncLog.update({
                endTime: new Date(),
                status: SyncStatus.SUCCESS
            });
        } catch (err) {
            console.error("Sync failed:", err);
            await syncLog.update({
                endTime: new Date(),
                status: SyncStatus.FAILED
            });
        }
    }

    startSyncSchedule(cron: string): void {
        schedule.scheduleJob(cron, async () => {
            try {
                await this.syncNow();
            } catch (err) {
                console.error(err);
            }
        });
    }
}
