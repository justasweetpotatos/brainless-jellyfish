import { ChatInputCommandInteraction } from "discord.js";
import SuwaClient from "../bot";
import { ClientSlashCommandBuilder } from "../models/ClientCommand";

module.exports = new ClientSlashCommandBuilder(__filename)
  .setName("connecting-word")
  .setNameLocalization("vi", "noi-chu")
  .setExecutor(async (client: SuwaClient, interaction: ChatInputCommandInteraction) => {});
