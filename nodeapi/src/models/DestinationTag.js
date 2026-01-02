// backend/src/models/DestinationTag.js
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../db/sequelize");

class DestinationTag extends Model {}

DestinationTag.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        destinationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        tagId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "DestinationTag",
        tableName: "destination_tags",
        timestamps: false,
    }
);

module.exports = DestinationTag;
