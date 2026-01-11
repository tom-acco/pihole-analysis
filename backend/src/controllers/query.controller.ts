import { Query } from "../models/query.model.js";

import { QueryService } from "../service/query.service.js";
import { QueryControllerException } from "../utils/exceptions.js";

export class QueryController {
    private queryService: QueryService;

    constructor() {
        this.queryService = new QueryService();
    }

    async getLast(): Promise<Query | null> {
        const result = await this.queryService.getWithLimit(1);
        return result[0] ?? null;
    }

    async createIfNotExist(
        clientId: number,
        domainId: number,
        query: { piHoleId: number; timestamp: Date }
    ): Promise<[Query, boolean]> {
        const existing = await this.queryService.getByPiHoleId(query.piHoleId);

        if (existing) {
            return [existing, false] as const;
        }

        const result = await this.queryService.create(
            query.piHoleId,
            query.timestamp,
            clientId,
            domainId
        );

        return [result, true] as const;
    }
}
