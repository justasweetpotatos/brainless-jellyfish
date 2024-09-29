const {
  SlashCommandSubcommandBuilder,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} = require("discord.js");

const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
} = require("@discordjs/voice");

const ytdl = require("@distube/ytdl-core");

const cookies = [
  {
    domain: ".youtube.com",
    expirationDate: 1756446387.716505,
    hostOnly: false,
    httpOnly: false,
    name: "__Secure-1PAPISID",
    path: "/",
    sameSite: "unspecified",
    secure: true,
    session: false,
    storeId: "0",
    value: "7TBdwJyMk8hhGC4h/AdzbtUKbMIJoulCws",
    id: 1,
  },
  {
    domain: ".youtube.com",
    expirationDate: 1756446387.716391,
    hostOnly: false,
    httpOnly: true,
    name: "__Secure-1PSID",
    path: "/",
    sameSite: "unspecified",
    secure: true,
    session: false,
    storeId: "0",
    value:
      "g.a000mQiI7SN7DuOssBXQKWSZBcZBuHByzqIXAw11O65JnfmmIESbE_W118oVZqW1kjq6u5y5VgACgYKAegSARUSFQHGX2Mi2IP2bLTc88yru1_oSECfvBoVAUF8yKqfp-H_ou3tg4pbH3vu18Y00076",
    id: 2,
  },
  {
    domain: ".youtube.com",
    expirationDate: 1755441081.504233,
    hostOnly: false,
    httpOnly: true,
    name: "__Secure-1PSIDCC",
    path: "/",
    sameSite: "unspecified",
    secure: true,
    session: false,
    storeId: "0",
    value:
      "AKEyXzXQ6rCuXjl_iM2-lfPzrKS-FF-m1JrRpAXzIgeaXqJI4m73zdViKZb5qc_T92BVGcPtJw",
    id: 3,
  },
  {
    domain: ".youtube.com",
    expirationDate: 1755441034.341198,
    hostOnly: false,
    httpOnly: true,
    name: "__Secure-1PSIDTS",
    path: "/",
    sameSite: "unspecified",
    secure: true,
    session: false,
    storeId: "0",
    value:
      "sidts-CjEBUFGoh8l0Jk3N2E3eg-JeADvuo1nJtHDMpx5RArjst21SJ6v3HzLlawkOzYkFB6eNEAA",
    id: 4,
  },
  {
    domain: ".youtube.com",
    expirationDate: 1756446387.716524,
    hostOnly: false,
    httpOnly: false,
    name: "__Secure-3PAPISID",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    storeId: "0",
    value: "7TBdwJyMk8hhGC4h/AdzbtUKbMIJoulCws",
    id: 5,
  },
  {
    domain: ".youtube.com",
    expirationDate: 1756446387.716413,
    hostOnly: false,
    httpOnly: true,
    name: "__Secure-3PSID",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    storeId: "0",
    value:
      "g.a000mQiI7SN7DuOssBXQKWSZBcZBuHByzqIXAw11O65JnfmmIESb27XI96oZjs7uOSYqjhc0VQACgYKAW4SARUSFQHGX2MiKTdKwm3eWzdjKiYDlR1ysxoVAUF8yKpkRThJEZyytC4OU3wUxvVn0076",
    id: 6,
  },
  {
    domain: ".youtube.com",
    expirationDate: 1755441081.50428,
    hostOnly: false,
    httpOnly: true,
    name: "__Secure-3PSIDCC",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    storeId: "0",
    value:
      "AKEyXzWDHSIN5Mf2JOUdqrwQOtmfYq0oIwcyTJmSBY8azuTvqo3RJx_3-fNxcVYJ7fU5B4WQmUk",
    id: 7,
  },
  {
    domain: ".youtube.com",
    expirationDate: 1755441034.341416,
    hostOnly: false,
    httpOnly: true,
    name: "__Secure-3PSIDTS",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    storeId: "0",
    value:
      "sidts-CjEBUFGoh8l0Jk3N2E3eg-JeADvuo1nJtHDMpx5RArjst21SJ6v3HzLlawkOzYkFB6eNEAA",
    id: 8,
  },
  {
    domain: ".youtube.com",
    expirationDate: 1756446387.716469,
    hostOnly: false,
    httpOnly: false,
    name: "APISID",
    path: "/",
    sameSite: "unspecified",
    secure: false,
    session: false,
    storeId: "0",
    value: "BRSYTVgM9w0JQ-9e/At3M26hdzLo2aSN2Y",
    id: 9,
  },
  {
    domain: ".youtube.com",
    expirationDate: 1756446387.716434,
    hostOnly: false,
    httpOnly: true,
    name: "HSID",
    path: "/",
    sameSite: "unspecified",
    secure: false,
    session: false,
    storeId: "0",
    value: "AjGPtwPVjfX_aXKk4",
    id: 10,
  },
  {
    domain: ".youtube.com",
    expirationDate: 1758463010.022672,
    hostOnly: false,
    httpOnly: true,
    name: "LOGIN_INFO",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    storeId: "0",
    value:
      "AFmmF2swRgIhAOgY16aZR9eMDt1QkErnlsW26g3gEYM1Al3LHnJFpCllAiEA0QMxU2apVPV1zXcHtxREn6MJC8prCFDx6EXIVvYjBZg:QUQ3MjNmeklOZGJfTHp0ajJzdWpkWTF0MV96RmZ4WEdhSV9YMk9jQ192LXdDWmtrMFE1SHIwX25FRWZ5ODlFTjhqRF94bVc3bVFXbXVlNUgzbl9YT3l6VFB6ckdmUGRscnB3bFROM245N19JLWtDMWNCNDA4VmJiMUJkZ2Jqbkd3Tll1MlRzc2s1VVFPMG1TdDBFdHdubmE4QVZhR1NNTG0tV2x2c0ZHbFlIbmdudW9uWE1EbVVaZkN6UFpSenNnTEpPR3Nyc08yb2h3TVNXTTcySW1HSXA0YnZNczFNQXhvUQ==",
    id: 11,
  },
  {
    domain: ".youtube.com",
    expirationDate: 1758465075.475023,
    hostOnly: false,
    httpOnly: false,
    name: "PREF",
    path: "/",
    sameSite: "unspecified",
    secure: true,
    session: false,
    storeId: "0",
    value: "tz=Asia.Saigon",
    id: 12,
  },
  {
    domain: ".youtube.com",
    expirationDate: 1756446387.716487,
    hostOnly: false,
    httpOnly: false,
    name: "SAPISID",
    path: "/",
    sameSite: "unspecified",
    secure: true,
    session: false,
    storeId: "0",
    value: "7TBdwJyMk8hhGC4h/AdzbtUKbMIJoulCws",
    id: 13,
  },
  {
    domain: ".youtube.com",
    expirationDate: 1756446387.716238,
    hostOnly: false,
    httpOnly: false,
    name: "SID",
    path: "/",
    sameSite: "unspecified",
    secure: false,
    session: false,
    storeId: "0",
    value:
      "g.a000mQiI7SN7DuOssBXQKWSZBcZBuHByzqIXAw11O65JnfmmIESbEZXurZCGHyLj0WFJenJdswACgYKAa8SARUSFQHGX2Mi-1shSnXlWdaHElWg1gs-4xoVAUF8yKoYP3wDPqCjnYrHArT50EwB0076",
    id: 14,
  },
  {
    domain: ".youtube.com",
    expirationDate: 1755441081.50412,
    hostOnly: false,
    httpOnly: false,
    name: "SIDCC",
    path: "/",
    sameSite: "unspecified",
    secure: false,
    session: false,
    storeId: "0",
    value:
      "AKEyXzWXlYckYW7ckkiZXpudR5OkZw32iIkU0lIxWOimfY4lpmlESiGN9F7HNehW44-BLkkR0Q",
    id: 15,
  },
  {
    domain: ".youtube.com",
    expirationDate: 1756446387.716452,
    hostOnly: false,
    httpOnly: true,
    name: "SSID",
    path: "/",
    sameSite: "unspecified",
    secure: true,
    session: false,
    storeId: "0",
    value: "AqzBh8f7VJWrJqITu",
    id: 16,
  },
  {
    domain: ".youtube.com",
    expirationDate: 1723905082,
    hostOnly: false,
    httpOnly: false,
    name: "ST-l3hjtt",
    path: "/",
    sameSite: "unspecified",
    secure: false,
    session: false,
    storeId: "0",
    value:
      "session_logininfo=AFmmF2swRgIhAOgY16aZR9eMDt1QkErnlsW26g3gEYM1Al3LHnJFpCllAiEA0QMxU2apVPV1zXcHtxREn6MJC8prCFDx6EXIVvYjBZg%3AQUQ3MjNmeklOZGJfTHp0ajJzdWpkWTF0MV96RmZ4WEdhSV9YMk9jQ192LXdDWmtrMFE1SHIwX25FRWZ5ODlFTjhqRF94bVc3bVFXbXVlNUgzbl9YT3l6VFB6ckdmUGRscnB3bFROM245N19JLWtDMWNCNDA4VmJiMUJkZ2Jqbkd3Tll1MlRzc2s1VVFPMG1TdDBFdHdubmE4QVZhR1NNTG0tV2x2c0ZHbFlIbmdudW9uWE1EbVVaZkN6UFpSenNnTEpPR3Nyc08yb2h3TVNXTTcySW1HSXA0YnZNczFNQXhvUQ%3D%3D",
    id: 17,
  },
  {
    domain: ".youtube.com",
    expirationDate: 1723905083,
    hostOnly: false,
    httpOnly: false,
    name: "ST-xuwub9",
    path: "/",
    sameSite: "unspecified",
    secure: false,
    session: false,
    storeId: "0",
    value:
      "session_logininfo=AFmmF2swRgIhAOgY16aZR9eMDt1QkErnlsW26g3gEYM1Al3LHnJFpCllAiEA0QMxU2apVPV1zXcHtxREn6MJC8prCFDx6EXIVvYjBZg%3AQUQ3MjNmeklOZGJfTHp0ajJzdWpkWTF0MV96RmZ4WEdhSV9YMk9jQ192LXdDWmtrMFE1SHIwX25FRWZ5ODlFTjhqRF94bVc3bVFXbXVlNUgzbl9YT3l6VFB6ckdmUGRscnB3bFROM245N19JLWtDMWNCNDA4VmJiMUJkZ2Jqbkd3Tll1MlRzc2s1VVFPMG1TdDBFdHdubmE4QVZhR1NNTG0tV2x2c0ZHbFlIbmdudW9uWE1EbVVaZkN6UFpSenNnTEpPR3Nyc08yb2h3TVNXTTcySW1HSXA0YnZNczFNQXhvUQ%3D%3D",
    id: 18,
  },
];

const agent = ytdl.createAgent(cookies);

module.exports = {
  data: new SlashCommandSubcommandBuilder()
    .setName("play")
    .setDescription("any")
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription("The URL of the song you want to play.")
        .setRequired(true)
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel)
      return interaction.editReply("Please join a voice channel first!");

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    const player = createAudioPlayer();
    connection.subscribe(player);

    const url = interaction.options.getString("url");
    const stream = ytdl(url, { filter: "audioonly", agent: agent });
    const video = await ytdl.getBasicInfo(url, { agent: agent });
    console.log(video);

    // const resource = createAudioResource(stream);
    // console.log(resource);
    // player.play(resource);

    const embed = new EmbedBuilder()
      .setTitle("Now Playing")
      .setDescription("video.videoDetails.title")
      .setColor("#00FF00");

    await interaction.editReply({ embeds: [embed] });
  },
};
