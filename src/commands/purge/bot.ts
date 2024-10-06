import { ChatInputCommandInteraction, SlashCommandNumberOption } from "discord.js";
import SuwaClient from "../../bot";
import { ClientSlashCommandSubcommandBuilder } from "../../models/ClientCommand";
import { deleteMessages } from "../../utils/functions";
import { ClientError, ErrorCode } from "../../utils/error/ClientError";
import { numberToDeleteMessageOption } from "../commandOptions/numberOptions";

module.exports = new ClientSlashCommandSubcommandBuilder(__filename)
  .setName("bot")
  .setNameLocalization("vi", "bot")
  .setDescriptionLocalization("vi", "Xóa tin nhắn của bot")
  .setDescription("Purge bot messages")
  .setExecutor(async (client: SuwaClient, interaction: ChatInputCommandInteraction) => {
    // Defer the reply to give time to process
    if (!interaction.deferred) await interaction.deferReply({ fetchReply: true });

    if (!interaction.channel) throw new ClientError("", ErrorCode.NO_TARGET_CHANNEL);

    await deleteMessages({ amount: interaction.options.getNumber("amount", true), isBot: true }, interaction);
  })
  .addNumberOption(numberToDeleteMessageOption);
