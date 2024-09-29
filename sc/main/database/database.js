const { Logger } = require("../utils/logger");
const { SuwaClient } = require("../client/client");
const { Sequelize } = require("sequelize");

const { config } = require("../config/database.json");

class Connector {
  /**
   *
   * @param {SuwaClient} client
   */
  constructor(client) {
    this.logger = new Logger("connector", client.logSystem);
    this.sequelize = new Sequelize(config);
  }
}

module.exports = { Connector };
