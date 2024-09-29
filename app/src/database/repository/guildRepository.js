const { TextChannel, ThreadChannel, Guild } = require("discord.js");

const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "../../config/guildConfig.json");
const { config } = require("../../config/guildConfig.json");

/**
 * Represents a guild in the application.
 */
class ClientGuild {
  /**
   * Creates an instance of ClientGuild.
   * @param {string} id - The ID of the guild.
   * @param {string} name - The name of the guild.
   */
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.configName = `guild_${id}`;
    this.logChannel = {
      id: "",
      channel_type: 0,
    };
  }

  /**
   * Sets the log channel for the guild.
   * @param {TextChannel | ThreadChannel} channel - The new log channel.
   */
  setLogChannel(channel) {
    this.logChannel.id = channel.id;
    this.logChannel.channel_type = channel.type;
  }

  /**
   * Converts the ClientGuild instance to JSON format.
   * @returns {{id: string, name: string, log_channel: {id: string, channel_type: number | 0}}} - JSON representation of the ClientGuild.
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      log_channel: this.logChannel,
    };
  }
}

/**
 * Repository for managing guild configurations.
 */
class GuildRepository {
  /**
   * Finds the guild configuration by ID.
   * @param {string} id - The ID of the guild.
   * @returns {Promise<{id: string, name: string, log_channel: {id: string, channel_type: number | 0}}>} - The guild configuration.
   * @throws {Error} - If the guild configuration is not found.
   */
  async findConfigById(id) {
    const configName = `guild_${id}`;
    const guildConfig = config[configName];
    if (!guildConfig) throw new Error("Guild config is not found!");
    return guildConfig;
  }

  /**
   * Creates a new guild configuration.
   * @param {Guild} guild - The guild object from Discord.
   * @returns {Promise<void>} - Returns a Promise when writing to file is complete.
   */
  async create(guild) {
    try {
      const clientGuild = new ClientGuild(guild.id, guild.name);
      config[clientGuild.configName] = clientGuild.toJSON();

      fs.writeFile(path.join(__dirname, "../../config/guildConfig.json"), JSON.stringify({ config: config }), (err) => {
        if (err) {
          console.error("Error writing to config file:", err);
          throw err;
        }
      });
    } catch (error) {
      console.error(`Error creating guild:`, error);
      throw error;
    }
  }

  /**
   * Updates the guild configuration by ID.
   * @param {string} id - The ID of the guild.
   * @param {{name: string, log_channel: {id: string, channel_type: number | 0}}} updatedConfig - The updated configuration.
   * @returns {Promise<void>} - Returns a Promise when writing to file is complete.
   * @throws {Error} - If the guild configuration is not found or error during file write.
   */
  async update(id, updatedConfig) {
    try {
      const configName = `guild_${id}`;
      const guildConfig = config[configName];
      if (!guildConfig) throw new Error("Config is not found!");

      const clientGuild = new ClientGuild(guildConfig.id, guildConfig.name);
      if (updatedConfig.name) clientGuild.name = updatedConfig.name;
      if (updatedConfig.log_channel) clientGuild.logChannel = updatedConfig.log_channel;

      config[configName] = clientGuild.toJSON();

      fs.writeFile(file, JSON.stringify({ config: config }, null, 2), (err) => {});
    } catch (error) {
      console.error(`Error updating guild with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Deletes the guild configuration by ID.
   * @param {string} id - The ID of the guild.
   * @returns {Promise<void>} - Returns a Promise when writing to file is complete.
   * @throws {Error} - If the guild configuration is not found or error during file write.
   */
  async delete(id) {
    try {
      const configName = `guild_${id}`;
      if (!config[configName]) throw new Error("Config is not found!");

      delete config[configName];

      fs.writeFile(file, JSON.stringify(config, null, 2), (err) => {
        if (err) {
          console.error("Error writing to config file:", err);
          throw err;
        }
      });
    } catch (error) {
      console.error(`Error deleting guild with ID ${id}:`, error);
      throw error;
    }
  }
}

module.exports = GuildRepository;
