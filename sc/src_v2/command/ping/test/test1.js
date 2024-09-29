const { CommandInteraction, SlashCommandSubcommandBuilder } = require("discord.js");
const { SuwaClient } = require("../../../client/bot");

module.exports = {
  data: new SlashCommandSubcommandBuilder().setName("test-1").setDescription("test"),

  /**
   *
   * @param {CommandInteraction} interaction
   * @param {SuwaClient} client
   */
  async execute(interaction, client) {
    console.log(a);
    await interaction.channel.send({ content: "done !" });
  },
};
