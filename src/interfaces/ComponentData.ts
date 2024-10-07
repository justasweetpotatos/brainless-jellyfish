import { ButtonBuilder } from "discord.js";
import { ExecuteButtonInteractionFunction } from "./ExecuteFunction";

export interface ButtonData {
  customId: string;
  data: ButtonBuilder;
  deferedInteraction?: boolean;
  ephemeralInteraction?: boolean;
  execute: ExecuteButtonInteractionFunction;
}
