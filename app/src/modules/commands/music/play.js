const { SlashCommandStringOption, ChatInputCommandInteraction } = require("discord.js");
const { ClientSlashCommandSubcommandBuilder } = require("../../../models/command");
const { SuwaClient } = require("../../../client/client");

module.exports = new ClientSlashCommandSubcommandBuilder(__filename)
  .setName("play")
  .setDescription("Play music with url (youtube only)")
  .addStringOption(
    new SlashCommandStringOption()
      .setName("url")
      .setDescription("Url of the song or playlist you want to play")
      .setRequired(true)
  )
  .setExecutor(
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {SuwaClient} client
     */
    async (interaction, client) => {
      interaction.deferred ? "" : interaction.deferReply({ fetchReply: true });
      const url = interaction.options.get("url").value;
    }
  );
