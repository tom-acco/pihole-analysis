exports.QueryService = class QueryService {
    constructor(database) {
        this.database = database;
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
