import { SlashCommandBuilder, CommandInteraction, Client } from "discord.js";
import SuwaClient from "../bot";

module.exports = {
  data: new SlashCommandBuilder().setName("noitu").setDescription("any"),

  async execute(interaction: CommandInteraction, client: SuwaClient | Client) {},
};
