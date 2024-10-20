import { ChatInputCommandInteraction, SlashCommandChannelOption, TextChannel } from "discord.js";
import SuwaClient from "../../bot";
import { ClientSlashCommandSubcommandBuilder } from "../../models/ClientCommand";

module.exports = new ClientSlashCommandSubcommandBuilder(__filename)
  .setName("unset")
  // .setNameLocalization("vi", "unset")
  .setDescription("Unset channel to play.")
  // .setDescriptionLocalization("vi", "Unset kênh để chơi nối chữ")
  .setExecutor(async (client: SuwaClient, interaction: ChatInputCommandInteraction) => {
    interaction.deferred ? "" : await interaction.deferReply({ fetchReply: true });
    const targetChannel: TextChannel = interaction.options.getChannel("channel", true);

    await interaction.editReply({ content: `${targetChannel.id}` });
  })
  .addChannelOption(
    new SlashCommandChannelOption()
      .setName("channel")
      // .setNameLocalization("vi", "kênh")
      .setDescription("The channel to unset")
      // .setDescriptionLocalization("vi", "Kênh để unset")
      .setRequired(true)
  );
