const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Guild = sequelize.define(
  "Guild",
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "guild",
    timestamps: false,
  }
);


Guild.sync();

module.exports = Guild;