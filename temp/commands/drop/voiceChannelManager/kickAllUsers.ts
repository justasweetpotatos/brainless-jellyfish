import {
  SlashCommandBuilder,
  Client,
  CommandInteraction,
  SlashCommandSubcommandBuilder,
  SlashCommandChannelOption,
  ChannelType,
  VoiceChannel,
} from "discord.js";
import SuwaClient from "../../../bot";

module.exports = {
  data: new SlashCommandSubcommandBuilder()
    .setName("kick-all")
    .setDescription("Kick all user in specify vc channel !")
    .addChannelOption(
      new SlashCommandChannelOption()
        .setName("channel")
        .setDescription("The target channel.")
        .addChannelTypes(ChannelType.GuildVoice)
    ),

  async execute(interaction: CommandInteraction, client: SuwaClient | Client) {
    await interaction.deferReply({ fetchReply: true, ephemeral: true });

    try {
      const targetChannel = interaction.options.get("channel")?.channel || interaction.channel;

      if (!(targetChannel instanceof VoiceChannel)) {
        await interaction.reply({
          content: "Bạn không thể sử dụng lệnh này ở kênh không phải Voice Channel !",
        });
        return;
      }

      targetChannel.members.forEach(async (member) => {
        await member.voice.disconnect();
      });

      await interaction.reply({ content: "Done !" });
    } catch (error) {
      await interaction.reply({ content: "Failed! Something went wrong!" });
      console.log(`${error}`);
    }
  },
};
