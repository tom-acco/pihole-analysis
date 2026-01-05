const { ClientService } = require("../service/client.service");
const { DomainService } = require("../service/domain.service");
const { QueryService } = require("../service/query.service");
//eslint-disable-next-line
const { QueryControllerException } = require("../classes/Errors");

module.exports = class QueryController {
    constructor(database) {
        this.database = database;

        this.domainService = new DomainService(this.database);
        this.clientService = new ClientService(this.database);
        this.queryService = new QueryService(this.database);
    }

    async getLast() {
        const result = await this.queryService.getWithLimit(1);

        if (result === null) {
            return null;
        }

        return result[0];
    }

    async createIfNotExist(client, domain, query) {
        const existing = await this.queryService.getByPiHoleId(
            query.piHoleId
        );

        if (existing) {
            return [existing, false];
        }

        const result = await this.queryService.create(
            query.piHoleId,
            query.timestamp
        );

        result.setClient(client);
        result.setDomain(domain);

        return [result, true];
    }
};
