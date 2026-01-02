// backend/src/models/Journal.js
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../db/sequelize");

class Journal extends Model {}

Journal.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        entryText: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        visitDate: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        destinationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Journal",
        tableName: "journals",
        timestamps: true,
    }
);

module.exports = Journal;
