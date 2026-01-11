import type { FindOptions } from "sequelize";

import type { PaginatedResult } from "../interfaces/common.js";
import { Client } from "../models/client.model.js";
import { Domain } from "../models/domain.model.js";
import { Query } from "../models/query.model.js";

export class ClientService {
    async getAll(): Promise<Client[]> {
        const results = await Client.findAll({
            order: [["ipaddress", "ASC"]]
        });

        return results;
    }

    async getAllWithCount(
        options?: FindOptions
    ): Promise<PaginatedResult<Client>> {
        const results = await Client.findAndCountAll({
            ...options,
            distinct: true
        });

        return results;
    }

    async getDetail(id: string | number): Promise<Client | null> {
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
                            required: false
                        }
                    ]
                }
            ]
        });

        return result;
    }

    async getById(id: string | number): Promise<Client | null> {
        const result = await Client.findByPk(id);
        return result;
    }

    async getByIP(ipaddress: string): Promise<Client | null> {
        const result = await Client.findOne({
            where: { ipaddress }
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
