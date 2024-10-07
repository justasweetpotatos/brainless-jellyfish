import { ButtonBuilder, ButtonInteraction } from "discord.js";
import { ButtonData } from "../../../interfaces/ComponentData";
import SuwaClient from "../../../bot";

const connectingWrordSetButton: ButtonData = {
  customId: "connecting-word-set-channel-button",
  data: new ButtonBuilder(),
  execute: async (client: SuwaClient, interaction: ButtonInteraction) => {},
  deferedInteraction: true,
  ephemeralInteraction: true,
};

module.exports = connectingWrordSetButton;
