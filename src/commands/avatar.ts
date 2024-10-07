import { ActionRowBuilder, ButtonBuilder, ChatInputCommandInteraction } from "discord.js";
import SuwaClient from "../bot";
import { ClientSlashCommandBuilder } from "../models/ClientCommand";
import { userToGetAvatarOption } from "./commandOptions/userOptions";
import { craftActionRowButtonComponents } from "../utils/functions";

module.exports = new ClientSlashCommandBuilder(__filename)
  .setName("avatar")
  .setDescription("Get avatar from user or your avatar")
  .setExecutor(async (client: SuwaClient, interaction: ChatInputCommandInteraction) => {
    interaction.deferred ? "" : await interaction.deferReply({ fetchReply: true });

    const user = interaction.options.getUser("user");

    const content = user
      ? `**User: ${user.displayName}**\n[Avatar link](${user.avatarURL()})`
      : `**User: ${interaction.user.displayName}**\n[Avatar link](${interaction.user.avatarURL()})`;

    let actionRowBuilder: ActionRowBuilder<ButtonBuilder> = craftActionRowButtonComponents([
      client.componentManager.getButtonData("close-message-button").data,
    ]);
    await interaction.editReply({ content: content, components: [actionRowBuilder] });
  })

  .addUserOption(userToGetAvatarOption);
