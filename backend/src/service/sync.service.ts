import { Sync } from "../models/sync.model.js";

export class SyncService {
    constructor() {}

    /**
     * Get the last `limit` sync logs
     */
    async getWithLimit(limit: number, showDeleted?: boolean) {
        const results = await Sync.findAll({
            limit,
            order: [["id", "DESC"]],
            paranoid: showDeleted ? false : true
        });

        return results;
    }

    /**
     * Create a new sync log
     */
    async create(syncLog: {
        startTime: Date;
        endTime?: Date | null;
        status: number | null;
        clients: number | null;
        domains: number | null;
        queries: number | null;
    }) {
        const result = await Sync.create({
            startTime: syncLog.startTime,
            endTime: syncLog.endTime ?? null,
            status: syncLog.status ?? 0,
            clients: syncLog.clients ?? 0,
            domains: syncLog.domains ?? 0,
            queries: syncLog.queries ?? 0
        });

        return result;
    }

    /**
     * End all stale sync logs (status = 1)
     */
    async endStale() {
        await Sync.update(
            { status: 3, endTime: new Date() },
            {
                where: {
                    status: 1
                }
            }
        );
    }
}
