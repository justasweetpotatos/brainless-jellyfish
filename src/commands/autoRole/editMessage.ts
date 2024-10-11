import { ChatInputCommandInteraction, CommandInteraction, embedLength } from "discord.js";
import SuwaClient from "../../bot";
import ClientSlashCommandSubcommandBuilder from "../../structures/ClientSlashCommandSubcommandBuilder";
import { setMessageIdOption } from "../commandOptions/stringOptions";
import { autoDeferReply, createEmbedWithTimestampAndCreateUser } from "../../utils/functions";

module.exports = new ClientSlashCommandSubcommandBuilder(__filename)
  .setName("edit-message")
  .setDescription("Edit the autorole message.")
  .setExecutor(async (client: SuwaClient, interaction: ChatInputCommandInteraction) => {
    await autoDeferReply(interaction);
    const messageId = interaction.options.getString("message-id", true);
    const message = await interaction.channel?.messages.fetch(messageId);
    const replyEmbed = createEmbedWithTimestampAndCreateUser(interaction);

    if (!message) {
      replyEmbed
        .setTitle("Message not found !")
        .setDescription("Please check the message id is valid or from bot.")
        .setColor("Yellow");
      await interaction.editReply({ embeds: [replyEmbed] });
      return;
    }

    if (message.author.id !== client.user?.id) {
      replyEmbed
        .setTitle("Not bot message !")
        .setDescription("Please Provide the message id of bot message (Sứa).")
        .setColor("Yellow");
      await interaction.editReply({ embeds: [replyEmbed] });
      return;
    }

    if (!interaction.guild) return;
    const manager = client.autoRoleManager.callGuildManager(interaction.guild);
    // await manager.sendMessageEditingInterface(interaction, message);
  })
  .addStringOption(setMessageIdOption);
