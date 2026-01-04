exports.ClientService = class ClientService {
    constructor(database) {
        this.database = database;
    }

    async getAll(raw, showDeleted) {
        const results = await this.database.models.Client.findAll({
            order: [["ipaddress", "ASC"]],
            raw: raw ?? false,
            paranoid: showDeleted ? false : true
        });

        return results;
    }

    async getAllWithCount(raw, showDeleted, options) {
        const results = await this.database.models.Client.findAndCountAll(
            Object.assign(options ?? {}, {
                raw: raw ?? false,
                paranoid: showDeleted ? false : true,
                distinct: true
            })
        );

        return results;
    }

    async getDetail(id, raw, showDeleted) {
        try {
            const result = await this.database.models.Client.findByPk(id, {
                include: [
                    {
                        model: this.database.models.Domain,
                        where: { hidden: false },
                        required: false,
                        include: [
                            {
                                model: this.database.models.Query,
                                where: { ClientId: id },
                                required: false,
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
        } catch (err) {
            console.log(err);
        }
    }

    async getByIP(ipaddress, raw, showDeleted) {
        const result = await this.database.models.Client.findOne({
            where: { ipaddress: ipaddress },
            raw: raw ?? false,
            paranoid: showDeleted ? false : true
        });

        return result;
    }

    async create(ipaddress) {
        const result = await this.database.models.Client.create({
            ipaddress: ipaddress
        });

        return result;
    }
};
