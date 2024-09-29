const { SlashCommandSubcommandBuilder, CommandInteraction, Colors } = require("discord.js");
const { EmbedBuilder } = require("@discordjs/builders");
const { SuwaClient } = require("../../client/bot");

module.exports = {
  data: new SlashCommandSubcommandBuilder().setName("overview").setDescription("Gett the ping of bot."),
  /**
   * @param {CommandInteraction} interaction
   * @param {SuwaClient} client
   */
  async execute(interaction, client) {
    await interaction.deferReply({ fetchReply: true });
    const latency = Date.now() - interaction.createdTimestamp;
    const apiLatency = client.ws.ping;

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Pong !")
          .setColor(Colors.Blurple)
          .setTimestamp(Date.now())
          .addFields([
            { name: "⏱ API Latency:", value: `\`${apiLatency}\`ms`, inline: true },
            { name: `⏳ Client ping:`, value: `\`${latency}\`ms`, inline: true },
          ]),
      ],
    });
  },
};
