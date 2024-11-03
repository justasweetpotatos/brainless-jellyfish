import { ChatInputCommandInteraction, CommandInteraction, Events, Interaction } from "discord.js";
import { EventData } from "../structure/interface/event";
import SuwaBot from "../bot/SuwaBot";

const interactionCreate: EventData = {
  name: Events.InteractionCreate,
  execute: async (client: SuwaBot, interaction: Interaction) => {
    // client.moduleManager.onInteractionCreate(interaction);
    if (interaction.isCommand())
      await client.commandHandler.executeCommandInteraction(interaction as ChatInputCommandInteraction);
    // await client.interactionHandler.executeInteraction(interaction);
  },
};

module.exports = interactionCreate;
