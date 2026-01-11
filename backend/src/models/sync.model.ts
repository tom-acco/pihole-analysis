import { Model, DataTypes } from "sequelize";
import type {
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    Sequelize
} from "sequelize";

export class Sync extends Model<
    InferAttributes<Sync>,
    InferCreationAttributes<Sync>
> {
    declare id: CreationOptional<number>;
    declare startTime: Date;
    declare endTime: Date | null;
    declare status: number;
    declare clients: number;
    declare domains: number;
    declare queries: number;
}

export const initSyncModel = (sequelize: Sequelize): void => {
    Sync.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            startTime: {
                type: DataTypes.DATE,
                allowNull: false
            },
            endTime: {
                type: DataTypes.DATE,
                allowNull: true
            },
            status: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            clients: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            domains: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            queries: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: "Sync"
        }
    );
};
