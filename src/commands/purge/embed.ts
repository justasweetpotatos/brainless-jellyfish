import { ChatInputCommandInteraction, SlashCommandNumberOption } from "discord.js";
import SuwaClient from "../../bot";
import ClientSlashCommandSubcommandBuilder from "../../structures/ClientSlashCommandSubcommandBuilder";
import { ClientError, ErrorCode } from "../../utils/error/ClientError";
import { deleteMessages } from "../../utils/functions";
import { numberToDeleteMessageOption } from "../commandOptions/numberOptions";

module.exports = new ClientSlashCommandSubcommandBuilder(__filename)
  .setName("embed")
  // .setNameLocalization("vi", "mã-nhúng")
  .setDescriptionLocalization("vi", "Xóa tin nhắn có chứa mã nhúng.")
  .setDescription("Purge message contain embed.")
  .setExecutor(async (client: SuwaClient, interaction: ChatInputCommandInteraction) => {
    // Defer the reply to give time to process
    if (!interaction.deferred) await interaction.deferReply({ fetchReply: true });

    if (!interaction.channel) throw new ClientError("", ErrorCode.NO_TARGET_CHANNEL);

    await deleteMessages({ amount: interaction.options.getNumber("amount", true), includeEmbed: true }, interaction);
  })
  .addNumberOption(numberToDeleteMessageOption);
