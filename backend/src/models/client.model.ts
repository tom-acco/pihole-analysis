import { Model, DataTypes } from "sequelize";
import type {
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    Sequelize,
    HasManyAddAssociationMixin,
    HasManyAddAssociationsMixin,
    HasManyGetAssociationsMixin,
    HasManySetAssociationsMixin,
    HasManyRemoveAssociationMixin,
    HasManyRemoveAssociationsMixin,
    HasManyHasAssociationMixin,
    HasManyHasAssociationsMixin,
    HasManyCountAssociationsMixin
} from "sequelize";

import type { Domain } from "./domain.model.js";
import type { Query } from "./query.model.js";

export class Client extends Model<
    InferAttributes<Client>,
    InferCreationAttributes<Client>
> {
    declare id: CreationOptional<number>;
    declare ipaddress: string;
    declare alias: string | null;
    declare comment: string | null;

    // For Domain belongsToMany
    declare addDomain: HasManyAddAssociationMixin<Domain, number>;
    declare addDomains: HasManyAddAssociationsMixin<Domain, number>;
    declare getDomains: HasManyGetAssociationsMixin<Domain>;
    declare setDomains: HasManySetAssociationsMixin<Domain, number>;
    declare removeDomain: HasManyRemoveAssociationMixin<Domain, number>;
    declare removeDomains: HasManyRemoveAssociationsMixin<Domain, number>;
    declare hasDomain: HasManyHasAssociationMixin<Domain, number>;
    declare hasDomains: HasManyHasAssociationsMixin<Domain, number>;
    declare countDomains: HasManyCountAssociationsMixin;

    // For Query hasMany
    declare addQuery: HasManyAddAssociationMixin<Query, number>;
    declare addQueries: HasManyAddAssociationsMixin<Query, number>;
    declare getQueries: HasManyGetAssociationsMixin<Query>;
    declare setQueries: HasManySetAssociationsMixin<Query, number>;
    declare removeQuery: HasManyRemoveAssociationMixin<Query, number>;
    declare removeQueries: HasManyRemoveAssociationsMixin<Query, number>;
    declare hasQuery: HasManyHasAssociationMixin<Query, number>;
    declare hasQueries: HasManyHasAssociationsMixin<Query, number>;
    declare countQueries: HasManyCountAssociationsMixin;
}

export const initClientModel = (sequelize: Sequelize): void => {
    Client.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            ipaddress: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            alias: {
                type: DataTypes.STRING,
                allowNull: true
            },
            comment: {
                type: DataTypes.TEXT,
                allowNull: true
            }
        },
        {
            sequelize,
            modelName: "Client",
            indexes: [{ unique: true, fields: ["ipaddress"] }]
        }
    );
};
