import { Query } from "../models/query.model.js";

export class QueryService {
    constructor() {}

    /**
     * Get queries with a limit
     */
    async getWithLimit(limit: number, showDeleted?: boolean) {
        const results = await Query.findAll({
            limit,
            order: [["id", "DESC"]],
            paranoid: showDeleted ? false : true
        });

        return results;
    }

    /**
     * Get a query by Pi-hole ID
     */
    async getByPiHoleId(
        piHoleId: number,
        showDeleted?: boolean
    ) {
        const result = await Query.findOne({
            where: { piHoleId },
            paranoid: showDeleted ? false : true
        });

        return result;
    }

    /**
     * Create a new query
     */
    async create(piHoleId: number, timestamp: Date, ClientId: number, DomainId: number) {
        const result = await Query.create({
            piHoleId,
            timestamp,
            ClientId,
            DomainId
        });

        return result;
    }
}
