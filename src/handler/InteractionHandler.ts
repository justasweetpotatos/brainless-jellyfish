import { ButtonInteraction, ChatInputCommandInteraction, Interaction } from "discord.js";
import SuwaClient from "../bot";

class InteractionHandler {
    private readonly client: SuwaClient
    constructor(client: SuwaClient) {
        this.client = client;
    }

    async onInteractionCreate(interaction: Interaction) {
        if (interaction instanceof ChatInputCommandInteraction) {
            await this.client;
        }
    }

    async onButtonInteractionCreate(interaction: ButtonInteraction) {
        interaction.customId
    }
}