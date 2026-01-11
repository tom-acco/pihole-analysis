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

import type { Client } from "./client.model.js";
import type { Query } from "./query.model.js";

export class Domain extends Model<
    InferAttributes<Domain>,
    InferCreationAttributes<Domain>
> {
    declare id: CreationOptional<number>;

    declare domain: string;
    declare owner: string | null;
    declare category: string | null;
    declare risk: number | null;
    declare comment: string | null;

    declare acknowledged: CreationOptional<boolean>;
    declare flagged: CreationOptional<boolean>;
    declare ignored: CreationOptional<boolean>;

    // For Client belongsToMany
    declare addClient: HasManyAddAssociationMixin<Client, number>;
    declare addClients: HasManyAddAssociationsMixin<Client, number>;
    declare getClients: HasManyGetAssociationsMixin<Client>;
    declare setClients: HasManySetAssociationsMixin<Client, number>;
    declare removeClient: HasManyRemoveAssociationMixin<Client, number>;
    declare removeClients: HasManyRemoveAssociationsMixin<Client, number>;
    declare hasClient: HasManyHasAssociationMixin<Client, number>;
    declare hasClients: HasManyHasAssociationsMixin<Client, number>;
    declare countClients: HasManyCountAssociationsMixin;

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

export const initDomainModel = (sequelize: Sequelize) => {
    Domain.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },

            domain: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },

            owner: {
                type: DataTypes.STRING,
                allowNull: true
            },

            category: {
                type: DataTypes.STRING,
                allowNull: true
            },

            risk: {
                type: DataTypes.INTEGER,
                allowNull: true
            },

            comment: {
                type: DataTypes.TEXT,
                allowNull: true
            },

            acknowledged: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },

            flagged: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },

            ignored: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        },
        {
            sequelize,
            modelName: "Domain",
            indexes: [
                { unique: true, fields: ["domain"] },
                { fields: ["acknowledged"] },
                { fields: ["flagged"] },
                { fields: ["ignored"] }
            ]
        }
    );

    return Domain;
};
