import { ChatInputCommandInteraction } from "discord.js";
import SuwaClient from "../../bot";
import { ClientSlashCommandSubcommandBuilder } from "../../models/ClientCommand";
import { containSubstringToDeleteMessageOption } from "../commandOptions/stringOptions";
import { ClientError, ErrorCode } from "../../utils/error/ClientError";
import { deleteMessages } from "../../utils/functions";
import { numberToDeleteMessageOption } from "../commandOptions/numberOptions";

module.exports = new ClientSlashCommandSubcommandBuilder(__filename)
  .setName("contain")
  .setNameLocalization("vi", "bao-gồm-nội-dung")
  .setDescriptionLocalization("vi", "Xóa toàn bộ tin nhắn có chứa nội dung được đề cập.")
  .setDescription("Removes all message containing a substring.")
  .setExecutor(async (client: SuwaClient, interaction: ChatInputCommandInteraction) => {
    if (!interaction.deferred) await interaction.deferReply({ fetchReply: true });

    if (!interaction.channel) throw new ClientError("", ErrorCode.NO_TARGET_CHANNEL);

    await deleteMessages(
      {
        amount: interaction.options.getNumber("amount", true),
        substring: interaction.options.getString("contain", true),
      },
      interaction
    );
  })
  .addNumberOption(numberToDeleteMessageOption)
  .addStringOption(containSubstringToDeleteMessageOption);
