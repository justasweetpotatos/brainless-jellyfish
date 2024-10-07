import { SlashCommandRoleOption, SlashCommandStringOption } from "discord.js";

export const containSubstringToDeleteMessageOption = new SlashCommandStringOption()
  .setName("contain")
  .setDescription("Enter a substring.")
  .setNameLocalization("vi", "bao-gồm-nội-dung")
  .setDescriptionLocalization("vi", "Nhập vào nội dung.")
  .setRequired(true);

export const reactRoleTitleOption = new SlashCommandStringOption()
  .setName("title")
  .setDescription("any")
  .setRequired(true);

export const reactRoleDescriptionOption = new SlashCommandStringOption()
  .setName("description")
  .setDescription("any")
  .setRequired(true);

export const autoRoleCreateButtonLabelOption = new SlashCommandStringOption()
  .setName("label")
  .setDescription("Enter the button label")
  .setRequired(true);

export const autoRoleCreateButtonEmojiOption = new SlashCommandStringOption() 
  .setName("emoji")
  .setDescription("Enter the button emoji");

// Need fixed
export const autoRoleCreateButtonStyleOption = new SlashCommandStringOption()
  .setName("style")
  .setDescription("Enter the button style");

export const autoRoleSetButtonMessageIdOption = new SlashCommandStringOption()
  .setName("message-id")
  .setDescription("Enter id of message in this channel")
  .setRequired(true);

export const autoRoleSetButtonNameOption = new SlashCommandStringOption()
  .setName("button-name")
  .setDescription("Enter the name of created buttons")
  .setAutocomplete(true)
  .setRequired(true);
