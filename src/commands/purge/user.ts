import { ChatInputCommandInteraction } from "discord.js";
import SuwaClient from "../../bot";
import ClientSlashCommandSubcommandBuilder from "../../structures/ClientSlashCommandSubcommandBuilder";
import { ClientError, ErrorCode } from "../../utils/error/ClientError";
import { deleteMessages } from "../../utils/functions";
import { userToDeleteMessageOption } from "../commandOptions/userOptions";
import { numberToDeleteMessageOption } from "../commandOptions/numberOptions";

module.exports = new ClientSlashCommandSubcommandBuilder(__filename)
  .setName("user")
  // .setNameLocalization("vi", "người-dùng")
  .setDescriptionLocalization("vi", "loại bỏ toàn bộ tin nhắn từ người dùng.")
  .setDescription("Remove all message from user.")
  .setExecutor(async (client: SuwaClient, interaction: ChatInputCommandInteraction) => {
    // Defer the reply to give time to process
    if (!interaction.deferred) await interaction.deferReply({ fetchReply: true });

    if (!interaction.channel) throw new ClientError("", ErrorCode.NO_TARGET_CHANNEL);

    await deleteMessages(
      { amount: interaction.options.getNumber("amount", true), target: interaction.options.getUser("user", true) },
      interaction
    );
  })
  .addNumberOption(numberToDeleteMessageOption)
  .addUserOption(userToDeleteMessageOption);
