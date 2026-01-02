// backend/src/models/Tag.js
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../db/sequelize");

class Tag extends Model {}

Tag.init(
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
        // "mood" or "activity"
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Tag",
        tableName: "tags",
        timestamps: true,
    }
);

module.exports = Tag;
