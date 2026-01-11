import { Sequelize } from "sequelize";
import { Client, initClientModel } from "../models/client.model.js";
import { Domain, initDomainModel } from "../models/domain.model.js";
import { Query, initQueryModel } from "../models/query.model.js";
import { initSyncModel } from "../models/sync.model.js";

let sequelize: Sequelize;

export const setupTestDatabase = async (): Promise<Sequelize> => {
    sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false
    });

    initClientModel(sequelize);
    initDomainModel(sequelize);
    initQueryModel(sequelize);
    initSyncModel(sequelize);

    Client.belongsToMany(Domain, { through: "ClientDomains" });
    Client.hasMany(Query);

    Domain.belongsToMany(Client, { through: "ClientDomains" });
    Domain.hasMany(Query);

    Query.belongsTo(Domain);
    Query.belongsTo(Client);

    await sequelize.sync({ force: true });

    return sequelize;
};

export const cleanupTestDatabase = async (): Promise<void> => {
    if (sequelize) {
        await sequelize.close();
    }
};

export const clearTestDatabase = async (): Promise<void> => {
    if (sequelize) {
        await sequelize.sync({ force: true });
    }
};
