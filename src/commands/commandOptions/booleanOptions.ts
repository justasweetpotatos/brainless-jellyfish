import { SlashCommandBooleanOption } from "discord.js";

export const autoRoleSetCreateMessageWithEmbedOption = new SlashCommandBooleanOption()
  .setName("create-embed")
  .setDescription("Create with embed or not")
  .setRequired(true);

export const getAvatarInGuildOption = new SlashCommandBooleanOption()
  .setName("in-guild")
  .setNameLocalization("vi", "trong-guild")
  .setDescription("Get default avatar or in guild avatar.")
  .setDescriptionLocalization("vi", "Lấy hình đại diện mặc định hoặc trong hình đại diện trong guild.");
