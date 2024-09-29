const path = require("path");
const fs = require("fs");

const {
  Collection,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Colors,
  AutocompleteInteraction,
} = require("discord.js");
const { SuwaClient } = require("../client/client");
const { Logger } = require("../utils/logger");
const { CommandError, ClientError } = require("../utils/error/clientError");
const { ClientSlashCommandBuilder } = require("../models/command");
const { CommandRateLimiter } = require("../utils/limiter/rateLimiter");

class CommandHandler {
  /**
   *
   * @param {SuwaClient} client
   */
  constructor(client) {
    this.client = client;
    this.logger = new Logger("command-handler", client.logSystem);
    this.commandFolder = path.join(__dirname, "../modules/commands");
    this.commands = new Collection();
    this.commandNameList = [];
    this.commandJSONArray = [];
    this.limiter = new CommandRateLimiter();
  }

  /**
   *
   * @param {AutocompleteInteraction} interaction
   */
  async executeAutocompleteInteraction(interaction) {
    try {
      const builder = this.getBuilderWithInteraction(interaction);
      const focusedValue = interaction.options.getFocused(true);
      const execute = builder.callAutoResponseListener(
        ClientSlashCommandBuilder.getCommandNameStackFromInteraction(interaction),
        focusedValue.name
      );
      if (!interaction.responded) await execute(interaction, this.client);
    } catch (err) {
      await this.client.errorHandler.handleSlashCommandError({
        error: new CommandError({
          code: CommandError.EXECUTE_AUTOCOMPLETE_FAILED,
          stack: err.stack,
          content: err.message,
        }),
        logger: this.logger,
      });
    }
  }

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async executeCommandInteraction(interaction) {
    try {
      // get SlashCommandBuilder
      const builder = this.getBuilderWithInteraction(interaction);
      // if (builder.deferedCommand)
      //   await interaction.deferReply({ fetchReply: true, ephemeral: builder.ephemeralCommand });

      // Limiting use command rate
      if (this.limiter.canProceed(interaction)) {
        const execute = builder.callExecutor(ClientSlashCommandBuilder.getCommandNameStackFromInteraction(interaction));
        await execute(interaction, this.client);
      } else {
        const embed = new EmbedBuilder({
          title: `You are using command too fast !`,
          description: `Please try again after <t:${Math.floor(interaction.createdTimestamp / 1000) + 5}:R>`,
          color: Colors.Yellow,
          timestamp: interaction.createdTimestamp,
        });

        if (builder.deferedCommand) await interaction.editReply({ embeds: [embed] });
      }
    } catch (err) {
      await this.client.errorHandler.handleSlashCommandError({
        error: new CommandError({
          code: CommandError.EXECUTE_COMMAND_FAILED,
          stack: err.stack,
          content: err.message,
        }),
        interaction: interaction,
        logger: this.logger,
      });
    }
  }

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @returns {ClientSlashCommandBuilder}
   */
  getBuilderWithInteraction(interaction) {
    const builder = this.commands.get(interaction.commandName);

    if (!builder)
      throw new CommandError({
        content: `Builder is not found for command named ${commandName}`,
        code: CommandError.BUILDER_NOT_FOUND,
      });
    return builder;
  }

  /**
   *
   * @param {string} combinedCommandName - A string of command name. include subcommand name and subcommand group name
   * @returns {ClientSlashCommandBuilder}
   */
  getBuilderWithCombinedCommandName(combinedCommandName) {
    const parts = combinedCommandName.split(" ");
    const builder = this.commands.get(parts[0]);

    if (!builder)
      throw new CommandError({
        content: `Builder is not found for command named ${commandName}`,
        code: CommandError.BUILDER_NOT_FOUND,
      });
    return builder;
  }

  loadFolder() {
    // If folder is not exist, create new folder.
    if (!fs.existsSync(this.commandFolder)) throw new CommandError({ code: CommandError.MODULES_FOLDER_NOT_FOUND });

    this.logger.log(`Loading command modules...`);

    fs.readdirSync(this.commandFolder).forEach((file) => {
      try {
        if (!file.endsWith(".js")) return;

        const builder = require(path.join(this.commandFolder, file));
        if (builder instanceof ClientSlashCommandBuilder) {
          this.commands.set(builder.name, builder);
          this.commandNameList.push(builder.getCommandNameList());
        } else
          throw new CommandError({
            content: "Builder must be ClientSlashCommandBuilder.",
            code: ClientError.INVALID_VARIABLE_TYPE,
          });

        this.logger.success(`Loaded application (/) command named "${builder.name}"`);
        builder.getCommandNameList().forEach((parts) => this.logger.info(`Option "${parts.join(" ").trimEnd()}"`));
      } catch (err) {
        this.client.errorHandler.handleSlashCommandError({
          error: new CommandError({
            code: CommandError.LOAD_COMMAND_FAILED,
            content: err.message,
            stack: err.stack,
          }),
          logger: this.logger,
        });
      }
    });

    this.logger.success(`Loaded all application (/) command, total: ${this.commands.size}`);
  }
}

module.exports = CommandHandler;
