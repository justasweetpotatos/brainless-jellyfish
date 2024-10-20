import { ChannelType, ChatInputCommandInteraction, SlashCommandChannelOption, TextChannel } from "discord.js";
import SuwaClient from "../../bot";
import { ClientSlashCommandSubcommandBuilder } from "../../models/ClientCommand";

module.exports = new ClientSlashCommandSubcommandBuilder(__filename)
  .setName("setting")
  .setNameLocalization("vi", "cài-đặt")
  .setDescription("Connecting word channle setting")
  .setDescriptionLocalization("vi", "Cài đặt kênh game nối chữ")
  .setExecutor(async (client: SuwaClient, interaction: ChatInputCommandInteraction) => {
    interaction.deferred ? "" : await interaction.deferReply({ fetchReply: true });
    const channel: TextChannel = interaction.options.getChannel("channel", true);

    await interaction.editReply({ content: `${channel.id}` });
  })
  .addChannelOption(
    new SlashCommandChannelOption()
      .setName("channel")
      .setDescription("The text channel")
      .setNameLocalization("vi", "kênh")
      .setDescriptionLocalization("vi", "Kênh chat")
      .setRequired(true)
      .addChannelTypes(ChannelType.GuildText)
  );
