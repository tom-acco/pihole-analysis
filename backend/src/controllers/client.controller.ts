import type { FindOptions } from "sequelize";
import { Op } from "sequelize";

import type {
    SortItem,
    PaginatedAttributes,
    PaginatedResult
} from "../interfaces/common.js";

import { ClientService } from "../service/client.service.js";
import { ClientControllerException } from "../classes/Exceptions.js";

export class ClientController {
    private clientService: ClientService;

    constructor() {
        this.clientService = new ClientService();
    }

    /**
     * Get paginated clients with optional filter, sorting, and extra attributes
     */
    async getAllPaginated(
        filter?: string,
        page?: number,
        perPage?: number,
        sortBy?: SortItem[],
        attributes?: PaginatedAttributes
    ): Promise<PaginatedResult<any>> {
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

        const results = await this.clientService.getAllWithCount(
            false,
            searchOptions
        );

        return results;
    }

    /**
     * Get a single client with associated domains
     */
    async getClientDomains(id: string | number) {
        const client = await this.clientService.getDetail(id);

        if (!client) {
            throw new ClientControllerException(
                `Client with that ID does not exist!`,
                400
            );
        }

        return client;
    }

    /**
     * Create a client if it doesn't exist
     */
    async createIfNotExist(ipaddress: string) {
        const existing = await this.clientService.getByIP(ipaddress);

        if (existing) {
            return [existing, false] as const;
        }

        const result = await this.clientService.create(ipaddress);

        return [result, true] as const;
    }
}
