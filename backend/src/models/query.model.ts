import { Model, DataTypes } from "sequelize";
import type {
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    Sequelize,
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    BelongsToCreateAssociationMixin
} from "sequelize";

import { Client } from "./client.model.js";
import { Domain } from "./domain.model.js";

export class Query extends Model<
    InferAttributes<Query>,
    InferCreationAttributes<Query>
> {
    declare id: CreationOptional<number>;

    declare piHoleId: number;
    declare timestamp: Date;

    declare ClientId: number;
    declare DomainId: number;

    // Association mixins for Client
    declare getClient: BelongsToGetAssociationMixin<Client>;
    declare setClient: BelongsToSetAssociationMixin<Client, number>;
    declare createClient: BelongsToCreateAssociationMixin<Client>;

    // Association mixins for Domain
    declare getDomain: BelongsToGetAssociationMixin<Domain>;
    declare setDomain: BelongsToSetAssociationMixin<Domain, number>;
    declare createDomain: BelongsToCreateAssociationMixin<Domain>;
}

export const initQueryModel = (sequelize: Sequelize) => {
    Query.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },

            piHoleId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true
            },

            timestamp: {
                type: DataTypes.DATE,
                allowNull: false
            },

            ClientId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },

            DomainId: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: "Query",
            indexes: [
                { unique: true, fields: ["piHoleId"] },
                { fields: ["ClientId"] },
                { fields: ["DomainId"] }
            ]
        }
    );

    return Query;
};
