const { ChatInputCommandInteraction } = require("discord.js");
const { PermissionFlagsBits } = require("discord-api-types/v10");
const { ClientSlashCommandBuilder } = require("../../models/command");
const { SuwaClient } = require("../../client/client");

module.exports = new ClientSlashCommandBuilder(__filename, __dirname)
  .setName("purge")
  .setDescription("any")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
  .setExecutor(
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {SuwaClient} client
     */
    async (interaction, client) => {}
  );