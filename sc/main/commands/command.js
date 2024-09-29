const { ClientSlashCommandBuilder } = require("../../../src_v2/typings/command");

module.exports = new ClientSlashCommandBuilder(__filename, __dirname)
  .setName("command")
  .setDescription("any");
