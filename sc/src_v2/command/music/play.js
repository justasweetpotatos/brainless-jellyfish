const {
  SlashCommandSubcommandBuilder,
  SlashCommandStringOption,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Colors,
} = require("discord.js");
const { SuwaClient } = require("../../client/bot");
const ytdl = require("ytdl-core-discord");
const QueueContruct = require("../../function/music/queuecontruct");

module.exports = {
  data: new SlashCommandSubcommandBuilder()
    .setName("play")
    .setDescription("Play music with youtube link")
    .addStringOption(
      new SlashCommandStringOption().setName("url").setDescription("The link of video to play").setRequired(true)
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {SuwaClient} client
   */
  async execute(interaction, client) {
    await interaction.deferReply({ fetchReply: true });

    const userVoiceChannel = interaction.member.voice.channel;

    if (!userVoiceChannel) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder({
            title: "Bạn hiện tại đang không ở trong kênh thoại nào cả !",
            description: "Hãy vào một kênh thoại bất kỳ và sử dụng lệnh lại.",
            color: Colors.Blurple,
            timestamp: new Date.now(),
          }),
        ],
      });
      return;
    }

    const permissions = userVoiceChannel.permissionsFor(client.user);

    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder({
            title: "Bot hiện đang không có quyền vào và nói trong kênh thoại này !",
            description: "Hãy liên hệ với quản trị viên của server để thêm quyền cho bot.",
            color: Colors.Blurple,
            timestamp: new Date.now(),
          }),
        ],
      });
      return;
    }

    const songInfo = await ytdl.getInfo(interaction.options.getString("url"));
    const song = {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
    };

    if (!songInfo) {
      await interaction.editReply({
        embeds: [new EmbedBuilder().setTitle("ID not found !")],
      });
      return;
    }

    const serverQueue = client.musicQueueHandler.queue.get(interaction.guildId);

    if (!serverQueue) {
      const queueContruct = new QueueContruct(interaction.channel, userVoiceChannel);
      client.musicQueueHandler.queue.set(interaction.guildId, queueContruct);

      await client.musicQueueHandler.play(interaction.guild, song, interaction);
    } else {
      serverQueue.songs.push(song);
      await interaction.editReply({
        embeds: [
          new EmbedBuilder({
            title: "Đoạn nhạc mới đã được thêm vào hàng chờ !",
            description: `Tên: ${song.title}`,
            color: Colors.Green,
          }),
        ],
      });
    }
  },
};
