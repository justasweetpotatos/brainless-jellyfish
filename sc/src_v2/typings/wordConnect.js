const mysql = require("mysql");
const { TextChannel } = require("discord.js");

class WordConnectHandler {}

class WordConnect {
  /**
   *
   * @param {TextChannel} channel
   * @param {import("mysql").Connection} conn
   */
  constructor(channel, conn) {
    if (!(channel instanceof TextChannel) || !conn) throw new Error();

    this.channel = channel;
    this.conn = conn;
  }
}
