exports.SyncService = class SyncService {
    constructor(database) {
        this.database = database;
    }

    async getWithLimit(limit, raw, showDeleted) {
        const results = await this.database.models.Sync.findAll({
            limit: limit,
            raw: raw ?? false,
            paranoid: showDeleted ? false : true
        });

        return results;
    }

    async create(syncLog) {
        const result = await this.database.models.Sync.create(syncLog);
        return result;
    }
};
