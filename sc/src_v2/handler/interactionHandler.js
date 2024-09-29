const { Interaction } = require("discord.js");

const { SuwaClient } = require("../client/bot");
const { Logger } = require("../utils/logger");

class InteractionHandler {
  /**
   *
   * @param {SuwaClient} client
   */
  constructor(client) {
    this.client = client;

    this.logger = new Logger("InteractionHandler", client.logSystem);
  }

  /**
   *
   * @param {Interaction} interaction
   */
  async executeInteraction(interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        await this.client.slashCommandHandler.executeCommand(interaction);
      } else if (interaction.isButton()) {
      } else if (interaction.isAutocomplete()) {
        await this.client.slashCommandHandler.executeAutocompleteResponse(interaction);
      }
    } catch (error) {
      await this.client.errorHandler.handleCommandError(error, this.logger);
    }
  }
}

module.exports = { InteractionHandler };
