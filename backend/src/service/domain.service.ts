import { Sequelize } from "sequelize";
import type { FindOptions } from "sequelize";

import { Domain } from "../models/domain.model.js";
import { Client } from "../models/client.model.js";
import { Query } from "../models/query.model.js";

export class DomainService {
    constructor() {}

    /**
     * Get all domains
     */
    async getAll(showDeleted?: boolean) {
        const results = await Domain.findAll({
            order: [["domain", "ASC"]],
            paranoid: showDeleted ? false : true
        });

        return results;
    }

    /**
     * Get domains with total count, optional filters/pagination
     */
    async getAllWithCount(
        showDeleted?: boolean,
        options?: FindOptions
    ) {
        const results = await Domain.findAndCountAll({
            ...options,
            attributes: [
                "id",
                "domain",
                "owner",
                "category",
                "risk",
                "acknowledged",
                "flagged",
                "ignored",
                "createdAt",
                "updatedAt",
                [
                    Sequelize.literal(`(
            SELECT COUNT(*)
            FROM "Queries"
            WHERE "Queries"."DomainId" = "Domain"."id"
          )`),
                    "queryCount"
                ]
            ],
            paranoid: showDeleted ? false : true,
            distinct: true
        });

        return results;
    }

    /**
     * Get domain details with associated clients and queries
     */
    async getDetail(id: string | number, showDeleted?: boolean) {
        const result = await Domain.findByPk(id, {
            include: [
                {
                    model: Client,
                    required: false,
                    include: [
                        {
                            model: Query,
                            where: { DomainId: id },
                            required: false,
                            paranoid: showDeleted ? false : true
                        }
                    ],
                    paranoid: showDeleted ? false : true
                }
            ],
            paranoid: showDeleted ? false : true
        });

        return result;
    }

    /**
     * Get a domain by its name
     */
    async getByDomain(domain: string, showDeleted?: boolean) {
        const result = await Domain.findOne({
            where: { domain },
            paranoid: showDeleted ? false : true
        });

        return result;
    }

    /**
     * Create a new domain
     */
    async create(domain: string) {
        const result = await Domain.create({ domain });
        return result;
    }
}
