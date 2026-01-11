import type { FindOptions } from "sequelize";
import { Op } from "sequelize";

import type {
    SortItem,
    PaginatedAttributes,
    PaginatedResult
} from "../interfaces/common.js";
import { Client } from "../models/client.model.js";
import { ClientService } from "../service/client.service.js";
import { ClientControllerException } from "../utils/exceptions.js";

export class ClientController {
    private clientService: ClientService;

    constructor() {
        this.clientService = new ClientService();
    }

    async getAllPaginated(
        filter?: string,
        page?: number,
        perPage?: number,
        sortBy?: SortItem[],
        attributes?: PaginatedAttributes
    ): Promise<PaginatedResult<Client>> {
        const searchOptions: FindOptions = {};

        searchOptions.where = {
            ...(filter && {
                [Op.or]: [
                    { ipaddress: { [Op.like]: `%${filter}%` } },
                    { alias: { [Op.like]: `%${filter}%` } }
                ]
            }),
            ...(attributes || {})
        };

        if (sortBy) {
            const orders = ["asc", "desc"];
            const columns = ["ipaddress", "alias"];
            const order: Array<[string, string]> = [];

            for (const sortItem of sortBy) {
                if (!orders.includes(sortItem.order)) continue;
                if (!columns.includes(sortItem.key)) continue;

                order.push([sortItem.key, sortItem.order.toUpperCase()]);
            }

            if (order.length > 0) {
                searchOptions.order = order as any;
            }
        }

        if (page && perPage) {
            searchOptions.limit = perPage;
            searchOptions.offset = (page - 1) * perPage;
        }

        const results = await this.clientService.getAllWithCount(searchOptions);

        return results;
    }

    async getClientDomains(id: string | number): Promise<Client | null> {
        const client = await this.clientService.getDetail(id);

        if (!client) {
            throw new ClientControllerException(
                `Client with that ID does not exist!`,
                400
            );
        }

        return client;
    }

    async createIfNotExist(ipaddress: string): Promise<[Client, boolean]> {
        const existing = await this.clientService.getByIP(ipaddress);

        if (existing) {
            return [existing, false] as const;
        }

        const result = await this.clientService.create(ipaddress);

        return [result, true] as const;
    }

    async setAlias(id: string | number, alias: string): Promise<Client> {
        const result = await this.clientService.getById(id);

        if (!result) {
            throw new ClientControllerException(
                `Client with that ID does not exist!`,
                400
            );
        }

        await result.update({ alias: alias });

        return result;
    }
}
