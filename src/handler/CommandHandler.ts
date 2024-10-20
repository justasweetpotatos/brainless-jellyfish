import * as path from "path";
import * as fs from "fs";
import { Logger } from "../utils/Logger";
import { AutocompleteInteraction, ChatInputCommandInteraction, Collection } from "discord.js";
import ClientSlashCommandBuilder from "../structure/SlashCommandBuilder";
import SuwaBot from "../bot/SuwaBot";
import ClientError from "../error/ClientError";
import { ErrorCode } from "../error/ClientErrorCode";

class CommandHandler {
  private readonly client: SuwaBot;
  private readonly logger: Logger;
  private readonly commandFolder: string;

  public commandCollection: Collection<string, ClientSlashCommandBuilder>;

  constructor(client: SuwaBot) {
    this.client = client;
    this.logger = new Logger("command-handler", client.logPrinter);

    this.commandFolder = path.join(__dirname, "../commands");
    this.commandCollection = new Collection<string, ClientSlashCommandBuilder>();
  }

  async executeCommandInteraction(interaction: ChatInputCommandInteraction) {
    try {
      const command = this.commandCollection.get(interaction.commandName);
      if (!command) throw new ClientError("Builder is not found!", ErrorCode.BUILDER_UNDEFINED_OR_INVALID);

      const execute = command.getExecutor(ClientSlashCommandBuilder.getStackName(interaction, false));
      if (!execute) throw new ClientError("", ErrorCode.EXECUTOR_UNDEFINED_OR_INVALID);
      await execute(this.client, interaction);
    } catch (error) {
      // await this.client.errorHandler.handleSlashCommandError({
      //   error: error,
      //   logger: this.logger,
      //   interaction: interaction,
      // });
    }
  }

  async executeAutocompleteCommandInteraction(interaction: AutocompleteInteraction) {
    try {
      const command = this.commandCollection.get(interaction.commandName);
      if (!command) throw new ClientError("Builder is not found!", ErrorCode.BUILDER_UNDEFINED_OR_INVALID);

      const execute = command.getAutocompleteExecutor(ClientSlashCommandBuilder.getStackName(interaction, false));
      if (!execute) throw new ClientError("", ErrorCode.EXECUTOR_UNDEFINED_OR_INVALID);
      await execute(this.client, interaction);
    } catch (error) {
      // await this.client.errorHandler.handleSlashCommandError({
      //   error: error,
      //   logger: this.logger,
      // });
    }
  }

  loadCommands() {
    if (!fs.existsSync(this.commandFolder))
      throw new ClientError("Commands folder is invalid !", ErrorCode.LOAD_COMMAND_FAILED);

    if (this.commandCollection.size > 0) {
      this.commandCollection.clear();
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
            this.commandCollection.set(builder.name, builder);
            this.logger.success(`Loaded command: ${builder.name}`);
          } else
            throw new ClientError(
              `Required ClientSlashComamndBuilder instead of ${typeof builder}`,
              ErrorCode.BUILDER_UNDEFINED_OR_INVALID
            );
        } catch (error) {
          // this.client.errorHandler.handleSlashCommandError({
          //   error: error,
          //   logger: this.logger,
          // });
        }
    });

    this.logger.success(`Loaded total: ${this.commandCollection.size} application (/) commands`);
  }
}

export default CommandHandler;
