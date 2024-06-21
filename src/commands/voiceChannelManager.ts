import { SlashCommandBuilder, Client, CommandInteraction } from "discord.js";
import SuwaClient from "../bot";

module.exports = {
  data: new SlashCommandBuilder().setName("vc-manager").setDescription("Manager user and any vc channel !"),

  async execute(interaction: CommandInteraction, client: SuwaClient | Client) {},
};
