const {
  SlashCommandBuilder,
  PermissionsBitField,
  SlashCommandStringOption,
  CommandInteraction,
} = require("discord.js");
const { SuwaClient } = require("../client/bot");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("command")
    .setDescription("any")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {SuwaClient} client
   */
  async execute(interaction, client) {},
};
