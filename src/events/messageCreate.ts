import { Events, Interaction, Message } from "discord.js";
import { EventData } from "../../temp/interfaces/EventData";
import SuwaBot from "../bot/SuwaBot";

const interactionCreate: EventData = {
  name: Events.MessageCreate,
  execute: async (client: SuwaBot, message: Message) => {
    client.moduleManager.onMessageCreate(message);
    // await client.interactionHandler.executeInteraction(interaction);
  },
};

module.exports = interactionCreate;
