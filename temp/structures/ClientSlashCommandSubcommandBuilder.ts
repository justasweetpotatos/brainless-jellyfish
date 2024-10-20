import { SlashCommandSubcommandBuilder } from "discord.js";

import { defaultAutocompleteExecuteFunction, defaultCommandExecuteFunction } from "../utils/defaultFunctions";
import {
  ExecuteAutocompleteCommandInteractionFunction,
  ExecuteCommandInteractionFunction,
} from "./interface/executeFunctions";

class ClientSlashCommandSubcommandBuilder extends SlashCommandSubcommandBuilder {
  public readonly localFilePath;
  public execute: ExecuteCommandInteractionFunction = defaultCommandExecuteFunction;
  public autocompleteExecute: ExecuteAutocompleteCommandInteractionFunction = defaultAutocompleteExecuteFunction;

  constructor(localFilePath: string) {
    super();
    this.localFilePath = localFilePath;
  }

  setAutocompleteExecutor(execute: ExecuteAutocompleteCommandInteractionFunction) {
    this.autocompleteExecute = execute;
    return this;
  }

  setExecutor(execute: ExecuteCommandInteractionFunction): ClientSlashCommandSubcommandBuilder {
    this.execute = execute;
    return this;
  }
}

export default ClientSlashCommandSubcommandBuilder;
