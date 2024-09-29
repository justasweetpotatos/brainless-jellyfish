const { SuwaClient } = require("../client/bot");
const { Logger } = require("../utils/logger");

class MessageHandler {
  /**
   *
   * @param {SuwaClient} client
   */
  constructor(client) {
    this.client = client;
    this.logger = new Logger("MessageHandler", client.logSystem);
  }

  async onMessageCreate(message) {
    
  }
}

module.exports = { MessageHandler };
