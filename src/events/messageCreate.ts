import { Events, Message } from "discord.js";
import { EventData } from "../structure/interface/event";
import SuwaBot from "../bot/SuwaBot";

const interactionCreate: EventData = {
  name: Events.MessageCreate,
  execute: async (client: SuwaBot, message: Message) => {
    client.moduleManager.onMessageCreate(message);
  },
};

module.exports = interactionCreate;
