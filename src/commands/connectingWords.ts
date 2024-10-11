import { ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import SuwaClient from "../bot";
import ClientSlashCommandBuilder from "../structures/ClientSlashCommandBuilder";

module.exports = new ClientSlashCommandBuilder(__filename)
  .setName("connecting-word")
  .setNameLocalization('vi', "nối-chữ")
  .setDescription("any")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
  .setExecutor(async (client: SuwaClient, interaction: ChatInputCommandInteraction) => {});
