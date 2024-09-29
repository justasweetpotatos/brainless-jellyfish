const { ClientSlashCommandSubcommandGroupBuilder } = require("../../../models/command");

module.exports = new ClientSlashCommandSubcommandGroupBuilder(__filename, __dirname)
  .setName("manage")
  .setDescription("any");
