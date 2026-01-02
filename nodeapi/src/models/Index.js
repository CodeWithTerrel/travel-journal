// backend/src/models/index.js
const sequelize = require("../db/sequelize");
const User = require("./User");
const Destination = require("./Destination");
const Journal = require("./Journal");
const Tag = require("./Tag");
const DestinationTag = require("./DestinationTag");

// User -> Destination (one-to-many)
User.hasMany(Destination, { foreignKey: "userId" });
Destination.belongsTo(User, { foreignKey: "userId" });

// User -> Journal (one-to-many)
User.hasMany(Journal, { foreignKey: "userId" });
Journal.belongsTo(User, { foreignKey: "userId" });

// Destination -> Journal (one-to-many)
Destination.hasMany(Journal, { foreignKey: "destinationId" });
Journal.belongsTo(Destination, { foreignKey: "destinationId" });

// Destination <-> Tag (many-to-many via DestinationTag)
Destination.belongsToMany(Tag, {
    through: DestinationTag,
    foreignKey: "destinationId",
    otherKey: "tagId",
});
Tag.belongsToMany(Destination, {
    through: DestinationTag,
    foreignKey: "tagId",
    otherKey: "destinationId",
});

module.exports = {
    sequelize,
    User,
    Destination,
    Journal,
    Tag,
    DestinationTag,
};
