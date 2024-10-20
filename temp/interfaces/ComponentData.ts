import { ButtonBuilder, ButtonStyle, Emoji } from "discord.js";
import { ExecuteButtonInteractionFunction } from "../structures/interface/executeFunctions";

export interface ButtonData {
  customId: string;
  data: ButtonBuilder;
  deferedInteraction?: boolean;
  ephemeralInteraction?: boolean;
  execute: ExecuteButtonInteractionFunction;
}

export interface AutoroleButtonData {
  typeId: string;
  uniqueId: string;
  customId: string;
  roleId: string;

  label: string;
  style?: ButtonStyle;
  emojiId?: string;
}
