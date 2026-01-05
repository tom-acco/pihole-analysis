const { Op } = require("sequelize");

const { DomainService } = require("../service/domain.service");
const { DomainControllerException } = require("../classes/Errors");

const aiAnalysis = require("../utils/ai");

module.exports = class DomainController {
    constructor(database) {
        this.database = database;

        this.domainService = new DomainService(this.database);
    }

    async getAllPaginated(filter, page, perPage, sortBy, attributes) {
        const searchOptions = {};

        searchOptions.where = {
            ...(filter && {
                [Op.or]: [
                    { domain: { [Op.like]: `%${filter}%` } },
                    { category: { [Op.like]: `%${filter}%` } },
                    { owner: { [Op.like]: `%${filter}%` } }
                ]
            }),
            ...(attributes || {})
        };

        if (sortBy) {
            const orders = ["asc", "desc"];
            const columns = ["domain", "risk", "category", "owner", "queryCount"];

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

        const results = await this.domainService.getAllWithCount(
            false,
            false,
            searchOptions
        );

        return results;
    }

    async getDomainClients(id) {
        const domain = await this.domainService.getDetail(id);

        if (domain === null) {
            throw new DomainControllerException(
                `Domain with that ID does not exist!`,
                400
            );
        }

        return domain;
    }

    async createIfNotExist(domain) {
        const existing = await this.domainService.getByDomain(domain);

        if (existing) {
            return [existing, false];
        }

        const result = await this.domainService.create(domain);

        return [result, true];
    }

    async interrogate(domain) {
        const result = await this.domainService.getByDomain(domain);

        if (result === null) {
            throw new DomainControllerException(`Domain does not exist!`, 400);
        }

        const analysis = await aiAnalysis(domain);

        const riskMatrix = {
            low: 1,
            medium: 2,
            high: 3
        };

        await result.update({
            risk: riskMatrix[analysis.risk_level],
            category: analysis.category,
            owner: analysis.owner,
            comment: analysis.notes
        });

        return result;
    }

    async toggleAcknowledge(domain) {
        const result = await this.domainService.getByDomain(domain);

        if (result === null) {
            throw new DomainControllerException(`Domain does not exist!`, 400);
        }

        await result.update({
            acknowledged: !result.acknowledged
        });

        return result;
    }

    async toggleFlag(domain) {
        const result = await this.domainService.getByDomain(domain);

        if (result === null) {
            throw new DomainControllerException(`Domain does not exist!`, 400);
        }

        await result.update({
            flagged: !result.flagged
        });

        return result;
    }

    async toggleIgnore(domain) {
        const result = await this.domainService.getByDomain(domain);

        if (result === null) {
            throw new DomainControllerException(`Domain does not exist!`, 400);
        }

        await result.update({
            ignored: !result.ignored
        });

        return result;
    }
};
