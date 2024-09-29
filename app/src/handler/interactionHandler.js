const { ChatInputCommandInteraction, AutocompleteInteraction, ButtonInteraction } = require("discord.js");
const { SuwaClient } = require("../client/client");
const { Logger } = require("../utils/logger");

class InteractionHandler {
  /**
   *
   * @param {SuwaClient} client
   */
  constructor(client) {
    this.client = client;
    this.logger = new Logger("interaction-handler", client.logSystem);
  }

  /**
   *
   * @param {import("discord.js").Interaction} interaction
   */
  async executeInteraction(interaction) {
    if (interaction instanceof ChatInputCommandInteraction) {
      await this.client.commandHandler.executeCommandInteraction(interaction);
    } else if (interaction instanceof AutocompleteInteraction) {
      await this.client.commandHandler.executeAutocompleteInteraction(interaction);
    } else if (interaction instanceof ButtonInteraction) {
      
    }
  }
}

module.exports = InteractionHandler;
