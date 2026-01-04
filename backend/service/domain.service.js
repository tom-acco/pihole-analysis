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
                    "hidden",
                    "createdAt",
                    "updatedAt",
                    [
                        Sequelize.literal(`(
        SELECT COALESCE(SUM("count"), 0)
        FROM "Lookups"
        WHERE "Lookups"."DomainId" = "Domain"."id"
      )`),
                        "lookups"
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
                            model: this.database.models.Lookup,
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
