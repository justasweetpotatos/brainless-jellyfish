import { Interaction } from "discord.js";
import SuwaBot from "../bot/SuwaBot";

class InteractionHandler {
  private readonly client: SuwaBot;
  constructor(client: SuwaBot) {
    this.client = client;
  }

  async executeInteraction(interaction: Interaction) {
    // if (interaction.isChatInputCommand()) {
    //   await this.client.commandHandler.executeCommandInteraction(interaction);
    // } else if (interaction.isAutocomplete()) {
    //   await this.client.commandHandler.executeAutocompleteCommandInteraction(interaction);
    // } else if (interaction.isModalSubmit()) {
    //   //
    // } else if (interaction.isButton()) {
    //   await this.client.componentHandler.executeButtonInteraction(interaction);
    // }
  }
}

export default InteractionHandler;
