const { Guild } = require("discord.js");
const { SuwaClient } = require("../client/bot");
// const { NoichuChannelConfig, GuildConfig, NoituChannelConfig } = require(`../typings/index`);
// const logger = require("../utils/logger");
// const { connector } = require("./connection");
const { Connector } = require("./connect");
const { replaceInvalidChars } = require("../utils/funtions");

// class NoichuChannelConfigRepository {
//   /**
//    *
//    * @param {NoichuChannelConfig} config
//    * @returns {Promise<Boolean>}
//    */
//   async sync(config) {
//     try {
//       const query = `
//         SELECT * FROM ${config.guildDBName}.noichu_channels
//         WHERE id = ?
//       `;
//       const values = [config.id];
//       const results = await connector.executeQuery(query, values);

//       if (results.length === 0) return false;
//       else {
//         const result = results[0];
//         config.lastWord = result.last_word;
//         config.lastUserId = result.last_user_id;
//         config.wordUsedList = result.word_used_list;
//         config.repeated = result.repeated;
//         config.limit = result.limit;
//         config.wrongWordMessages = JSON.parse(result.wrong_word_messages);
//         config.wrongStartCharMessages = JSON.parse(result.wrong_startchar_messages);
//         config.isBeforeUserMessages = JSON.parse(result.is_before_user_messages);
//         config.isRepeatedWordMessages = JSON.parse(result.is_repeated_word_messages);
//         return true;
//       }
//     } catch (err) {
//       logger.errors.database(`SYNC_NOICHU_CHANNEL_CONFIG_ERROR: channel>>${config.id} guild>>${config.id}: ${err}`);
//       return false;
//     }
//   }

//   /**
//    *
//    * @param {NoichuChannelConfig} config
//    * @returns {Promise<Boolean>} Nếu trả về true, cập nhật thành công và ngược lại
//    */
//   async update(config) {
//     try {
//       const query = `
//         INSERT INTO ${config.guildDBName}.noichu_channels
//         (id, last_user_id, last_word, word_used_list, \`limit\`, repeated, wrong_word_messages, wrong_startchar_messages, is_before_user_messages, is_repeated_word_messages)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//         ON DUPLICATE KEY UPDATE
//         last_word = VALUES(last_word),
//         last_user_id = VALUES(last_user_id),
//         word_used_list = VALUES(word_used_list),
//         repeated = VALUES(repeated),
//         \`limit\` = VALUES(\`limit\`),
//         wrong_word_messages = VALUES(wrong_word_messages),
//         wrong_startchar_messages = VALUES(wrong_startchar_messages),
//         is_before_user_messages = VALUES(is_before_user_messages),
//         is_repeated_word_messages = VALUES(is_repeated_word_messages)
//       `;
//       const values = [
//         config.id,

//         config.lastUserId,
//         config.lastWord,
//         config.wordUsedList,

//         config.limit,
//         config.repeated,

//         JSON.stringify(config.wrongWordMessages),
//         JSON.stringify(config.wrongStartCharMessages),
//         JSON.stringify(config.isBeforeUserMessages),
//         JSON.stringify(config.isRepeatedWordMessages),
//       ];
//       await connector.executeQuery(query, values);
//       return true;
//     } catch (err) {
//       logger.errors.database(`UPDATE_NOICHU_CHANNEL_CONFIG_ERROR: channel>>${config.id} guild>>${config.id}: ${err}`);
//       return false;
//     }
//   }

//   /**
//    *
//    * @param {NoichuChannelConfig} config
//    * @returns {Promise<boolean>}
//    */
//   async delete(config) {
//     try {
//       const query = `
//         DELETE FROM ${config.guildDBName}.noichu_channels
//         WHERE id = ?
//       `;
//       const values = [config.id];
//       await connector.executeQuery(query, values);
//       return true;
//     } catch (err) {
//       logger.errors.database(`DROP_NOICHU_CHANNEL_CONFIG_ERROR: channel>>${config.id} guild>>${config.id}: ${err}`);
//       return false;
//     }
//   }
// }

// class NoituChannelConfigRepository {
//   /**
//    *
//    * @param {NoituChannelConfig} config
//    * @returns {Promise<Boolean>}
//    */
//   async sync(config) {
//     try {
//       const query = `
//         SELECT * FROM ${config.guildDBName}.noitu_channels
//         WHERE id = ?
//       `;
//       const values = [config.id];
//       const results = await connector.executeQuery(query, values);

//       if (results.length === 0) return false;
//       else {
//         const result = results[0];
//         config.lastWord = result.last_word;
//         config.lastUserId = result.last_user_id;
//         config.wordUsedList = JSON.parse(result.word_used_list);
//         config.repeated = result.repeated;
//         config.limit = result.limit;
//         config.wrongWordMessages = JSON.parse(result.wrong_word_messages);
//         config.wrongStartCharMessages = JSON.parse(result.wrong_startchar_messages);
//         config.isBeforeUserMessages = JSON.parse(result.is_before_user_messages);
//         config.isRepeatedWordMessages = JSON.parse(result.is_repeated_word_messages);
//         return true;
//       }
//     } catch (err) {
//       logger.errors.database(`SYNC_NOITU_CHANNEL_CONFIG_ERROR: guild>>${config.guildId} channel>>${config.id}: ${err}`);
//       return false;
//     }
//   }

//   /**
//    *
//    * @param {NoituChannelConfig} config
//    * @returns {Promise<Boolean>} Nếu trả về true, cập nhật thành công và ngược lại
//    */
//   async update(config) {
//     try {
//       const query = `
//         INSERT INTO ${config.guildDBName}.noitu_channels
//         (id, last_user_id, last_word, word_used_list, \`limit\`, repeated, wrong_word_messages, wrong_startchar_messages, is_before_user_messages, is_repeated_word_messages)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//         ON DUPLICATE KEY UPDATE
//         last_word = VALUES(last_word),
//         last_user_id = VALUES(last_user_id),
//         word_used_list = VALUES(word_used_list),
//         repeated = VALUES(repeated),
//         \`limit\` = VALUES(\`limit\`),
//         wrong_word_messages = VALUES(wrong_word_messages),
//         wrong_startchar_messages = VALUES(wrong_startchar_messages),
//         is_before_user_messages = VALUES(is_before_user_messages),
//         is_repeated_word_messages = VALUES(is_repeated_word_messages)
//       `;
//       const values = [
//         config.id,

//         config.lastUserId,
//         config.lastWord,
//         JSON.stringify(config.wordUsedList),

//         config.limit,
//         config.repeated,

//         JSON.stringify(config.wrongWordMessages),
//         JSON.stringify(config.wrongStartCharMessages),
//         JSON.stringify(config.isBeforeUserMessages),
//         JSON.stringify(config.isRepeatedWordMessages),
//       ];
//       await connector.executeQuery(query, values);
//       return true;
//     } catch (err) {
//       logger.errors.database(`UPDATE_NOICHU_CHANNEL_CONFIG_ERROR: channel>>${config.id} guild>>${config.id}: ${err}`);
//       return false;
//     }
//   }

//   /**
//    *
//    * @param {NoituChannelConfig} config
//    * @returns {Promise<boolean>}
//    */
//   async delete(config) {
//     try {
//       const query = `
//         DELETE FROM ${config.guildDBName}.noitu_channels
//         WHERE id = ?
//       `;
//       const values = [config.id];
//       await connector.executeQuery(query, values);
//       return true;
//     } catch (err) {
//       logger.errors.database(`DELETE_NOICHU_CHANNEL_CONFIG_ERROR: channel>>${config.id} guild>>${config.id}: ${err}`);
//       return false;
//     }
//   }
// }

// class GuildConfigRepository {
//   constructor() {}

//   /**
//    * @param {GuildConfig} guildConfig
//    */
//   async sync(guildConfig) {
//     try {
//       const query = `
//         SELECT * FROM ${guildConfig.guildDBName}.guild_info
//       `;
//       const result = (await connector.executeQuery(query))[0];

//       if (!result) return false;

//       guildConfig.name = result.name;
//       guildConfig.limOfNoichuChannel = result.lim_of_noichu_channel;
//       guildConfig.limOfNoituChannel = result.lim_of_noitu_channel;

//       return true;
//     } catch (err) {
//       logger.errors.database(`SYNC_GUILD_CONFIG_ERROR: guild_id>>${guildConfig.id}: ${err}`);
//       return false;
//     }
//   }

//   /**
//    *
//    * @param {GuildConfig} guildConfig
//    * @returns {Promise<Boolean>}
//    */
//   async update(guildConfig) {
//     try {
//       guildConfig.name ? (guildConfig.name = guildConfig.name) : "";
//       limOfNoichuChannel ? (guildConfig.limOfNoichuChannel = limOfNoichuChannel) : "";

//       const query = `
//         INSERT INTO ${guildConfig.guildDBName}.guild_info (id, \`name\`, lim_of_noichu_channel, lim_of_noitu_channel)
//         VALUES (?, ?, ?)
//         ON DUPLICATE KEY UPDATE
//         \`name\` = VALUES(\`name\`),
//         lim_of_noichu_channel = VALUES(lim_of_noichu_channel),
//         lim_of_noitu_channel = VALUES(lim_of_noitu_channel);
//       `;
//       const values = [guildConfig.id, guildConfig.name, guildConfig.limOfNoichuChannel];
//       console.log(query);
//       console.log(values);
//       await connector.executeQuery(query, values);
//       return true;
//     } catch (error) {
//       logger.errors.database(`UPDATE_GUILD_CONFIG_ERROR: guild_id>>${guildConfig.id}: ${error}`);
//     }
//   }

//   /**
//    * @param {GuildConfig} guildConfig
//    */
//   async createDB(guildConfig) {
//     try {
//       // Create DB
//       const createDBQuery = `CREATE SCHEMA IF NOT EXISTS ${guildConfig.guildDBName}`;
//       await connector.executeQuery(createDBQuery, []);

//       // Create tables
//       const tableCreateQuerys = [
//         {
//           name: `guild_info`,
//           createQuery: `CREATE TABLE IF NOT EXISTS ${guildConfig.guildDBName}.guild_info LIKE guild_template.guild_info;`,
//           alterTableQuery: `ALTER TABLE ${guildConfig.guildDBName}.guild_info ADD PRIMARY KEY (id);`,
//         },
//         {
//           name: `noichu_channels`,
//           createQuery: `CREATE TABLE IF NOT EXISTS ${guildConfig.guildDBName}.noichu_channels LIKE guild_template.noichu_channels;`,
//           alterTableQuery: ``,
//         },
//         {
//           name: `noitu_channels`,
//           createQuery: `CREATE TABLE IF NOT EXISTS ${guildConfig.guildDBName}.noitu_channels LIKE guild_template.noitu_channels;`,
//           alterTableQuery: ``,
//         },
//         {
//           name: `reaction_buttons`,
//           createQuery: `CREATE TABLE IF NOT EXISTS ${guildConfig.guildDBName}.reaction_buttons LIKE guild_template.reaction_buttons;`,
//           alterTableQuery: ``,
//         },
//         {
//           name: `reaction_emojis`,
//           createQuery: `CREATE TABLE IF NOT EXISTS ${guildConfig.guildDBName}.reaction_emojis LIKE guild_template.reaction_emojis;`,
//           alterTableQuery: ``,
//         },
//         {
//           name: `confession_channels`,
//           createQuery: `CREATE TABLE IF NOT EXISTS ${guildConfig.guildDBName}.confession_channels LIKE guild_template.confession_channels;`,
//           alterTableQuery: ``,
//         },
//         {
//           name: `confession_posts`,
//           createQuery: `CREATE TABLE IF NOT EXISTS ${guildConfig.guildDBName}.confession_posts LIKE guild_template.confession_posts;`,
//           alterTableQuery: ``,
//         },
//       ];

//       for (const table of tableCreateQuerys) {
//         try {
//           await connector.executeQuery(table.createQuery);
//         } catch (error) {
//           logger.errors.database(`CREATE_TABLE_ERROR: guild_id>>${guildConfig.id} table>>${table.name}: ${error}`);
//         }
//       }
//     } catch (error) {
//       logger.errors.database(`CREATE_GUILD_DB_ERROR: guild_id>>${guildConfig.id}: ${error}`);
//     }
//   }

//   /**
//    * Tìm kiếm trên database xem đã có db của guild hay chưa, nếu chưa tạo mới db
//    * @param {String} guildId
//    * @returns {any}
//    */
//   async checkingGuildDB(guildId) {
//     try {
//       const query = `
//         SELECT * FROM guild_${guildId}.guild_info
//       `;
//       await connector.executeQuery(query);
//     } catch (error) {
//       if (error && error.code === "ER_BAD_DB_ERROR") {
//         await this.createGuildDB(guildId);
//         logger.log.database(
//           `Created DB for guild with id ${guildId} and with name guild_${guildId}, reason: No DB with name: guild_${guildId}`
//         );
//         return true;
//       } else {
//         console.log(error);
//         logger.errors.database(`CHECKING_GUILD_DB_ERROR: guild_id>>${guildId}: ${error}`);
//       }
//     }
//   }

//   /**
//    *
//    * @param {GuildConfig} config
//    * @returns {Promise<Number>}
//    */
//   async getNumberOfNoichuChannelInGuild(config) {
//     try {
//       const query = `SELECT COUNT(*) AS \`count\` FROM ${config.guildDBName}.noichu_channels;`;
//       return await connector.executeQuery(query)[0]?.count;
//     } catch (error) {
//       logger.errors.database(`Error on getting number of noichu channel in guild with id ${config.id}: ${error}`);
//     }
//   }
// }

class GuildDatabase {
  profile = {
    id: "",
    name: "",
    description: "",

    logging: {
      botLoggingChannelId: "",
      voiceLoggingChannelId: "",
      messageLoggingChannelId: "",
      joinleaveLoggingChannelId: "",
      memberEventLoggingChannelId: "",
      memberWarnLoggingChannelId: "",
      levelUpLoggingChannelId: "",
      serverEventLoggingChannelId: "",

      confessionReportLoggingChannelId: "",
      ticketLoggingChannelId: "",
      reportMemberLoggingChannelId: "",

      botErrorLoggingChannelId: "",
    },

    config: {},
  };

  /**
   * @param {string} tagName
   * @returns {string}
   */
  getChannelIdByTagName(tagName) {
    const defaultName = {
      [GuildDatabase.channelTag.BOT_LOGGING_CHANNEL_ID]: this.profile.logging.botLoggingChannelId,
      [GuildDatabase.channelTag.VOICE_LOGGING_CHANNEL_ID]: this.profile.logging.voiceLoggingChannelId,
      [GuildDatabase.channelTag.MESSAGE_LOGGING_CHANNEL_ID]: this.profile.logging.messageLoggingChannelId,
      [GuildDatabase.channelTag.JOINLEAVE_LOGGING_CHANNEL_ID]: this.profile.logging.joinleaveLoggingChannelId,
      [GuildDatabase.channelTag.MEMBER_EVENT_LOGGING_CHANNEL_ID]: this.profile.logging.memberEventLoggingChannelId,
      [GuildDatabase.channelTag.MEMBER_WARN_LOGGING_CHANNEL_ID]: this.profile.logging.memberWarnLoggingChannelId,
      [GuildDatabase.channelTag.LEVEL_UP_LOGGING_CHANNEL_ID]: this.profile.logging.levelUpLoggingChannelId,
      [GuildDatabase.channelTag.SERVER_EVENT_LOGGING_CHANNEL_ID]: this.profile.logging.serverEventLoggingChannelId,
      [GuildDatabase.channelTag.CONFESSION_REPORT_LOGGING_CHANNEL_ID]:
        this.profile.logging.confessionReportLoggingChannelId,
      [GuildDatabase.channelTag.TICKET_LOGGING_CHANNEL_ID]: this.profile.logging.ticketLoggingChannelId,
      [GuildDatabase.channelTag.REPORT_MEMBER_LOGGING_CHANNEL_ID]: this.profile.logging.reportMemberLoggingChannelId,
      [GuildDatabase.channelTag.BOT_ERROR_LOGGING_CHANNEL_ID]: this.profile.logging.botErrorLoggingChannelId,
    };

    if (defaultName.hasOwnProperty(tagName)) return defaultName[tagName];
  }

  static channelTag = Object.freeze({
    BOT_LOGGING_CHANNEL_ID: "BOT_LOG",
    VOICE_LOGGING_CHANNEL_ID: "VOICE_LOG",
    MESSAGE_LOGGING_CHANNEL_ID: "MESSAGE_LOG",
    JOINLEAVE_LOGGING_CHANNEL_ID: "JOINLEAVE_LOG",
    MEMBER_EVENT_LOGGING_CHANNEL_ID: "MEMBER_EVENT_LOG",
    MEMBER_WARN_LOGGING_CHANNEL_ID: "MEMBER_WARN_LOG",
    LEVEL_UP_LOGGING_CHANNEL_ID: "USER_LEVEL_LOG",
    SERVER_EVENT_LOGGING_CHANNEL_ID: "SERVER_EVENT_LOG",

    CONFESSION_REPORT_LOGGING_CHANNEL_ID: "CONFESSION_REPORT_LOG",
    TICKET_LOGGING_CHANNEL_ID: "TICKET_LOG",
    REPORT_MEMBER_LOGGING_CHANNEL_ID: "REPORT_MEMBER_LOG",

    BOT_ERROR_LOGGING_CHANNEL_ID: "BOT_ERROR_LOG",
  });

  /**
   *
   * @param {Guild} guild
   */
  constructor(guild) {
    this.profile.id = guild.id;
    this.profile.name = guild.name;
    this.profile.description = guild.description;

    this.dbName = this.profile.id;

    if (!this.profile.id) throw new Error();
  }

  /**
   *
   * @param {string} connector
   */
  async check(connector) {
    try {
      const infoQuery = `SELECT * FROM \`${this.dbName}\`.info`;
      const infoResult = (await connector.runQuery(infoQuery))[0];
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   *
   * @param {Connector} connector
   */
  async init(connector) {
    const initQuerys = [
      `CREATE SCHEMA IF NOT EXISTS \`${this.profile.id}\`;`,
      `CREATE TABLE IF NOT EXISTS \`${this.profile.id}\`.\`channel\` LIKE template_guild.\`channel\`;`,
      `CREATE TABLE IF NOT EXISTS \`${this.profile.id}\`.\`info\` LIKE template_guild.info;`,
    ];

    initQuerys.forEach(async (query) => await connector.runQuery(query));

    await this.updateInfo(connector);
    await this.updateConfig(connector);

    return this;
  }

  /**
   *
   * @param {Connector} connector
   */
  async sync(connector) {
    const infoQuery = `SELECT * FROM \`${this.dbName}\`.info`;
    const configQuery = `SELECT config FROM \`${this.dbName}\`.info`;
    const infoResult = (await connector.runQuery(infoQuery))[0];
    const configResult = (await connector.runQuery(configQuery))[0].config;

    this.profile.name = infoResult.name;
    this.profile.description = infoResult.description;
    this.profile.config = JSON.parse(configResult);

    return this;
  }

  /**
   *
   * @param {Connector} connector
   */
  async update(connector) {
    const infoQuery = `
      INSERT INTO \`${this.dbName}\`.info (\`id\`, \`name\`)
      VALUES(?,?)
      ON DUPLICATE KEY UPDATE
      \`name\` = VALUES(\`name\`);
    `;
    const configQuery = `
      INSERT INTO \`${this.dbName}\`.info (\`id\`, config)
      VALUES(?,?)
      ON DUPLICATE KEY UPDATE
      config = VALUES(config);
    `;
    const infoValues = [this.profile.id, replaceInvalidChars(this.profile.name)];
    const configValues = [this.profile.id, JSON.stringify(this.profile.config)];

    await connector.runQuery(infoQuery, infoValues);
    await connector.runQuery(configQuery, configValues);

    return this;
  }
}

module.exports = { GuildDatabase };
