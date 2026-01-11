import { QueryService } from "../service/query.service.js";
import { QueryControllerException } from "../classes/Exceptions.js";

export class QueryController {
    private queryService: QueryService;

    constructor() {
        this.queryService = new QueryService();
    }

    async getLast() {
        const result = await this.queryService.getWithLimit(1);

        if (!result || result.length === 0) {
            return null;
        }

        return result[0];
    }

    async createIfNotExist(
        clientId: number,
        domainId: number,
        query: { piHoleId: number; timestamp: Date }
    ) {
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
