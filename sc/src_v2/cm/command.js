const { ChatInputCommandInteraction } = require("discord.js");
const { ClientSlashCommandBuilder } = require("../typings/command");
const { SuwaClient } = require("../client/bot");

module.exports = new ClientSlashCommandBuilder()
  .setName("command")
  .setDescription("any")
  .setExecutor(
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {SuwaClient} client
     */
    async (interaction, client) => {}
  );
