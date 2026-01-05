exports.SyncService = class SyncService {
    constructor(database) {
        this.database = database;
    }

    async getWithLimit(limit, raw, showDeleted) {
        const results = await this.database.models.Sync.findAll({
            limit: limit,
            order: [["id", "DESC"]],
            raw: raw ?? false,
            paranoid: showDeleted ? false : true
        });

        return results;
    }

    async create(syncLog) {
        const result = await this.database.models.Sync.create(syncLog);
        return result;
    }

    async endStale() {
        await this.database.models.Sync.update(
            { status: 3, endTime: new Date() },
            {
                where: {
                    status: 1
                }
            }
        );
    }
};
