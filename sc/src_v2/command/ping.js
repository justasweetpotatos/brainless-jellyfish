const { SlashCommandBuilder, CommandInteraction, Colors } = require("discord.js");
const { SuwaClient } = require("../client/bot");
const { EmbedBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Gett the ping of bot."),
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
            { name: "⏱ API Latency:", value: `\`${apiLatency}\``, inline: true },
            { name: `⏳ Client ping:`, value: `\`${latency}\``, inline: true },
          ]),
      ],
    });
  },
};

("D:/VS_Code_Workspace/js/suwa_js/src/commands/ping");
