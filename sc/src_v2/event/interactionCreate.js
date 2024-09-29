const { Interaction, CommandInteraction } = require("discord.js");
const { SuwaClient } = require("../client/bot");

module.exports = {
  name: "interactionCreate",
  /**
   * @param {Interaction} interaction
   * @param {SuwaClient} client
   * @returns
   */
  async execute(interaction, client) {
    await client.interactionHandler.executeInteraction(interaction);
  },
};
