const { Message } = require("discord.js");
const { SuwaClient } = require("../client/bot");

module.exports = {
  name: "messageCreate",
  /**
   *
   * @param {Message} message
   * @param {SuwaClient} client
   */
  async execute(message, client) {
    await client.messageHandler.onMessageCreate(message);
  },
};
