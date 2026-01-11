import { Query } from "../models/query.model.js";

export class QueryService {
    async getWithLimit(limit: number, showDeleted?: boolean): Promise<Query[]> {
        const results = await Query.findAll({
            limit,
            order: [["id", "DESC"]],
            paranoid: !showDeleted
        });

        return results;
    }

    async getByPiHoleId(
        piHoleId: number,
        showDeleted?: boolean
    ): Promise<Query | null> {
        const result = await Query.findOne({
            where: { piHoleId },
            paranoid: !showDeleted
        });

        return result;
    }

    async create(
        piHoleId: number,
        timestamp: Date,
        ClientId: number,
        DomainId: number
    ): Promise<Query> {
        const result = await Query.create({
            piHoleId,
            timestamp,
            ClientId,
            DomainId
        });

        return result;
    }
}
