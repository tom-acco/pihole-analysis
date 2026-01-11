import { SyncStatus } from "../interfaces/sync.js";
import { Sync } from "../models/sync.model.js";

export class SyncService {
    async getWithLimit(limit: number): Promise<Sync[]> {
        const results = await Sync.findAll({
            limit,
            order: [["id", "DESC"]]
        });

        return results;
    }

    async create(syncLog: {
        startTime: Date;
        endTime?: Date | null;
        status: number | null;
        clients: number | null;
        domains: number | null;
        queries: number | null;
    }): Promise<Sync> {
        const result = await Sync.create({
            startTime: syncLog.startTime,
            endTime: syncLog.endTime ?? null,
            status: syncLog.status ?? SyncStatus.PENDING,
            clients: syncLog.clients ?? 0,
            domains: syncLog.domains ?? 0,
            queries: syncLog.queries ?? 0
        });

        return result;
    }

    async endStale(): Promise<void> {
        await Sync.update(
            { status: SyncStatus.FAILED, endTime: new Date() },
            {
                where: {
                    status: SyncStatus.RUNNING
                }
            }
        );
    }
}
