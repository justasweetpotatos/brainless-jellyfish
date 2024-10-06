import { SlashCommandNumberOption } from "discord.js";

export const numberToDeleteMessageOption = new SlashCommandNumberOption()
  .setName("amount")
  .setNameLocalization("vi", "số-lượng")
  .setDescription("Amount of message to search.")
  .setDescriptionLocalization("vi", "Số lượng tin nhắn cần tìm kiếm")
  .setRequired(true);
