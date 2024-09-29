const {
  SlashCommandSubcommandBuilder,
  SlashCommandStringOption,
  CommandInteraction,
  AutocompleteInteraction,
} = require("discord.js");
const { SuwaClient } = require("../../client/bot");

module.exports = {
  data: new SlashCommandSubcommandBuilder()
    .setName("disable")
    .setDescription("disable a command.")
    .addStringOption(
      new SlashCommandStringOption()
        .setName("command-name")
        .setDescription("Name of the command.")
        .setAutocomplete(true)
    ),
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {SuwaClient} client
   */
  async execute(interaction, client) {
    client.slashCommandHandler.disableCommand(interaction.options.get("command-name"));
  },

  /**
   *
   * @param {AutocompleteInteraction} interaction
   * @param {SuwaClient} client
   */
  async autocompleteResponse(interaction, client) {
    const interactionFocusedValue = interaction.options.getFocused();
    const commnitValues = [];
    client.slashCommandHandler.commands.forEach((execute, commandName) => commnitValues.push({ name: commandName, value: commandName }));
    await interaction.respond(commnitValues.filter((choice) => choice.name.startsWith(interactionFocusedValue)));
  },
};
