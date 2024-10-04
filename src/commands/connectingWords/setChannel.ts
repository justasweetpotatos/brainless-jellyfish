import { ChatInputCommandInteraction, SlashCommandChannelOption } from "discord.js";
import { ClientSlashCommandSubcommandBuilder } from "../../models/ClientCommand";
import SuwaClient from "../../bot";

module.exports = new ClientSlashCommandSubcommandBuilder(__filename)
  .setName("set")
  .setNameLocalization("vi", "thiết-lập")
  .setExecutor(async (client: SuwaClient, interaction: ChatInputCommandInteraction) => {
    
  })
  .addChannelOption(new SlashCommandChannelOption().setName("channel").setDescriptionLocalization("vi", "kênh"))
  ;