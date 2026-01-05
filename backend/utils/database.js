const { Sequelize, DataTypes } = require("sequelize");

const setupDatabase = async () => {
    const sequelize = new Sequelize({
        dialect: "sqlite",
        storage: "database.db",
        logging: (msg) => console.log(msg)
    });

    const Sync = sequelize.define("Sync", {
        startTime: DataTypes.DATE,
        endTime: DataTypes.DATE,
        status: DataTypes.STRING,
        clients: DataTypes.NUMBER,
        domains: DataTypes.NUMBER,
        queries: DataTypes.NUMBER
    });

    const Client = sequelize.define(
        "Client",
        {
            ipaddress: DataTypes.STRING,
            alias: DataTypes.STRING,
            comment: DataTypes.TEXT
        },
        {
            indexes: [{ unique: true, fields: ["ipaddress"] }]
        }
    );

    const Domain = sequelize.define(
        "Domain",
        {
            domain: DataTypes.STRING,
            owner: DataTypes.STRING,
            category: DataTypes.STRING,
            risk: DataTypes.NUMBER,
            comment: DataTypes.TEXT,
            acknowledged: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            flagged: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            ignored: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
        },
        {
            indexes: [
                { unique: true, fields: ["domain"] },
                {
                    unique: false,
                    fields: ["acknowledged"]
                },
                {
                    unique: false,
                    fields: ["flagged"]
                },
                {
                    unique: false,
                    fields: ["ignored"]
                }
            ]
        }
    );

    const Query = sequelize.define(
        "Query",
        {
            piHoleId: DataTypes.NUMBER,
            timestamp: DataTypes.DATE,
            ClientId: DataTypes.INTEGER,
            DomainId: DataTypes.INTEGER
        },
        {
            indexes: [
                { unique: true, fields: ["piHoleId"] },
                { unique: false, fields: ["ClientId"] },
                { unique: false, fields: ["DomainId"] }
            ]
        }
    );

    Client.belongsToMany(Domain, { through: "ClientDomains" });
    Client.hasMany(Query);

    Domain.belongsToMany(Client, { through: "ClientDomains" });
    Domain.hasMany(Query);

    Query.belongsTo(Domain);
    Query.belongsTo(Client);

    await sequelize.sync();

    return sequelize;
};

module.exports = setupDatabase;
