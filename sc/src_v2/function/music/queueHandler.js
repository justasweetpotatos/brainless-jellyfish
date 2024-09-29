const { Guild, ChatInputCommandInteraction, EmbedBuilder, Colors } = require("discord.js");
const { SuwaClient } = require("../../client/bot");
const QueueContruct = require("./queuecontruct");
const { createAudioPlayer, createAudioResource, AudioPlayerStatus, joinVoiceChannel } = require("@discordjs/voice");
const ytdl = require("ytdl-core-discord");

class MusicQueueHandler {
  /**
   *
   * @param {SuwaClient} client
   */
  constructor(client) {
    this.client = client;
    this.queue = new Map([["temp", new QueueContruct("temp", "temp")]]);
    this.queue.delete("temp");
  }

  /**
   *
   * @param {Guild} guild
   * @param {{title: string, url: string}} song
   * @param {ChatInputCommandInteraction} interaction
   */
  async play(guild, song, interaction) {
    const serverQueue = this.queue.get(guild.id);

    if (!song) {
      serverQueue.connection.destroy();
      this.queue.delete(guild.id);
      return "stop";
    }

    serverQueue.songs.push(song);

    if (!serverQueue.connection) {
      serverQueue.connection = joinVoiceChannel({
        channelId: serverQueue.voiceChannel.id,
        guildId: serverQueue.voiceChannel.guildId,
        adapterCreator: serverQueue.voiceChannel.guild.voiceAdapterCreator,
      });
    }

    

    const player = createAudioPlayer();
    const stream = await ytdl(song.url, {
      filter: "audioonly",
      quality: "highestaudio",
    });
    const resource = createAudioResource(stream);

    // serverQueue.connection.subscribe(player);
    player.play(resource);

    player.on(AudioPlayerStatus.Idle, async () => {
      serverQueue.songs.shift();
      await this.play(guild, serverQueue.songs[0], interaction);
    });

    await serverQueue.textChannel.send({
      embeds: [new EmbedBuilder({ title: `Đang phát !`, description: `Bài: ${song.title}`, color: Colors.Blurple })],
    });
  }
}

module.exports = MusicQueueHandler;
