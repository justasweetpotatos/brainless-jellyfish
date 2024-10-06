import { ChatInputCommandInteraction, SlashCommandNumberOption } from "discord.js";
import SuwaClient from "../../bot";
import { ClientSlashCommandSubcommandBuilder } from "../../models/ClientCommand";
import { ClientError, ErrorCode } from "../../utils/error/ClientError";
import { deleteMessages } from "../../utils/functions";
import { numberToDeleteMessageOption } from "../commandOptions/numberOptions";

module.exports = new ClientSlashCommandSubcommandBuilder(__filename)
  .setName("attactment")
  .setNameLocalization("vi", "tệp-tin")
  .setDescriptionLocalization("vi", "Xóa tin nhắn có chứa tệp tin.")
  .setDescription("Purge message contain attactment.")
  .setExecutor(async (client: SuwaClient, interaction: ChatInputCommandInteraction) => {
    // Defer the reply to give time to process
    if (!interaction.deferred) await interaction.deferReply({ fetchReply: true });

    if (!interaction.channel) throw new ClientError("", ErrorCode.NO_TARGET_CHANNEL);

    await deleteMessages(
      { amount: interaction.options.getNumber("amount", true), includeAttachments: true },
      interaction
    );
  })
  .addNumberOption(numberToDeleteMessageOption);
