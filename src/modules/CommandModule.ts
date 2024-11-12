import {
  CommandInteraction,
  ChatInputCommandInteraction,
  Message,
  Collection,
  AutocompleteInteraction,
  Routes,
  RESTPostAPIApplicationCommandsJSONBody,
  Guild,
} from "discord.js";
import { BotModule } from "../structure/BotModule";
import { BotModuleOptions } from "../structure/interface/module";
import ClientSlashCommandBuilder from "../structure/SlashCommandBuilder";
import path = require("path");
import fs = require("fs");
import ClientError from "../error/ClientError";
import { ErrorCode } from "../error/ClientErrorCode";

export interface CommandModuleOptions extends BotModuleOptions {}

export class CommandModule extends BotModule<CommandModuleOptions> {
  private readonly commandFolder = path.join(__dirname, "../commands");
  public readonly commandBuilderCollection = new Collection<string, ClientSlashCommandBuilder>();
  public applicationCommandsJSONBody: Array<RESTPostAPIApplicationCommandsJSONBody> = [];

  constructor(options: CommandModuleOptions) {
    super(options);

    this.pushBeforeActivateFunction(this.loadCommandsFromFolder);
    // this.pushBeforeActivateFunction(this.craftCommandsJSONBody);
    // this.pushBeforeActivateFunction(this.registerCommands);
  }

  async loadCommandsFromFolder() {
    if (!fs.existsSync(this.commandFolder))
      throw new ClientError("Folder of commands is not found !", ErrorCode.LOAD_COMMAND_FAILED);

    this.logger.log("Loading application (/) commands...");
    fs.readdirSync(this.commandFolder).forEach((commandFile) => {
      if (!commandFile.endsWith(".js") && !commandFile.endsWith(".ts")) return;

      try {
        const filePath = path.join(this.commandFolder, commandFile);
        const builder = require(filePath);
        if (builder instanceof ClientSlashCommandBuilder) {
          builder.loadSubcommands();
          this.commandBuilderCollection.set(builder.name, builder);
          this.logger.success(`Command loaded ${builder.name} in file: ${filePath}`);
        } else {
          throw new ClientError("Invalid variable !", ErrorCode.BUILDER_UNDEFINED_OR_INVALID);
        }
      } catch (error) {
        this.client.errorHandlerModule.handleSlashCommandError({
          error: error,
          logger: this.logger,
        });
      }
    });

    this.logger.log(`Loaded total ${this.commandBuilderCollection.size} application (/) commands...`);
  }

  async reloadCommands() {
    this.commandBuilderCollection.clear();
    this.logger.success("Cleared all appliction (/) commands!");
    this.loadCommandsFromFolder();
  }

  private craftCommandsJSONBody() {
    this.logger.log("Refreshing application (/) commands JSON body!");
    this.applicationCommandsJSONBody = [];
    this.commandBuilderCollection.forEach((commandBuilder) => {
      this.applicationCommandsJSONBody.push(commandBuilder.toJSON());
    });
    this.logger.success(`Refreshing JSON body successfully! Total: ${this.commandBuilderCollection.size}`);
    return this.applicationCommandsJSONBody;
  }

  async registerCommands() {
    try {
      let guilds;
      if (this.workMode === "debug") {
        const defaultGuild = await this.client.guilds.fetch("811939594882777128");
        if (!defaultGuild) return;
        guilds = new Collection<string, Guild>().set(defaultGuild.id, defaultGuild);
      } else {
        guilds = await this.client.guilds.fetch();
      }
      this.logger.log("Start registering application (/) commands...");
      this.craftCommandsJSONBody();

      guilds.forEach(async (guild, id) => {
        try {
          const route = Routes.applicationGuildCommands(this.client.botId, guild.id);
          await this.client.rest.put(route, { body: this.applicationCommandsJSONBody });
          if (this.workMode == "debug") {
            this.logger.success(`Registered command for guild default named: ${guild.name}-${guild.id}`);
          }
        } catch (error) {
          this.client.errorHandlerModule.handleSlashCommandError({
            error: error,
            logger: this.logger,
          });
        }
      });

      this.logger.success(`Registered application (/) commands for ${guilds.size} guilds!`);
    } catch (error) {
      this.client.errorHandlerModule.handleSlashCommandError({
        error: error,
        logger: this.logger,
      });
    }
  }

  async executeCommandInteraction(interaction: CommandInteraction | ChatInputCommandInteraction) {
    try {
      const command = this.commandBuilderCollection.get(interaction.commandName);
      if (!command) throw new ClientError("Builder is not found!", ErrorCode.BUILDER_UNDEFINED_OR_INVALID);

      const execute = command.getExecutor(ClientSlashCommandBuilder.getStackName(interaction));
      if (!execute) throw new ClientError("", ErrorCode.EXECUTOR_UNDEFINED_OR_INVALID);
      await execute(this.client, interaction);
    } catch (error) {
      await this.client.errorHandlerModule.handleSlashCommandError({
        error: error,
        logger: this.logger,
        interaction: interaction,
      });
    }
  }

  async executeAutocompleteCommandInteraction(interaction: AutocompleteInteraction) {
    try {
      const command = this.commandBuilderCollection.get(interaction.commandName);
      if (!command) throw new ClientError("Builder is not found!", ErrorCode.BUILDER_UNDEFINED_OR_INVALID);

      const execute = command.getAutocompleteExecutor(
        ClientSlashCommandBuilder.getStackName(interaction, false)
      );
      if (!execute) throw new ClientError("", ErrorCode.EXECUTOR_UNDEFINED_OR_INVALID);
      await execute(this.client, interaction);
    } catch (error) {
      this.client.errorHandlerModule.handleSlashCommandError({
        error: error,
        logger: this.logger,
      });
    }
  }

  async pushInteraction(interaction: CommandInteraction | ChatInputCommandInteraction): Promise<void> {
    await this.executeCommandInteraction(interaction);
  }

  async pushMessageEvent(message: Message): Promise<void> {}

  async pushGuildEvent(): Promise<void> {}

  async pushMemberEvent(): Promise<void> {}
}
