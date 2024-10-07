import { ButtonInteraction, ChatInputCommandInteraction, Interaction, ModalSubmitInteraction } from "discord.js";
import SuwaClient from "../bot";

class InteractionHandler {
  private readonly client: SuwaClient;
  constructor(client: SuwaClient) {
    this.client = client;
  }

  async executeInteraction(interaction: Interaction) {
    if (interaction.isChatInputCommand()) {
      await this.client.commandHandler.executeCommandInteraction(interaction);
    } else if (interaction.isAutocomplete()) {
      await this.client.commandHandler.executeAutocompleteCommandInteraction(interaction);
    } else if (interaction.isModalSubmit()) {
      // 
    } else if (interaction.isButton()) {
      await this.client.componentHandler.executeButtonInteraction(interaction);
    }
  }
}

export default InteractionHandler;
