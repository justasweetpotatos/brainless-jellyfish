const { ChatInputCommandInteraction } = require("discord.js");
const {
  ClientSlashCommandSubcommandBuilder,
} = require("../../src_v2/typings/command");

module.exports = new ClientSlashCommandSubcommandBuilder(__filename)
  .setName("reload")
  .setDescription("any")
  .setExecutor(
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {SuwaClient} client
     */
    async (interaction, client) => {}
  );
