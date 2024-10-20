import { Events, Interaction } from "discord.js";
import { EventData } from "../../temp/interfaces/EventData";
import SuwaBot from "../bot/SuwaBot";

const interactionCreate: EventData = {
  name: Events.InteractionCreate,
  execute: async (client: SuwaBot, interaction: Interaction) => {
    client.moduleManager.onInteractionCreate(interaction);
    // await client.interactionHandler.executeInteraction(interaction);
  },
};

module.exports = interactionCreate;
