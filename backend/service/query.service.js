exports.QueryService = class QueryService {
    constructor(database) {
        this.database = database;
    }

    async getWithLimit(limit, raw, showDeleted) {
        const results = await this.database.models.Query.findAll({
            limit: limit,
            order: [["id", "DESC"]],
            raw: raw ?? false,
            paranoid: showDeleted ? false : true
        });

        return results;
    }

    async getByPiHoleId(piHoleId, raw, showDeleted) {
        const result = await this.database.models.Query.findOne({
            where: { piHoleId: piHoleId },
            raw: raw ?? false,
            paranoid: showDeleted ? false : true
        });

        return result;
    }

    async create(piHoleId, timestamp) {
        const result = await this.database.models.Query.create({
            piHoleId: piHoleId,
            timestamp: timestamp
        });

        return result;
    }
};
