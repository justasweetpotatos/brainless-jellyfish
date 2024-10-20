import { Events, Message } from "discord.js";
import { EventData } from "../interfaces/EventData";
import SuwaClient from "../bot";

const messageCreate: EventData = {
  name: Events.MessageCreate,
  execute: async (client: SuwaClient, message: Message) => {},
};

module.exports = messageCreate;
