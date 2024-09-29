const { SuwaClient } = require("../../client/client");

module.exports = {
  name: "InteractionCreate",

  /**
   *
   * @param {import("discord.js").Interaction} interaction
   * @param {SuwaClient} client
   */
  async execute(interaction, client) {
    await client.interactionHandler.executeInteraction(interaction);
  },
};
