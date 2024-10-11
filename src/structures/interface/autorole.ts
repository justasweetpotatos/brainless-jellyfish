import { ButtonStyle, Collection, Colors } from "discord.js";

export interface GuildAutoroleConfig {
  guildId: string;
  autoroleMessagesContent: Collection<string, AutoroleMessageContent>;
  autoroleButtonsData: Collection<string, AutoroleButtonData>;
}

export interface AutoroleMessageContent {
  id: string;
  title?: string;
  description?: string;
  color?: typeof Colors;
}

export interface AutoroleButtonData {
  id: string;
  roleId: string;
  customId?: string;
  emojiId?: string;
  label: string;
  style?: ButtonStyle;
}

