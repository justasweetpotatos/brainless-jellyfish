const { ClientSlashCommandBuilder } = require("../../models/command");

module.exports = new ClientSlashCommandBuilder(__filename, __dirname)
  .setName("music")
  .setDescription("any")
  .setExecutor(async (interaction, client) => {});
