import { AutocompleteInteraction, ButtonInteraction, ChatInputCommandInteraction } from "discord.js";
import SuwaClient from "../../bot";

export interface ExecuteCommandInteractionFunction {
  (client: SuwaClient, interaction: ChatInputCommandInteraction): Promise<void>;
}

export interface ExecuteAutocompleteCommandInteractionFunction {
  (client: SuwaClient, interaction: AutocompleteInteraction): Promise<void>;
}

export interface ExecuteButtonInteractionFunction {
  (client: SuwaClient, interaction: ButtonInteraction): Promise<void>;
}

export interface ExecuteEventFunction {
  (client: SuwaClient, ...args: any[]): Promise<void>;
}



// declare type ExecuteCommandInteractionFunction = (
//   client: SuwaClient,
//   interaction: ChatInputCommandInteraction
// ) => Promise<void>;

// declare type ExecuteAutocompleteCommandInteractionFunction = (
//   client: SuwaClient,
//   interaction: AutocompleteInteraction
// ) => Promise<void>;
