import { Client, CommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";
import SuwaClient from "../../../bot";

module.exports = {
  data: new SlashCommandSubcommandBuilder().setName("create").setDescription("Select or create channel !"),

  async execute(interaction: CommandInteraction, client: SuwaClient | Client) {},
};
