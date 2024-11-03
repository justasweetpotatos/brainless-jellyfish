import {
  CommandInteraction,
  ChatInputCommandInteraction,
  Message,
  Collection,
  Events,
  AutocompleteInteraction,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
  RESTGetAPIApplicationGuildCommandsResult,
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

  constructor(options: CommandModuleOptions) {
    super(options);
  }

  async registerCommandForDefaultGuild() {
    const defaultGuild = this.client.guilds.cache.get("811939594882777128");
    if (defaultGuild) {
      const route = Routes.applicationGuildCommands(this.client.botId, defaultGuild.id);
      const jsonBody: Array<RESTPostAPIChatInputApplicationCommandsJSONBody> = [];
      this.commandBuilderCollection.forEach((slashCommadnBuilder) => {
        jsonBody.push(slashCommadnBuilder.toJSON());
      });

      await this.client.rest.put(route, { body: jsonBody });

      this.logger.success(`Registered command for guild default named: ${defaultGuild.name}-${defaultGuild.id}`);
    }
  }

  async reloadCommands() {
    this.loadCommands();
    const defaultGuild = this.client.guilds.cache.get("811939594882777128");
    if (defaultGuild) {
      const route = Routes.applicationGuildCommands(this.client.botId, defaultGuild.id);

      // Lấy danh sách các lệnh hiện tại
      const currentCommands = (await this.client.rest.get(route)) as RESTGetAPIApplicationGuildCommandsResult;

      // Xóa từng lệnh hiện tại
      const deletePromises = currentCommands.map(async (command) => {
        await this.client.rest.delete(`${route}/${command.id}`);
        this.logger.log(`Remove command: ${command.name}`);
      });

      await Promise.all(deletePromises);

      // Đăng ký lại các lệnh
      const jsonBody: Array<any> = [];
      this.commandBuilderCollection.forEach((slashCommandBuilder) => {
        jsonBody.push(slashCommandBuilder.toJSON());
      });

      await this.client.rest.put(route, { body: jsonBody });

      this.logger.success(`Reloaded commands for guild: ${defaultGuild.name}-${defaultGuild.id}`);
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

      const execute = command.getAutocompleteExecutor(ClientSlashCommandBuilder.getStackName(interaction, false));
      if (!execute) throw new ClientError("", ErrorCode.EXECUTOR_UNDEFINED_OR_INVALID);
      await execute(this.client, interaction);
    } catch (error) {
      await this.client.errorHandlerModule.handleSlashCommandError({
        error: error,
        logger: this.logger,
      });
    }
  }

  loadCommands() {
    if (!fs.existsSync(this.commandFolder))
      throw new ClientError("Commands folder is invalid !", ErrorCode.LOAD_COMMAND_FAILED);

    if (this.commandBuilderCollection.size > 0) {
      this.commandBuilderCollection.clear();
      this.logger.log("Cleared all application (/) commands...");
    }

    this.logger.log("Loading application (/) commands...");

    fs.readdirSync(this.commandFolder).forEach((file) => {
      if (!file.endsWith(".ts") && !file.endsWith(".js")) return;
      else
        try {
          const builder = require(path.join(this.commandFolder, file));
          if (builder instanceof ClientSlashCommandBuilder) {
            builder.loadSubcommands();
            this.commandBuilderCollection.set(builder.name, builder);
            this.logger.success(`Loaded command: ${builder.name}`);
          } else
            throw new ClientError(
              `Required ClientSlashComamndBuilder instead of ${typeof builder}`,
              ErrorCode.BUILDER_UNDEFINED_OR_INVALID
            );
        } catch (error) {
          this.client.errorHandlerModule.handleSlashCommandError({
            error: error,
            logger: this.logger,
          });
        }
    });

    this.logger.success(`Loaded total: ${this.commandBuilderCollection.size} application (/) commands`);
  }

  // async activateModule(): Promise<void> {
  //   this.setWorkMode("enable");
  //   this.loadCommands();
  //   await this.registerCommandForDefaultGuild();
  //   this.on(Events.InteractionCreate, (interaction) => this.pushInteraction(interaction));
  // }

  // async unactivateModule(): Promise<void> {
  //   this.removeAllListeners();
  // }

  async pushInteraction(interaction: CommandInteraction | ChatInputCommandInteraction): Promise<void> {
    await this.executeCommandInteraction(interaction);
  }

  async pushMessageEvent(message: Message): Promise<void> {}

  async pushGuildEvent(): Promise<void> {}

  async pushMemberEvent(): Promise<void> {}
}
