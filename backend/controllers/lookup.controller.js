const { ClientService } = require("../service/client.service");
const { DomainService } = require("../service/domain.service");
const { LookupService } = require("../service/lookup.service");
//eslint-disable-next-line
const { LookupControllerException } = require("../classes/Errors");

module.exports = class LookupController {
    constructor(database) {
        this.database = database;

        this.domainService = new DomainService(this.database);
        this.clientService = new ClientService(this.database);
        this.lookupService = new LookupService(this.database);
    }

    async create(client, domain, lookup) {
        const result = await this.lookupService.create(lookup);

        result.setClient(client);
        result.setDomain(domain);

        return result;
    }
};
