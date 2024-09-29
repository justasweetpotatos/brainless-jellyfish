const { SlashCommandSubcommandBuilder, CommandInteraction, EmbedBuilder, Colors } = require("discord.js");
const { SuwaClient } = require("../../client/bot");

module.exports = {
  data: new SlashCommandSubcommandBuilder().setName("bot-server-ping").setDescription("Get the ping to bot server."),
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {SuwaClient} client
   */
  async execute(interaction, client) {
    await interaction.deferReply({ fetchReply: true, ephemeral: true });

    const latency = (Date.now() - interaction.createdTimestamp) * 2;

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Pong !")
          .setColor(Colors.Blurple)
          .setTimestamp(Date.now())
          .addFields([{ name: `⏳ Ping to server:`, value: `\`${latency}\`ms` }]),
      ],
    });
  },
};
