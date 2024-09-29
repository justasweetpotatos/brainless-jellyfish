const path = require("path");
const fs = require("fs");

const {
  Collection,
  CommandInteraction,
  Routes,
  EmbedBuilder,
  Colors,
  AutocompleteInteraction,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} = require("discord.js");

const { SuwaClient } = require("../client/bot");
const { Logger } = require("../utils/logger");
const { CommandError, ClientError } = require("../utils/errorHandler/clientError");
const { ClientSlashCommandBuilder } = require("../typings/command");

class CommandHandler {
  /**
   * @param {SuwaClient} client
   */
  constructor(client) {
    this.client = client;
    this.logger = new Logger("CommandHandler", client.logSystem);
    this.commands = new Collection();
    this.commandsLocation = new Collection();
    this.commandAutocompleteResponses = new Collection();
    this.jsonArray = [];
    this.commandDir = path.join(__dirname, "../command");
  }

  loadCommands() {
    try {
      this.logger.log("Loading application (/) command");
      fs.readdirSync(this.commandDir).forEach((commandFile) => {
        if (!commandFile.endsWith(".js")) return;
        this.loadCommand(commandFile);
      });

      this.logger.log("Successfully loaded all application (/) commands");
    } catch (error) {
      this.logger.error(new CommandError(error.message, ClientError.codes.UNKNOWN_ERROR).createFullMessage());
    }
  }

  loadSubcommandGroup(commandFile, parentDir, parentBuilder) {
    const _path = path.join(parentDir, commandFile);
    const commandBuilder = require(_path)?.data;
    const commandDir = _path.replace(".js", "");

    if (!commandBuilder || !(commandBuilder instanceof SlashCommandSubcommandGroupBuilder))
      throw new CommandError(
        `Require SlashCommandSubcommandGroupBuilder instead of ${typeof commandBuilder}`,
        CommandError.codes.INVAVID_COMMAND_BUILDER_TYPE
      );

    if (fs.existsSync(commandDir)) {
      fs.readdirSync(commandDir).forEach((file) => {
        if (!file.endsWith(".js")) return;
        const __path = path.join(commandDir, file);
        const { data, execute, autocompleteResponse } = require(__path);

        commandBuilder.addSubcommand(data);
        const commandFullName = `${parentBuilder.name} ${commandBuilder.name} ${data.name}`;
        this.commands.set(commandFullName, execute);
        this.commandAutocompleteResponses.set(commandFullName, autocompleteResponse);
        this.commandsLocation.set(commandFullName, __path);
      });
    }

    parentBuilder.addSubcommandGroup(commandBuilder);
  }

  /**
   *
   * @param {string} commandFile
   * @param {string} parentDir
   * @param {SlashCommandBuilder} parentBuilder
   */
  loadSubcommand(commandFile, parentDir, parentBuilder) {
    const _path = path.join(parentDir, commandFile);
    const { data, execute, autocompleteResponse } = require(_path);

    if (data instanceof SlashCommandSubcommandGroupBuilder) {
      this.loadSubcommandGroup(commandFile, parentDir, parentBuilder);
      return;
    } else if (!(data instanceof SlashCommandSubcommandBuilder))
      throw new CommandError(
        `Require SlashCommandSubcommandBuilder instead of ${typeof data}`,
        CommandError.codes.INVAVID_COMMAND_BUILDER_TYPE
      );

    if (!execute) throw new CommandError(`No executor found: executor is missing. Target: ${_path}`);

    parentBuilder.addSubcommand(data);

    if (parentBuilder instanceof SlashCommandBuilder) {
      const commandFullName = `${parentBuilder.name} ${data.name}`;
      this.commands.set(commandFullName, execute);
      this.commandAutocompleteResponses.set(commandFullName, autocompleteResponse);
      this.commandsLocation.set(commandFullName, _path);
    } else
      throw new CommandError(
        `Require SlashCommandSubcommandBuilder or SlashCommandSubcommandGroupBuilder instead of ${typeof parentBuilder}`,
        CommandError.codes.INVAVID_COMMAND_BUILDER_TYPE
      );
  }

  /**
   *
   * @param {string} commandFile
   */
  loadCommand(commandFile) {
    try {
      const commandPath = path.join(this.commandDir, commandFile);
      const commandDir = commandPath.replace(".js", "");
      const commandModule = require(commandPath);
      const commandBuilder = commandModule.data;
      const commandExecute = commandModule.execute;
      const autocompleteResponse = commandModule.autocompleteResponse;

      if (!(commandBuilder instanceof SlashCommandBuilder))
        throw new CommandError(
          `Required SlashCommandBuilder instead of ${typeof commandBuilder}`,
          CommandError.codes.INVAVID_COMMAND_BUILDER_TYPE
        );

      if (fs.existsSync(commandDir)) {
        fs.readdirSync(commandDir).forEach((subcommandFile) => {
          try {
            if (!subcommandFile.endsWith(".js")) return;
            this.loadSubcommand(subcommandFile, commandDir, commandBuilder);
          } catch (error) {
            if (error instanceof CommandError) this.client.errorHandler.handleCommandError(error, this.logger);
          }
        });
      } else {
        if (!commandExecute) throw new CommandError(`Execute is not found. command: ${commandBuilder.name}`);
        this.commands.set(commandBuilder.name, commandExecute);
        this.commandAutocompleteResponses.set(commandBuilder.name, autocompleteResponse);
        this.commandsLocation.set(commandBuilder.name, commandPath);
      }

      // Push JSON builder data to REST data array
      this.jsonArray.push(commandBuilder.toJSON());
    } catch (error) {
      this.client.errorHandler.handleCommandError(error, this.logger);
    }
  }

  async registerCommands() {
    try {
      this.logger.log("Started refreshing application (/) commands.");

      this.client.databaseHandler.guildDatabases.forEach(async (database) => {
        await this.client.rest
          .put(Routes.applicationGuildCommands(this.client.clientID, database.profile.id), {
            body: this.jsonArray,
          })
          .then(this.logger.success(`Loaded application (/) command for guild with id ${database.profile.id}`))
          .catch((error) => this.logger.error(error));
      });

      this.logger.success("Successfully reloaded application (/) commands.");
    } catch (error) {
      throw new CommandError(error.message, CommandError.codes.REGISTER_COMMAND_FAILED);
    }
  }

  /**
   *
   * @param {AutocompleteInteraction} interaction
   */
  async executeAutocompleteResponse(interaction) {
    try {
      const execute = this.commandAutocompleteResponses.get(
        (await this.getCommandFromInteraction(interaction)).commandName
      );
      if (!execute)
        throw new CommandError(
          "Missing autocomplete response",
          CommandError.codes.EXECUTE_AUTOCOMPLETE_RESPONSE_FAILED
        );
      await execute(interaction, this.client);
    } catch (error) {
      await this.client.errorHandler.handleCommandError(
        new CommandError(error.message, CommandError.codes.UNKNOWN_ERROR),
        this.logger,
        interaction
      );
    }
  }

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  getCommandFromInteraction(interaction) {
    const commandName = interaction.commandName;
    const subcommandName = interaction.options.getSubcommand();
    const subcommandGroupName = interaction.options.getSubcommandGroup();
    if (subcommandGroupName) return `${commandName} ${subcommandGroupName} ${subcommandName}`;
    if (subcommandName) return `${commandName} ${subcommandName}`;
    return commandName;
  }

  /**
   *
   * @param {CommandInteraction} interaction
   */
  async executeCommand(interaction) {
    const commandName = this.getCommandFromInteraction(interaction);

    try {
      await interaction.deferReply({ ephemeral: true });
      const execute = this.commands.get(commandName);

      if (!this.commands.has(commandName))
        throw new CommandError("Executor is not fouund !", undefined, CommandError.codes.EXECUTE_COMMAND_FAILED);
      if (!execute) {
        const embed = new EmbedBuilder()
          .setTitle(`Command is disabled !`)
          .setDescription(
            `*Please checking notification for more info in server [link invite](https://discord.gg/thien-ha-cua-sua)*`
          )
          .setColor(Colors.Blurple);
        await interaction.editReply({ embeds: [embed] });
        return;
      }
      await execute(interaction, this.client);
    } catch (error) {
      await this.client.errorHandler.handleCommandError(
        new CommandError(error.stack, CommandError.codes.EXECUTE_COMMAND_FAILED),
        this.logger,
        interaction,
        commandName
      );
    }
  }

  /**
   *
   * @param {string} commandName
   * @param {CommandInteraction} interaction
   */
  disableCommand(commandName, interaction) {
    try {
      const execute = this.commands.get(commandName);
      if (execute) this.commands.set(commandName, null);
    } catch (error) {
      const e = new CommandError(
        `Error on disabling command: ${error.message}`,
        CommandError.codes.DISABLE_COMMAND_FAILED
      );
      this.client.errorHandler.handleCommandError(e, this.logger, interaction, commandName);
    }
  }

  /**
   *
   * @param {string} commandName
   * @param {CommandInteraction} interaction
   */
  enableCommand(commandName, interaction) {
    try {
      const execute = this.commands.get(commandName);
      const newExecute = require(this.commandsLocation.get(commandName)).execute;
      if (!execute) this.commands.set(commandName, newExecute);
    } catch (error) {
      const e = new CommandError(
        `Error on enabling command: ${error.message}`,
        CommandError.codes.ENABLE_COMMAND_FAILED
      );
      this.client.errorHandler.handleCommandError(e, this.logger, interaction, commandName);
    }
  }

  /**
   *
   * @param {string} commandName
   * @param {CommandInteraction} interaction
   */
  async refreshCommand(commandName, interaction) {
    try {
      this.disableCommand(commandName);
      this.enableCommand(commandName);
    } catch (error) {
      const e = new CommandError(
        `Error on refreshing command: : ${error.message}`,
        CommandError.codes.REFRESH_COMMAND_FAILED
      );
      this.client.errorHandler.handleCommandError(e, this.logger, interaction, commandName);
    }
  }
}

class SlashCommandHandler {
  /**
   *
   * @param {SuwaClient} client
   *
   */
  constructor(client) {
    this.client = client;

    this.commands = new Collection();
    this.commandDir = path.join(__dirname, "../command");
  }

  loadCommands() {
    fs.readdirSync(this.commandDir).forEach((file) => {
      file.endsWith(".js") ? this.loadCommand(file) : "";
    });
  }

  /**
   * @param {string} file
   */
  loadCommand(file) {
    const builder = require(path.join(this.commandDir, file));

    if (builder instanceof ClientSlashCommandBuilder) {
      if (builder.commandExtendFolder) builder.resolveFolder();
    } else {
      throw new TypeError("Builder must be a ClientSlashCommandBuilder");
    }
  }
}
module.exports = { CommandHandler };
