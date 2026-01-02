// backend/src/models/Destination.js
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../db/sequelize");

class Destination extends Model {}

Destination.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 3,
        },
        imageFilename: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "pending", // "pending" | "approved" | "rejected"
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true, // if some destinations were created before user system
        },
    },
    {
        sequelize,
        modelName: "Destination",
        tableName: "destinations",
        timestamps: true,
    }
);

module.exports = Destination;
