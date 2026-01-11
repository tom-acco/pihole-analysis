import { Sequelize } from "sequelize";
import type { FindOptions } from "sequelize";

import type { PaginatedResult } from "../interfaces/common.js";

import { Domain } from "../models/domain.model.js";
import { Client } from "../models/client.model.js";
import { Query } from "../models/query.model.js";

export class DomainService {
    async getAll(showDeleted?: boolean): Promise<Domain[]> {
        const results = await Domain.findAll({
            order: [["domain", "ASC"]],
            paranoid: !showDeleted
        });

        return results;
    }

    async getAllWithCount(
        showDeleted?: boolean,
        options?: FindOptions
    ): Promise<PaginatedResult<Domain>> {
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
            paranoid: !showDeleted,
            distinct: true
        });

        return results;
    }

    async getDetail(
        id: string | number,
        showDeleted?: boolean
    ): Promise<Domain | null> {
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
                            paranoid: !showDeleted
                        }
                    ],
                    paranoid: !showDeleted
                }
            ],
            paranoid: !showDeleted
        });

        return result;
    }

    async getByDomain(
        domain: string,
        showDeleted?: boolean
    ): Promise<Domain | null> {
        const result = await Domain.findOne({
            where: { domain },
            paranoid: !showDeleted
        });

        return result;
    }

    async create(domain: string): Promise<Domain> {
        const result = await Domain.create({ domain });
        return result;
    }
}
