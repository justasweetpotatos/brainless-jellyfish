const { VoiceConnection } = require("@discordjs/voice");
const { TextChannel, VoiceChannel } = require("discord.js");

class QueueContruct {
  /**
   *
   * @param {TextChannel} textChannel
   * @param {VoiceChannel} voiceChannel
   * @param {VoiceConnection} [connection]
   */
  constructor(textChannel, voiceChannel, connection) {
    if (!textChannel || !voiceChannel) throw new Error();

    this.textChannel = textChannel;
    this.voiceChannel = voiceChannel;
    this.connection = connection;

    this.songs = [];
    this.volume = 5;
    this.playing = false;
  }
}

module.exports = QueueContruct;
