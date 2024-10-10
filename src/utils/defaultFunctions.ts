import { AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js";
import SuwaClient from "../bot";
import {
  ExecuteAutocompleteCommandInteractionFunction,
  ExecuteCommandInteractionFunction,
} from "../structures/interface/executeFunctions";

export const defaultCommandExecuteFunction: ExecuteCommandInteractionFunction = async (
  client: SuwaClient,
  interaction: ChatInputCommandInteraction
) => {
  await interaction.deferReply({ ephemeral: true });
  await interaction.editReply({ content: "Not active yet !" });
};

export const defaultAutocompleteExecuteFunction: ExecuteAutocompleteCommandInteractionFunction = async (
  client: SuwaClient,
  interaction: AutocompleteInteraction
) => {
  await interaction.respond([]);
};
