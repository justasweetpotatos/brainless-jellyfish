import { Client, CommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";
import SuwaClient from "../../../bot";

module.exports = {
  data: new SlashCommandSubcommandBuilder().setName("get-hint").setDescription("None"),

  async execute(interaction: CommandInteraction, client: SuwaClient | Client) {},
};
