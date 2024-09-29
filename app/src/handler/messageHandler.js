const { SuwaClient } = require("../client/client");

class GuildMessageTrafficTracker {}

module.exports = class MessageHandler {
  /**
   *
   * @param {SuwaClient} client
   */
  constructor(client) {
    this.client = client;
  }
};
