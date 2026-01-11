import { Query } from "../models/query.model.js";

export class QueryService {
    async getWithLimit(limit: number): Promise<Query[]> {
        const results = await Query.findAll({
            limit,
            order: [["id", "DESC"]]
        });

        return results;
    }

    async getByPiHoleId(piHoleId: number): Promise<Query | null> {
        const result = await Query.findOne({
            where: { piHoleId }
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
