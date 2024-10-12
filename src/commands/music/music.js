const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
} = require("discord.js");

const play = require("./play");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("music")
    .setDescription("any")
    .addSubcommand(play.data),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {},
};
