import * as fs from "fs";
import {
  ChatInputCommandInteraction,
  Collection,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from "discord.js";

import SuwaClient from "../bot";
import { ClientError, ErrorCode } from "../utils/error/ClientError";
import * as path from "path";
import { ExecuteCommandInteractionFunction } from "../interfaces/ExecuteFunction";

class ClientSlashCommandBuilder extends SlashCommandBuilder {
  public readonly localFilePath: string;
  public execute: ExecuteCommandInteractionFunction = async (
    client: SuwaClient,
    interaction: ChatInputCommandInteraction
  ) => {
    await interaction.deferReply({ ephemeral: true });
    await interaction.editReply({ content: "Not active yet !" });
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

  loadSubcommandBuilderFolder() {
    const folder = this.localFilePath.replace(/\.(js|ts)$/, "");
    if (fs.existsSync(folder)) {
      fs.readdirSync(folder).forEach((item) => {
        if (!item.endsWith(".ts") && !item.endsWith(".js")) return;
        else {
          const builder = require(path.join(folder, item));
          if (builder instanceof ClientSlashCommandSubcommandBuilder) {
            this.addSubcommand(builder);
            this.subcommandBuilderCollection.set(builder.name, builder);
          } else if (builder instanceof ClientSlashCommandSubcommandGroupBuilder) {
            builder.loadSubcommandBuilderFolder();
            this.addSubcommandGroup(builder);
            this.subcommandBuilderCollection.set(builder.name, builder);
          } else throw new ClientError("Invalid builder type!", ErrorCode.BUILDER_UNDEFINED_OR_INVALID);
        }
      });
    }
  }

  static getCommandStackName(
    interaction: ChatInputCommandInteraction,
    parseStack: boolean = false
  ): string | Array<string> {
    const stack = [
      interaction.command?.name || "",
      interaction.options.getSubcommandGroup() || "",
      interaction.options.getSubcommand() || "",
    ];

    const filteredStack = stack.filter((item) => item !== "");

    if (parseStack) return filteredStack.join(" ").trimEnd();
    else return filteredStack;
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

  constructor(localFilePath: string) {
    super();

    this.localFilePath = localFilePath;
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
