const { Op } = require("sequelize");

const { ClientService } = require("../service/client.service");
const { ClientControllerException } = require("../classes/Errors");

module.exports = class ClientController {
    constructor(database) {
        this.database = database;

        this.clientService = new ClientService(this.database);
    }

    async getAllPaginated(filter, page, perPage, sortBy, attributes) {
        const searchOptions = {};

        searchOptions.where = {
            ...(filter && {
                [Op.or]: [
                    { ipaddress: { [Op.like]: `%${filter}%` } },
                    { alias: { [Op.like]: `%${filter}%` } },
                ]
            }),
            ...(attributes || {})
        };

        if (sortBy) {
            const orders = ["asc", "desc"];
            const columns = ["ipaddress", "alias"];

            const order = [];

            for (const sortItem of sortBy) {
                if (!orders.includes(sortItem.order)) {
                    continue;
                }

                if (!columns.includes(sortItem.key)) {
                    continue;
                }

                order.push([sortItem.key, sortItem.order.toUpperCase()]);
            }

            if (order.length > 0) {
                searchOptions.order = order;
            }
        }

        if (page && perPage) {
            searchOptions.limit = perPage;
            searchOptions.offset = (page - 1) * perPage;
        }

        const results = await this.clientService.getAllWithCount(
            false,
            false,
            searchOptions
        );

        return results;
    }

    async getClientDomains(id) {
        const client = await this.clientService.getDetail(id);

        if (client === null) {
            throw new ClientControllerException(
                `Client with that ID does not exist!`,
                400
            );
        }

        return client;
    }

    async createIfNotExist(ipaddress) {
        const existing = await this.clientService.getByIP(ipaddress);

        if (existing) {
            return existing;
        }

        const result = await this.clientService.create(ipaddress);

        return result;
    }
};
