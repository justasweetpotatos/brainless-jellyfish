import { ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js";
import ButtonData from "../../../interfaces/ComponentData";
import SuwaClient from "../../../bot";

const closeMesageButton: ButtonData = {
  customId: "close-message-button",
  data: new ButtonBuilder().setCustomId("close-message-button").setStyle(ButtonStyle.Danger),
  execute: async (client: SuwaClient, interaction: ButtonInteraction) => {
    interaction.message.deletable ?? (await interaction.message.delete());
  },
};

module.exports = closeMesageButton;
