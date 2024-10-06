import { SlashCommandSubcommandGroupBuilder, CommandInteraction, Client } from "discord.js";

import SuwaClient from "../../../bot";

module.exports = {
  data: new SlashCommandSubcommandGroupBuilder().setName("config").setDescription("Configuration settings"),

  async execute(interaction: CommandInteraction, client: SuwaClient | Client) {},
};
