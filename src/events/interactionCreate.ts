import { Events, Interaction } from "discord.js";
import SuwaClient from "../bot";
import { EventData } from "../interfaces/EventData";

const interactionCreate: EventData = {
  name: Events.InteractionCreate,
  execute: async (client: SuwaClient, interaction: Interaction) => {
    await client.interactionHandler.executeInteraction(interaction);
  },
};

module.exports = interactionCreate;
