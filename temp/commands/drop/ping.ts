import { SlashCommandBuilder, Interaction, Client, CommandInteraction } from "discord.js";
import SuwaClient from "../../bot";

module.exports = {
  data: new SlashCommandBuilder().setName(`ping`).setDescription(`Get client and bot ping.`),

  async execute(interaction: CommandInteraction, client: SuwaClient) {
    await interaction.reply({ content: "second content" });
  },
};
