const { SlashCommandNumberOption, ChatInputCommandInteraction, Colors, EmbedBuilder } = require("discord.js");
const { ClientSlashCommandSubcommandBuilder } = require("../../../models/command");
const { SuwaClient } = require("../../../client/client");
const { findMessage } = require("../funtions/messageFinder");

module.exports = new ClientSlashCommandSubcommandBuilder(__filename)
  .setName("all")
  .setDescription("Delete all message with input quantity")
  .addNumberOption(
    new SlashCommandNumberOption()
      .setName("quantity")
      .setDescription("Quantity of message you want to delete from the lastest message")
      .setRequired(true)
      .setMaxValue(500)
      .setMinValue(1)
  )
  .setExecutor(
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {SuwaClient} client
     */
    async (interaction, client) => {
      interaction.deferred ? "" : await interaction.deferReply({ fetchReply: true });
      const quantity = interaction.options.get("quantity").value;

      const result = await findMessage({ channel: interaction.channel, quantity: quantity });

      let embedDescription = ``;
      result.userData.forEach((messages, userId) => (embedDescription += `> **<@${userId}>:** ${messages.length}\n`));

      const successfulEmbed = new EmbedBuilder({
        author: { name: "Messages Deleted !" },
        title: `${result.collection1.size + result.colleciton2.size} messages have been deleted`,
        description: embedDescription,
        color: Colors.Green,
        timestamp: Date.now(),
        footer: {
          // not done yet
          text: `⏳ Ping to server: ${client.getStatus(interaction).latency}ms`,
        },
      });
      const noMessageDeletedEmbed = new EmbedBuilder({
        author: { name: "No Message Found !" },
        title: `${result.collection1.size + result.colleciton2.size} messages have been deleted`,
        description: `
                > *Make sure your messages you want to delete *
                > *is in range ${quantity} from the lastest message.*
            `,
        color: Colors.Yellow,
        timestamp: Date.now(),
        footer: {
          // not done yet
          text: `⏳ Ping to server: ${client.getStatus(interaction).latency}ms`,
        },
      });

      await interaction.channel.bulkDelete(result.collection1);
      result.colleciton2.forEach(async (message, id) => await message.delete());

      await interaction.editReply({
        embeds: [result.collection1.size + result.colleciton2.size == 0 ? noMessageDeletedEmbed : successfulEmbed],
      });
      setTimeout(async () => {
        await interaction.deleteReply();
      }, 5000);
    }
  );
