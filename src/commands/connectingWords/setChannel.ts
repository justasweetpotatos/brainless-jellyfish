import { ChannelType, ChatInputCommandInteraction, SlashCommandChannelOption, TextChannel } from "discord.js";
import ClientSlashCommandSubcommandBuilder from "../../structures/ClientSlashCommandSubcommandBuilder";
import SuwaClient from "../../bot";

module.exports = new ClientSlashCommandSubcommandBuilder(__filename)
  .setName("set")
  // .setNameLocalization("vi", "đặt")
  .setDescription("Set channle to play.")
  .setExecutor(async (client: SuwaClient, interaction: ChatInputCommandInteraction) => {
    interaction.deferred ? "" : await interaction.deferReply({ fetchReply: true });
    const channel: TextChannel = interaction.options.getChannel("channel", true);

    await interaction.editReply({ content: `${channel.id}` });
  })
  .addChannelOption(
    new SlashCommandChannelOption()
      .setName("channel")
      .setDescription("any")
      .addChannelTypes(ChannelType.GuildText)
      // .setDescriptionLocalization("vi", "kênh")
      .setRequired(true)
  );
