import { ActionRowBuilder, ButtonBuilder, ChatInputCommandInteraction } from "discord.js";
import SuwaClient from "../bot";
import { ClientSlashCommandBuilder } from "../models/ClientCommand";
import { userToGetAvatarOption } from "./commandOptions/userOptions";
import { autoDeferReply, craftActionRowButtonComponents } from "../utils/functions";
import { getAvatarInGuildOption } from "./commandOptions/booleanOptions";

module.exports = new ClientSlashCommandBuilder(__filename)
  .setName("avatar")
  .setDescription("Get avatar from user or your avatar")
  .setExecutor(async (client: SuwaClient, interaction: ChatInputCommandInteraction) => {
    await autoDeferReply(interaction);

    const user = interaction.options.getUser("user") ?? interaction.user;
    const inGuild = interaction.options.getBoolean("in-guild");
    const member = await interaction.guild?.members.fetch(user.id);

    if (!member) return;

    const ava1 = user.avatarURL();
    const ava2 = member.avatarURL();

    const avaLink = inGuild ? user.avatarURL() : member.avatarURL();
    const content = avaLink ? `**User: ${user.displayName}**\n[Avatar link](${avaLink})` : `No avatar found !`;

    let actionRowBuilder: ActionRowBuilder<ButtonBuilder> = craftActionRowButtonComponents([
      client.componentManager.getButtonData("close-message-button").data,
    ]);
    await interaction.editReply({ content: content, components: [actionRowBuilder] });
  })

  .addUserOption(userToGetAvatarOption)
  .addBooleanOption(getAvatarInGuildOption);
