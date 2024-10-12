const { Client, Message } = require("discord.js");
const logger = require("../../utils/logger");

module.exports = {
  name: "messageCreate",
  /**
   *
   * @param {Message} message
   * @param {Client} client
   */
  async execute(message, client) {
    try {
      const prefix = ">>";

      if (message.author.bot || !message.content.startsWith(prefix)) return;

      const args = message.content.slice(prefix.length).trim().split(/ +/);
      const prefixCommandName = args.shift().toLowerCase();

      //await message.reply({ content: `Prefix command used !` });

    } catch (err) {
      logger.errors.command(`Error on reading prefix comamnd none: ${err}`);
    }
  },
};
