const { Sequelize, DataTypes } = require("sequelize");

const setupDatabase = async () => {
    const sequelize = new Sequelize({
        dialect: "sqlite",
        storage: "database.db",
        logging: (msg) => console.log(msg)
    });

    const Client = sequelize.define("Client", {
        ipaddress: DataTypes.STRING,
        alias: DataTypes.STRING,
        comment: DataTypes.TEXT
    });

    const Domain = sequelize.define("Domain", {
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
        hidden: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    const Lookup = sequelize.define("Lookup", {
        count: DataTypes.NUMBER
    });

    Client.belongsToMany(Domain, { through: "ClientDomains" });
    Client.hasMany(Lookup);

    Domain.belongsToMany(Client, { through: "ClientDomains" });
    Domain.hasMany(Lookup);

    Lookup.belongsTo(Domain);
    Lookup.belongsTo(Client);

    await sequelize.sync();

    return sequelize;
};

module.exports = setupDatabase;
