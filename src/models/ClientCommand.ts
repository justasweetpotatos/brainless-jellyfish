import * as fs from "fs";
import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  Collection,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from "discord.js";

import SuwaClient from "../bot";
import { ClientError, ErrorCode } from "../utils/error/ClientError";
import * as path from "path";
import {
  ExecuteAutocompleteCommandInteractionFunction,
  ExecuteCommandInteractionFunction,
} from "../interfaces/ExecuteFunction";

class ClientSlashCommandBuilder extends SlashCommandBuilder {
  public readonly localFilePath: string;
  public execute: ExecuteCommandInteractionFunction = async (
    client: SuwaClient,
    interaction: ChatInputCommandInteraction
  ) => {
    await interaction.deferReply({ ephemeral: true });
    await interaction.editReply({ content: "Not active yet !" });
  };

  public autocompleteExecute: ExecuteAutocompleteCommandInteractionFunction = async (
    client: SuwaClient,
    interaction: AutocompleteInteraction
  ) => {
    await interaction.respond([]);
  };

  public subcommandBuilderCollection: Collection<
    string,
    ClientSlashCommandSubcommandBuilder | ClientSlashCommandSubcommandGroupBuilder
  >;

  constructor(localFilePath: string) {
    super();
    this.localFilePath = localFilePath;
    this.subcommandBuilderCollection = new Collection<
      string,
      ClientSlashCommandSubcommandBuilder | ClientSlashCommandSubcommandGroupBuilder
    >();
  }

  setExecutor(execute: ExecuteCommandInteractionFunction): ClientSlashCommandBuilder {
    this.execute = execute;
    return this;
  }

  setAutocompleteExecutor(execute: ExecuteAutocompleteCommandInteractionFunction) {
    this.autocompleteExecute = execute;
  }

  loadSubcommandBuilderFolder() {
    const folder = this.localFilePath.replace(/\.(js|ts)$/, "");
    if (fs.existsSync(folder)) {
      fs.readdirSync(folder).forEach((item) => {
        if (!item.endsWith(".ts") && !item.endsWith(".js")) return;
        else {
          const subcommandBuilderPath = path.join(folder, item);
          const subcommandBuilder = require(subcommandBuilderPath);

          const b = 12312;
          if (subcommandBuilder instanceof ClientSlashCommandSubcommandBuilder) {
            this.addSubcommand(subcommandBuilder);
            this.subcommandBuilderCollection.set(subcommandBuilder.name, subcommandBuilder);
          } else if (subcommandBuilder instanceof ClientSlashCommandSubcommandGroupBuilder) {
            subcommandBuilder.loadSubcommandBuilderFolder();
            this.addSubcommandGroup(subcommandBuilder);
            this.subcommandBuilderCollection.set(subcommandBuilder.name, subcommandBuilder);
          } else throw new ClientError("Invalid builder type!", ErrorCode.BUILDER_UNDEFINED_OR_INVALID);
        }
      });
    }
  }

  static getCommandStackName(
    interaction: ChatInputCommandInteraction | AutocompleteInteraction,
    parseStack: boolean = false
  ): string | Array<string> {
    const commandParts: Array<string> = [interaction.commandName];

    try {
      commandParts.push(interaction.options.getSubcommandGroup() ?? "");
    } catch (error) {}

    try {
      commandParts.push(interaction.options.getSubcommand() ?? "");
    } catch (error) {}

    const filteredParts = commandParts.filter((item) => item !== "");

    return parseStack ? filteredParts.join(" ").trimEnd() : filteredParts;
  }

  getExecutor(commandStackName: string | Array<string>): ExecuteCommandInteractionFunction | undefined {
    let components: Array<string> = [];
    if (typeof commandStackName == "string") components = commandStackName.split(" ");
    else components = commandStackName;

    const subBuilder = this.subcommandBuilderCollection.get(components.at(1) ?? "");
    switch (components.length) {
      case 1:
        return this.execute;
      case 2:
        if (subBuilder && subBuilder instanceof ClientSlashCommandSubcommandBuilder) return subBuilder.execute;
        else return undefined;
      case 3:
        if (subBuilder && subBuilder instanceof ClientSlashCommandSubcommandGroupBuilder)
          return subBuilder.subcommandBuilderCollection.get(components.at(2) ?? "")?.execute;
        else return undefined;
      default:
        return undefined;
    }
  }

  getAutocompleteExecutor(
    commandStackName: string | Array<string>
  ): ExecuteAutocompleteCommandInteractionFunction | undefined {
    let components: Array<string> = [];
    if (typeof commandStackName == "string") components = commandStackName.split(" ");
    else components = commandStackName;

    const subBuilder = this.subcommandBuilderCollection.get(components.at(1) ?? "");
    switch (components.length) {
      case 1:
        return this.autocompleteExecute;
      case 2:
        if (subBuilder && subBuilder instanceof ClientSlashCommandSubcommandBuilder)
          return subBuilder.autocompleteExecute;
        else return undefined;
      case 3:
        if (subBuilder && subBuilder instanceof ClientSlashCommandSubcommandGroupBuilder)
          return subBuilder.subcommandBuilderCollection.get(components.at(2) ?? "")?.autocompleteExecute;
        else return undefined;
      default:
        return undefined;
    }
  }
}

class ClientSlashCommandSubcommandBuilder extends SlashCommandSubcommandBuilder {
  public readonly localFilePath;
  public execute: ExecuteCommandInteractionFunction = async (
    client: SuwaClient,
    interaction: ChatInputCommandInteraction
  ) => {
    await interaction.deferReply({ ephemeral: true });
    await interaction.editReply({ content: "Not active yet !" });
  };
  public autocompleteExecute: ExecuteAutocompleteCommandInteractionFunction = async (
    client: SuwaClient,
    interaction: AutocompleteInteraction
  ) => {
    await interaction.respond([]);
  };

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

class ClientSlashCommandSubcommandGroupBuilder extends SlashCommandSubcommandGroupBuilder {
  public readonly localFilePath: string;
  public subcommandBuilderCollection: Collection<string, ClientSlashCommandSubcommandBuilder>;
  constructor(localFilePath: string) {
    super();

    this.localFilePath = localFilePath;
    this.subcommandBuilderCollection = new Collection<string, ClientSlashCommandSubcommandBuilder>();
  }

  loadSubcommandBuilderFolder() {
    const folder = this.localFilePath.replace(".js", "");
    if (fs.existsSync(folder)) {
      fs.readdirSync(folder).forEach((item) => {
        if (item.endsWith(".ts")) {
          const builder = require(path.join(folder, item));
          if (builder instanceof ClientSlashCommandSubcommandBuilder) {
            this.addSubcommand(builder);
            this.subcommandBuilderCollection.set(builder.name, builder);
          } else throw new ClientError("Invalid builder type!", ErrorCode.BUILDER_UNDEFINED_OR_INVALID);
        }
      });
    }
  }
}

export { ClientSlashCommandBuilder, ClientSlashCommandSubcommandBuilder };
