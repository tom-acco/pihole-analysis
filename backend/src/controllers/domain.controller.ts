import type { FindOptions } from "sequelize";
import { Op } from "sequelize";

import type {
    SortItem,
    PaginatedAttributes,
    PaginatedResult
} from "../interfaces/common.js";

import { Domain } from "../models/domain.model.js";

import { DomainService } from "../service/domain.service.js";
import { DomainControllerException } from "../classes/Exceptions.js";

import { aiAnalysis } from "../utils/ai.js";

export class DomainController {
    private domainService: DomainService;

    constructor() {
        this.domainService = new DomainService();
    }

    /**
     * Get all domains paginated, optionally filtered and sorted
     */
    async getAllPaginated(
        filter?: string | null,
        page?: number,
        perPage?: number,
        sortBy?: SortItem[],
        attributes?: PaginatedAttributes
    ): Promise<PaginatedResult<any>> {
        const searchOptions: FindOptions = {};

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
            const columns = [
                "domain",
                "risk",
                "category",
                "owner",
                "queryCount"
            ];

            const order: any[] = [];

            for (const sortItem of sortBy) {
                if (!orders.includes(sortItem.order)) continue;
                if (!columns.includes(sortItem.key)) continue;

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
            searchOptions
        );

        return results;
    }

    /**
     * Get domain and associated clients by ID
     */
    async getDomainClients(id: number) {
        const domain = await this.domainService.getDetail(id);

        if (!domain) {
            throw new DomainControllerException(
                `Domain with that ID does not exist!`,
                400
            );
        }

        return domain;
    }

    /**
     * Create a domain if it doesn't already exist
     */
    async createIfNotExist(domain: string): Promise<[Domain, boolean]> {
        const existing = await this.domainService.getByDomain(domain);

        if (existing) return [existing, false];

        const result = await this.domainService.create(domain);
        return [result, true];
    }

    /**
     * Run AI analysis on a domain
     */
    async interrogate(domain: string) {
        const result = await this.domainService.getByDomain(domain);

        if (!result) {
            throw new DomainControllerException(`Domain does not exist!`, 400);
        }

        const analysis = await aiAnalysis(domain);

        const riskMatrix: Record<string, number> = {
            low: 1,
            medium: 2,
            high: 3
        };

        const riskValue = riskMatrix[analysis.risk_level] ?? null;

        await result.update({
            risk: riskValue,
            category: analysis.category,
            owner: analysis.owner,
            comment: analysis.notes
        });

        return result;
    }

    /**
     * Update domain acknowledged status
     */
    async setAcknowledge(domain: string, value: boolean) {
        const result = await this.domainService.getByDomain(domain);

        if (!result)
            throw new DomainControllerException(`Domain does not exist!`, 400);

        await result.update({ acknowledged: value });
        return result;
    }

    /**
     * Update domain flagged status
     */
    async setFlag(domain: string, value: boolean) {
        const result = await this.domainService.getByDomain(domain);

        if (!result)
            throw new DomainControllerException(`Domain does not exist!`, 400);

        await result.update({ flagged: value });
        return result;
    }

    /**
     * Update domain ignored status
     */
    async setIgnore(domain: string, value: boolean) {
        const result = await this.domainService.getByDomain(domain);

        if (!result)
            throw new DomainControllerException(`Domain does not exist!`, 400);

        await result.update({ ignored: value });
        return result;
    }
}
