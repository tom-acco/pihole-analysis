exports.LookupService = class CountsService {
    constructor(database) {
        this.database = database;
    }

    async create(count) {
        const result = await this.database.models.Lookup.create({
            count: count
        });

        return result;
    }
};
