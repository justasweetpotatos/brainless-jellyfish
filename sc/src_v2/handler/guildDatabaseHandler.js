const { Collection, Guild } = require("discord.js");
const { SuwaClient } = require("../client/bot");
const { GuildDatabase } = require("../database/repository");
const { Logger } = require("../utils/logger");
const { Connector } = require("../database/connect");

class DatabaseHandler {
  /**
   *
   * @param {SuwaClient} client
   */
  constructor(client) {
    this.client = client;
    this.logger = new Logger("GuildDatabase", client.logSystem);
    this.connections = new Collection();
    this.guildDatabases = new Collection();
    this.connector = new Connector();
    this.ready = false;
  }

  async loadDatabase() {
    this.logger.log("Startup database");
    this.logger.log("Creating main connection");
    const conn = this.connector.init();
    this.connections.set(conn.threadId, conn);
    this.logger.success(`Created main connection ! Thread: ${this.connector.mainConnection.threadId}`);

    for (const guild of this.client.guilds.cache) {
      const database = new GuildDatabase(guild[1]);
      if (!(await database.check(this.connector))) {
        
      }
    }

    this.client.guilds.cache.forEach((guild) => {
      const database = new GuildDatabase(guild);
      database
        .check(this.connector)
        .then((value) => {
          if (value) database.sync();
          else database.init().catch((error) => this.logger.error(error.stack));
          database.update().catch((error) => this.logger.error(error.stack));
        })
        .finally();
    });
  }

  /**
   *
   * @param {Guild} guild
   */
  async initGuildDatabase(guild) {
    try {
      const guildDatabase = new GuildDatabase(guild);
      const commondData = await guildDatabase.syncInfo(this.client.connector);

      this.guildDatabases.set(guild.id, guildDatabase);
    } catch (error) {
      this.client.errorHandler.handleDatabaseError(error, this.logger);
    }
  }
}

module.exports = DatabaseHandler;
