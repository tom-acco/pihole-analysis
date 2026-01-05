const { Sequelize } = require("sequelize");

exports.DomainService = class DomainService {
    constructor(database) {
        this.database = database;
    }

    async getAll(raw, showDeleted) {
        const results = await this.database.models.Domain.findAll({
            order: [["domain", "ASC"]],
            raw: raw ?? false,
            paranoid: showDeleted ? false : true
        });

        return results;
    }

    async getAllWithCount(raw, showDeleted, options) {
        const results = await this.database.models.Domain.findAndCountAll(
            Object.assign(options ?? {}, {
                attributes: [
                    "id",
                    "domain",
                    "owner",
                    "category",
                    "risk",
                    "acknowledged",
                    "flagged",
                    "ignored",
                    "createdAt",
                    "updatedAt",
                    [
                        Sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM "Queries"
                            WHERE "Queries"."DomainId" = "Domain"."id"
                        )`),
                        "queryCount"
                    ]
                ],
                raw: raw ?? false,
                paranoid: showDeleted ? false : true,
                distinct: true
            })
        );

        return results;
    }

    async getDetail(id, raw, showDeleted) {
        const result = await this.database.models.Domain.findByPk(id, {
            include: [
                {
                    model: this.database.models.Client,
                    include: [
                        {
                            model: this.database.models.Query,
                            where: { DomainId: id },
                            raw: raw ?? false,
                            paranoid: showDeleted ? false : true
                        }
                    ],
                    raw: raw ?? false,
                    paranoid: showDeleted ? false : true
                }
            ],
            raw: raw ?? false,
            paranoid: showDeleted ? false : true
        });

        return result;
    }

    async getByDomain(domain, raw, showDeleted) {
        const result = await this.database.models.Domain.findOne({
            where: { domain: domain },
            raw: raw ?? false,
            paranoid: showDeleted ? false : true
        });

        return result;
    }

    async create(domain) {
        const result = await this.database.models.Domain.create({
            domain: domain
        });

        return result;
    }
};
