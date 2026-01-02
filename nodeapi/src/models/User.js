// backend/src/models/User.js
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../db/sequelize");

class User extends Model {}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        displayName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        // Matches your existing "password" column (plain text in current setup)
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "",
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "user", // "user" | "admin"
        },
    },
    {
        sequelize,
        modelName: "User",
        tableName: "users",
        timestamps: true, // uses createdAt / updatedAt columns if they exist
    }
);

module.exports = User;
