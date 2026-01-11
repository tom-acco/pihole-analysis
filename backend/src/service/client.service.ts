import type { FindOptions } from "sequelize";

import type { PaginatedResult } from "../interfaces/common.js";

import { Client } from "../models/client.model.js";
import { Domain } from "../models/domain.model.js";
import { Query } from "../models/query.model.js";

export class ClientService {
    constructor() {}

    async getAll(showDeleted?: boolean): Promise<Client[]> {
        const results = await Client.findAll({
            order: [["ipaddress", "ASC"]],
            paranoid: showDeleted ? false : true
        });

        return results;
    }

    async getAllWithCount(
        showDeleted?: boolean,
        options?: FindOptions
    ): Promise<PaginatedResult<Client>> {
        const results = await Client.findAndCountAll({
            ...options,
            paranoid: showDeleted ? false : true,
            distinct: true
        });

        return results;
    }

    async getDetail(
        id: string | number,
        showDeleted?: boolean
    ): Promise<Client | null> {
        const result = await Client.findByPk(id, {
            include: [
                {
                    model: Domain,
                    where: { ignored: false },
                    required: false,
                    include: [
                        {
                            model: Query,
                            where: { ClientId: id },
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

    async getByIP(
        ipaddress: string,
        showDeleted?: boolean
    ): Promise<Client | null> {
        const result = await Client.findOne({
            where: { ipaddress },
            paranoid: showDeleted ? false : true
        });

        return result;
    }

    async create(ipaddress: string): Promise<Client> {
        const result = await Client.create({
            ipaddress
        });

        return result;
    }
}
