import * as path from "path";
import * as fs from "fs";
import SuwaClient from "../bot";
import { Logger } from "../utils/Logger";
import { ChatInputCommandInteraction, Collection } from "discord.js";
import { ClientSlashCommandBuilder } from "../models/ClientCommand";
import { ClientError, ErrorCode } from "../utils/error/ClientError";

class CommandHandler {
  private readonly client: SuwaClient;
  private readonly logger: Logger;
  private readonly commandFolder: string;

  public commandCollection: Collection<string, ClientSlashCommandBuilder>;

  constructor(client: SuwaClient) {
    this.client = client;
    this.logger = new Logger("command-handler", client.logSystem);

    this.commandFolder = path.join(__dirname, "../commands");
    this.commandCollection = new Collection<string, ClientSlashCommandBuilder>();
  }

  async executeCommandInteraction(interaction: ChatInputCommandInteraction) {
    try {
      const command = this.commandCollection.get(interaction.commandName);
      if (!command) throw new ClientError("Builder is not found!", ErrorCode.BUILDER_UNDEFINED_OR_INVALID);

      const execute = command.getExecutor(ClientSlashCommandBuilder.getCommandStackName(interaction, false));
      if (!execute) throw new ClientError("", ErrorCode.EXECUTOR_UNDEFINED_OR_INVALID);
      await execute(this.client, interaction);
    } catch (error) {
      await this.client.errorHandler.handleSlashCommandError({
        error: error,
        logger: this.logger,
        interaction: interaction,
      });
    }
  }

  loadCommands() {
    if (!fs.existsSync(this.commandFolder))
      throw new ClientError("Commands folder is invalid !", ErrorCode.LOAD_COMMAND_FAILED);

    this.logger.log("Loading application (/) commands...");

    fs.readdirSync(this.commandFolder).forEach((file) => {
      if (!file.endsWith(".ts") && !file.endsWith(".js")) return;
      else
        try {
          const builder = require(path.join(this.commandFolder, file));
          if (builder instanceof ClientSlashCommandBuilder) {
            builder.loadSubcommandBuilderFolder();
            this.commandCollection.set(builder.name, builder);
            this.logger.success(`Loaded command: ${builder.name}`);
          } else
            throw new ClientError(
              `Required ClientSlashComamndBuilder instead of ${typeof builder}`,
              ErrorCode.BUILDER_UNDEFINED_OR_INVALID
            );
        } catch (error) {
          this.client.errorHandler.handleSlashCommandError({
            error: error,
            logger: this.logger,
          });
        }
    });

    this.logger.success(`Loaded total: ${this.commandCollection.size} application (/) commands`);
  }
}

export default CommandHandler;
