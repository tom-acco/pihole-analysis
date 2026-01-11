import type { FindOptions } from "sequelize";

import { Client } from "../models/client.model.js";
import { Domain } from "../models/domain.model.js";
import { Query } from "../models/query.model.js";

export class ClientService {
    constructor() {}

    /**
     * Get all clients
     */
    async getAll(showDeleted?: boolean) {
        const results = await Client.findAll({
            order: [["ipaddress", "ASC"]],
            paranoid: showDeleted ? false : true
        });

        return results;
    }

    /**
     * Get clients with total count, optional filters/pagination
     */
    async getAllWithCount(
        showDeleted?: boolean,
        options?: FindOptions
    ) {
        const results = await Client.findAndCountAll({
            ...options,
            paranoid: showDeleted ? false : true,
            distinct: true
        });

        return results;
    }

    /**
     * Get a client with associated domains and queries
     */
    async getDetail(id: string | number, showDeleted?: boolean) {
        try {
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
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    /**
     * Get a client by IP
     */
    async getByIP(ipaddress: string, showDeleted?: boolean) {
        const result = await Client.findOne({
            where: { ipaddress },
            paranoid: showDeleted ? false : true
        });

        return result;
    }

    /**
     * Create a new client
     */
    async create(ipaddress: string) {
        const result = await Client.create({
            ipaddress
        });

        return result;
    }
}
