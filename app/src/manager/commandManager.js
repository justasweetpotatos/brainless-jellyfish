const fs = require("fs");
const { Collection, Guild, Routes, Options, ApplicationCommandOptionType } = require("discord.js");
const { SuwaClient } = require("../client/client");
const { Logger } = require("../utils/logger");
const { ClientSlashCommandBuilder, ClientSlashCommandSubcommandGroupBuilder } = require("../models/command");
const { CommandError } = require("../utils/error/clientError");
const path = require("path");

class GuildSlashCommandManager {
  /**
   *
   * @param {Guild} guild Guild which is bot joined for
   * @param {Collection<string, ClientSlashCommandBuilder>} defaultCommands
   */
  constructor(guild, defaultCommands) {
    this.guild = guild;
    this.defaultCommands = defaultCommands;
    this.commands = defaultCommands;
    this.commandJSONArray = [];
    this.config = {
      id: this.guild.id,
      name: this.name,
      log_channel: {
        id: "",
        channle_type: 0,
      },
      disabled_command_list: [],
    };
    this.route = undefined;
  }

  /**
   *
   * @param {Array<string>} commandParts Parts of the command name
   */
  unloadCommand(commandParts) {
    const commandBuilder = this.commands.get(commandParts[0]);

    if (!commandBuilder)
      throw new CommandError({ code: CommandError.DISABLE_COMMAND_FAILED, content: "Command is already disabled." });

    let status = true;

    if (commandBuilder instanceof ClientSlashCommandBuilder)
      switch (commandParts.length) {
        case 1:
          this.commands = this.commands.filter((builder) => builder.name !== commandParts[0]);
          break;
        case 2:
          if (!commandBuilder.subcommandBuilders.has(commandParts[1])) {
            status = false;
            break;
          } else {
            commandBuilder.subcommandBuilders = commandBuilder.subcommandBuilders.filter(
              (builder) => builder.name !== commandParts[1]
            );

            commandBuilder.options.splice(
              commandBuilder.options.findIndex((option) => option.toJSON().name === commandParts[1])
            );
            this.commands.set(commandBuilder.name, commandBuilder);
          }
          break;
        case 3:
          if (!commandBuilder.subcommandBuilders.has(commandParts[1])) {
            status = false;
            break;
          }
          const groupCommandBuilder = commandBuilder.subcommandBuilders.get(commandParts[1]);
          if (!groupCommandBuilder.subcommandBuilders.has(commandParts[2])) {
            status = false;
            break;
          }
          groupCommandBuilder.subcommandBuilders = groupCommandBuilder.subcommandBuilders.filter(
            (builder) => builder.name !== commandParts[2]
          );

          groupCommandBuilder.options.splice(
            groupCommandBuilder.options.findIndex(
              (option) =>
                option.toJSON().type === ApplicationCommandOptionType.Subcommand &&
                option.toJSON().name === commandParts[2]
            )
          );
          commandBuilder.subcommandBuilders.set(groupCommandBuilder.name, groupCommandBuilder);
          this.commands.set(commandBuilder.name, commandBuilder);
          break;
        default:
          throw new CommandError({ code: CommandError.DISABLE_COMMAND_FAILED, content: "Part is invalid." });
      }
    if (!status)
      throw new CommandError({ code: CommandError.DISABLE_COMMAND_FAILED, content: "Command is already disabled." });
  }

  /**
   *
   * @param {Array<string>} commandParts
   */
  loadCommand(commandParts) {
    const commandBuilder = this.commands.get(commandParts[0]);
    if (!commandBuilder) {
      const defaultCommandBuilder = this.defaultCommands.get(commandParts[0]);
      this.commands.set(defaultCommandBuilder.name, defaultCommandBuilder);
      return;
    }

    switch (commandParts.length) {
      case 2:
        const subcommandBuilder = this.defaultCommands.get(commandParts[1]);
        commandBuilder.subcommandBuilders.set(subcommandBuilder.name, subcommandBuilder);
        break;
      case 3:
        const defaultSubcommandgroupBuilder = this.defaultCommands.get(commandParts[1]);
        const subBuilder = defaultSubcommandgroupBuilder.get(commandParts[2]);
        const subcommandGroupBuilder = commandBuilder.subcommandBuilders.get(commandParts[1]);
        subcommandGroupBuilder.subcommandBuilders.set(subBuilder.name, subBuilder);
        commandBuilder.subcommandBuilders.set(subcommandGroupBuilder.name, subcommandGroupBuilder);
        break;
      default:
        throw new CommandError({ code: CommandError.ENABLE_COMMAND_FAILED, content: "Part is invalid." });
    }

    this.commands.set(commandBuilder.name, commandBuilder);
  }

  /**
   *
   * @returns {Array<string>}
   */
  recompileJSONArray() {
    this.commandJSONArray = [];
    this.commands.forEach((commandBuilder) => this.commandJSONArray.push(commandBuilder.toJSON()));
    return this.commandJSONArray;
  }

  /**
   *
   * @param {Map<string, {
   *          id: string,
   *          name: string,
   *          log_channel: {id: string, channle_type: number},
   *          disabled_command_list: Array<Array<string>
   * }} guildConfigMap
   */
  syncConfig(guildConfigMap) {
    const commandNamelist = [];
    this.commands.forEach((commandBuilder) => commandNamelist.push([...commandBuilder.getCommandNameList()]));

    if (!guildConfigMap.has(this.guild.id)) guildConfigMap.set(this.guild.id, this.config);
    else this.config = guildConfigMap.get(this.guild.id);
  }

  /**
   *
   * @param {Map<string, {
   *          id: string,
   *          name: string,
   *          log_channel: {id: string, channle_type: number},
   *          disabled_command_list: Array<Array<string>
   * }} guildConfigMap
   */
  updateConfig(guildConfigMap) {
    guildConfigMap.set(this.config.id, this.config);
  }

  /**
   *
   * @param {SuwaClient} client
   */
  async registerCommands(client) {
    if (!this.route) this.route = Routes.applicationGuildCommands(client.clientID, this.guild.id);
    this.config.disabled_command_list.forEach((parts) => this.unloadCommand(parts));
    this.recompileJSONArray();
    await client.rest.put(this.route, { body: this.commandJSONArray });
  }

  /**
   *
   * @param {SuwaClient} client
   * @param {Array<string} commandParts
   * @returns {boolean}
   */
  async disableCommand(client, commandParts) {
    console.log(this.config);
    if (!this.config.disabled_command_list.findIndex((value) => value === commandParts) >= 0) {
      this.config.disabled_command_list.push(commandParts);
    } else return false;
    this.unloadCommand(commandParts);
    client.slashCommandManager.saveConfig();
    await this.registerCommands(client);
    return true;
  }

  /**
   *
   * @param {SuwaClient} client
   * @param {Array<string} commandParts
   */
  async enableCommand(client, commandParts) {
    if (this.config.disabled_command_list.findIndex((value) => value === commandParts) >= 0)
      this.config.disabled_command_list.splice((parts) => parts === commandParts);
    else return false;
    this.loadCommand(commandParts);
    client.slashCommandManager.saveConfig();
    await this.registerCommands(client);
    return true;
  }

  /**
   *
   * @param {boolean} [combined] If combined return an array with string of command name instead of part command name Array
   * @returns {Array<string | Array<string>}
   */
  getCommandNameList(combined = false) {
    const list = [];
    this.commands.forEach((builder) =>
      builder.getCommandNameList().forEach((parts) => {
        combined ? list.push(parts.join(" ")) : list.push(parts);
      })
    );
    return list;
  }
}

class SlashCommandManager {
  /**
   *
   * @param {SuwaClient} client
   */
  constructor(client) {
    this.client = client;
    this.logger = new Logger("command-manager", client.logSystem);
    this.guildSlashCommandManagerCollection = new Collection();

    this.lockedCommandNameList = [["command"]];

    const guildConfig = require("../config/guildConfig.json");
    this.guildConfigMap = new Collection();
    guildConfig.forEach((item) => this.guildConfigMap.set(item.id, item));
  }

  async registerApplicationCommandsForAllGuilds() {
    this.logger.log(`Start register application (/) commands for all guilds`);
    const joinedGuilds = await this.client.guilds.fetch({ limit: 100 });
    joinedGuilds.forEach(async (guild) => await this.registerApplicationCommandsForGuild(guild));
  }

  /**
   *
   * @param {Array<string>} commandParts
   */
  isLockedCommand(commandParts) {
    return this.lockedCommandNameList.findIndex((parts) => parts[0] === commandParts[0]) >= 0;
  }

  /**
   *
   * @param {Guild} guild
   */
  async registerApplicationCommandsForGuild(guild) {
    try {
      this.logger.log(`Regsiter task running for guild with id: ${guild.id}.`);
      const guildSlashCommandManager = new GuildSlashCommandManager(guild, this.client.commandHandler.commands);
      guildSlashCommandManager.syncConfig(this.guildConfigMap);
      await guildSlashCommandManager.registerCommands(this.client);
      this.guildSlashCommandManagerCollection.set(guild.id, guildSlashCommandManager);
      this.logger.success(`Regsiter all application (/) commands for guild with id "${guild.id}" completed.`);

      this.saveConfig();
    } catch (err) {
      this.client.errorHandler.handleSlashCommandError({
        error: new CommandError({
          code: CommandError.REGISTER_COMMAND_FAILED,
          content: err.message,
          stack: err.stack,
        }),
        logger: this.logger,
      });
    }
  }

  saveConfig() {
    const jsonData = JSON.stringify(this.guildConfigMap.map((value, key) => value));
    fs.writeFileSync(path.join(__dirname, "../config/guildConfig.json"), jsonData);
  }
}

module.exports = { GuildSlashCommandManager, SlashCommandManager };
