import { SlashCommandStringOption } from "discord.js";

export const containSubstringToDeleteMessageOption = new SlashCommandStringOption()
  .setName("contain")
  .setDescription("Enter a substring.")
  .setNameLocalization("vi", "bao-gồm-nội-dung")
  .setDescriptionLocalization("vi", "Nhập vào nội dung.")
  .setRequired(true);
