const path = require("path");
const fs = require("fs");

const {
  SlashCommandBuilder,
  SlashCommandSubcommandGroupBuilder,
  SlashCommandSubcommandBuilder,
  Collection,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
} = require("discord.js");
const { CommandError } = require("../utils/error/clientError");

/**
 * Custom Slash Command Builder class with added functionalities.
 * @extends SlashCommandBuilder
 */
class ClientSlashCommandBuilder extends SlashCommandBuilder {
  /**
   * @param {string} filename - Absolute path to the current file.
   * @param {string} dirname - Absolute path to the directory containing command extensions.
   */
  constructor(filename, dirname) {
    super();
    this.isExecuted = true;
    this.autoResponseListeners = new Collection(); // Initialize autoResponseListener
    this.deferedCommand = true;
    this.ephemeralCommand = false;
    this.executor = null; // Initialize executor
    this.subcommandBuilders = new Collection();

    this.file = path.resolve(filename);
    this.dir = path.join(path.resolve(dirname), path.basename(filename).replace(".js", ""));

    if (fs.existsSync(this.dir)) {
      if (!fs.statSync(this.dir).isDirectory()) throw new Error(`Folder is not a directory: ${this.dir}`);
      this.resolveFolder();
    }
  }

  /**
   * Sets a listener function for automatic responses.
   * @param {string} name - The name of command value name that auto-complete listen.
   * @param {Function} listener - The function to be called for auto-complete.
   * @returns {ClientSlashCommandBuilder} This instance for chaining.
   * @throws {TypeError} Throws an error if the provided listener is not a function.
   */
  setAutoresponseListener(name, listener) {
    if (typeof listener !== "function")
      throw new CommandError({ content: `Listener must be a function.`, code: CommandError.INVALID_VARIABLE_TYPE });

    if (this.options.length == 0)
      throw new CommandError({
        content: `Command is have no option ! Make sure you set the autocomplete listener after set listener.`,
        code: CommandError.EMPTY_COMMAND_OPTION,
      });

    this.options.forEach((option) => {
      const JSONObj = option.toJSON();
      if (
        JSONObj.type === ApplicationCommandOptionType.Subcommand ||
        JSONObj.type === ApplicationCommandOptionType.SubcommandGroup
      )
        return;

      if (JSONObj.name === name) this.autoResponseListeners.set(name, listener);
    });

    if (!this.autoResponseListeners.get(name))
      throw new CommandError({
        code: CommandError.COMMAND_OPTION_NOT_FOUND,
        content: "Option must be added before set autocomplete listener",
      });

    return this;
  }

  /**
   * Sets an executor function.
   * @param {Function} executor - The function to be executed for the command.
   * @returns {ClientSlashCommandBuilder} This instance for chaining.
   * @throws {TypeError} Throws an error if the provided executor is not a function.
   */
  setExecutor(executor) {
    if (typeof executor !== "function") {
      throw new TypeError("Executor must be a function.");
    }
    this.executor = executor;
    return this;
  }

  /**
   * Sets whether the command is executed.
   * @param {boolean} isExecuted
   * @returns {ClientSlashCommandBuilder} This instance for chaining.
   * @throws {TypeError} Throws an error if the provided value is not a boolean.
   */
  setIsExecuted(isExecuted) {
    if (typeof isExecuted !== "boolean") {
      throw new TypeError("IsExecuted must be a boolean value.");
    }
    this.isExecuted = isExecuted;
    return this;
  }

  /**
   * Resolves the folder containing command extensions and loads them.
   * @returns {ClientSlashCommandBuilder} This instance for chaining.
   * @throws {TypeError} Throws an error if any file in the folder is not a valid subcommand builder.
   */
  resolveFolder() {
    const a = fs.readdirSync(this.dir);
    fs.readdirSync(this.dir).forEach((file) => {
      if (file.endsWith(".js")) {
        const builder = require(path.join(this.dir, file));
        if (
          !(builder instanceof ClientSlashCommandSubcommandBuilder) &&
          !(builder instanceof ClientSlashCommandSubcommandGroupBuilder)
        ) {
          throw new TypeError(`Invalid builder in file: ${file}`);
        }

        if (builder instanceof ClientSlashCommandSubcommandBuilder) {
          this.subcommandBuilders.set(builder.name, builder);
          this.addSubcommand(builder);
        } else if (builder instanceof ClientSlashCommandSubcommandGroupBuilder) {
          this.subcommandBuilders.set(builder.name, builder);
          this.addSubcommandGroup(builder);
        } else throw new TypeError("");
      }
    });

    return this;
  }

  /**
   * Retrieves the appropriate executor function based on the parts of the command.
   *
   * @param {Array<string>} parts - An array of strings representing the command and its subcommands.
   * @returns {Function} An async function corresponding to the executor for the command.
   */
  callExecutor(parts) {
    if (parts.length == 2) return this.subcommandBuilders.get(parts[1])?.executor;
    else if (parts.length == 3) {
      const group = this.subcommandBuilders.get(parts[1]);
      const subcommand = group.subcommandBuilders.get(parts[2]);

      return subcommand?.executor;
    } else return this.executor;
  }

  /**
   * Retrieves the appropriate autocomplete function based on the parts of the command.
   *
   * @param {Array<string>} parts An array of strings representing the command and its subcommands.
   * @param {string} optionName Name of the option which command value will be auto completed.
   * @returns {Function} An async function corresponding to the autoresponse for the command.
   */
  callAutoResponseListener(parts, optionName) {
    if (parts.length == 2) {
      return this.subcommandBuilders.get(parts[1])?.autoResponseListeners.get(optionName);
    } else if (parts.length == 3) {
      const group = this.subcommandBuilders.get(parts[1]);
      const subcommand = group.subcommandBuilders.get(parts[2]);
      return subcommand?.autoResponseListeners.get(optionName);
    } else {
      return this.autoResponseListeners.get(optionName);
    }
  }

  /**
   * Retrieves the appropriate executor function based on the interaction.
   *
   * @param {ChatInputCommandInteraction} interaction - The interaction object containing command details.
   * @returns {Function} An async function corresponding to the executor for the command.
   */
  callExecutorFromInteraction(interaction) {
    const parts = ClientSlashCommandBuilder.getCommandNameStackFromInteraction(interaction);

    return this.callExecutor(parts);
  }

  callListenerFromInteraction(interaction) {
    const parts = ClientSlashCommandBuilder.getCommandNameStackFromInteraction(interaction);

    return this.callListener(parts);
  }

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {boolean} combined
   * @returns {Array<string> | string}
   */
  static getCommandNameStackFromInteraction(interaction, combined) {
    const parts = [interaction.commandName];

    const subcommandGroup = interaction.options.getSubcommandGroup();
    if (subcommandGroup) parts.push(subcommandGroup);

    const subcommand = interaction.options.getSubcommand();
    if (subcommand) parts.push(subcommand);
    if (combined) return `${parts[0]} ${parts[1] ? parts[1] : ""} ${parts[2] ? parts[2] : ""}`.trimEnd();
    return parts;
  }

  /**
   *
   * @returns {Array<Array<string>>}
   */
  getCommandNameList() {
    const list = [];

    this.options.forEach((subBuilder) => {
      if (subBuilder instanceof ClientSlashCommandSubcommandBuilder) {
        list.push([this.name, subBuilder.name, ""]);
      } else if (subBuilder instanceof ClientSlashCommandSubcommandGroupBuilder) {
        subBuilder.options.forEach((builder) => {
          list.push([this.name, subBuilder.name, builder.name]);
        });
      }
    });
    if (list.length == 0) list.push([this.name, "", ""]);
    return list;
  }
}

/**
 * Custom Slash Command Builder class with added functionalities.
 * @extends SlashCommandSubcommandBuilder
 */
class ClientSlashCommandSubcommandBuilder extends SlashCommandSubcommandBuilder {
  /**
   * @param {string} filename - Absolute path to the current file.
   */
  constructor(filename) {
    super();
    this.autoResponseListeners = new Collection();
    this.executor = null; // Initialize executor
    this.deferedCommand = true;

    this.file = path.resolve(filename);
  }

  /**
   * Sets a listener function for automatic responses.
   * @param {string} name - The name of command value name that auto-complete listen.
   * @param {Function} listener - The function to be called for auto-complete.
   * @returns {ClientSlashCommandBuilder} This instance for chaining.
   * @throws {TypeError} Throws an error if the provided listener is not a function.
   */
  setAutoresponseListener(name, listener) {
    if (typeof listener !== "function")
      throw new CommandError({ content: `Listener must be a function.`, code: CommandError.INVALID_VARIABLE_TYPE });

    if (this.options.length == 0)
      throw new CommandError({
        content: `Command is have no option ! Make sure you set the autocomplete listener after set listener.`,
        code: CommandError.EMPTY_COMMAND_OPTION,
      });

    this.options.forEach((option) => {
      const JSONObj = option.toJSON();
      if (
        JSONObj.type === ApplicationCommandOptionType.Subcommand ||
        JSONObj.type === ApplicationCommandOptionType.SubcommandGroup
      )
        return;

      if (JSONObj.name === name) this.autoResponseListeners.set(name, listener);
    });

    if (!this.autoResponseListeners.get(name))
      throw new CommandError({
        code: CommandError.COMMAND_OPTION_NOT_FOUND,
        content: "Option must be added before set autocomplete listener",
      });

    return this;
  }
  /**
   * Executes the command.
   * @param {AsyncGeneratorFunction} executor - The function to be executed for the subcommand.
   * @returns {ClientSlashCommandSubcommandBuilder} This instance for chaining.
   * @throws {TypeError} Throws an error if the provided executor is not a function.
   */
  setExecutor(executor) {
    if (typeof executor !== "function") {
      throw new TypeError("Executor must be a function.");
    }
    this.executor = executor;
    return this;
  }
}

class ClientSlashCommandSubcommandGroupBuilder extends SlashCommandSubcommandGroupBuilder {
  /**
   * @param {string} filename - The path to the main command file.
   * @param {string} dirname - The directory containing additional subcommand files.
   */
  constructor(filename, dirname) {
    super();
    this.subcommandBuilders = new Collection();

    this.file = path.resolve(filename);
    this.dir = path.join(
      path.resolve(dirname),
      path.basename(filename, ".js") // Avoid adding the .js extension
    );

    // Validate that the directory exists and is actually a directory
    if (fs.existsSync(this.dir))
      if (!fs.statSync(this.dir).isDirectory()) throw new Error(`Path exists but is not a directory: ${this.dir}`);

    this.resolveFolder();
  }

  /**
   * Resolves the folder containing command extensions and loads them.
   * @returns {ClientSlashCommandSubcommandGroupBuilder} This instance for chaining.
   * @throws {TypeError} Throws an error if any file in the folder does not export a valid subcommand builder.
   */
  resolveFolder() {
    if (!fs.existsSync(this.dir)) return;

    fs.readdirSync(this.dir).forEach((file) => {
      if (file.endsWith(".js")) {
        const filePath = path.join(this.dir, file);
        const builder = require(filePath);

        // Ensure the required file exports a valid subcommand builder
        if (builder instanceof ClientSlashCommandSubcommandBuilder) {
          this.subcommandBuilders.set(builder.name, builder);
          this.addSubcommand(builder);
        } else throw new TypeError(`Invalid builder exported in file: ${file}`);
      }
    });

    return this;
  }
}

module.exports = {
  ClientSlashCommandSubcommandGroupBuilder,
  ClientSlashCommandSubcommandBuilder,
  ClientSlashCommandBuilder,
};
