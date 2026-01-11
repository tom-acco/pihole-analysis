import { Sequelize } from "sequelize";
import { Client, initClientModel } from "./models/client.model.js";
import { Domain, initDomainModel } from "./models/domain.model.js";
import { Query, initQueryModel } from "./models/query.model.js";
import { initSyncModel } from "./models/sync.model.js";

export const setupDatabase = async (): Promise<Sequelize> => {
    const sequelize = new Sequelize({
        dialect: "sqlite",
        storage: "database.db",
        logging: (msg: string) => console.log(msg)
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

    await sequelize.sync();

    return sequelize;
};
