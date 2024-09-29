const { ChatInputCommandInteraction, SlashCommandStringOption, AutocompleteInteraction } = require("discord.js");
const { ClientSlashCommandSubcommandBuilder } = require("../../../models/command");
const { SuwaClient } = require("../../../client/client");

module.exports = new ClientSlashCommandSubcommandBuilder(__filename)
  .setName("reload")
  .setDescription("any")
  .setExecutor(
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {SuwaClient} client
     */
    async (interaction, client) => {
      console.log(interaction.options.get("command-name"));

      interaction.deferred ? "" : await interaction.deferReply({ ephemeral: true });
      interaction.editReply({ content: "done" });
    }
  )
  .addStringOption(
    new SlashCommandStringOption()
      .setName("command-name")
      .setDescription("Name of the command")
      .setRequired(true)
      .setAutocomplete(true)
  )
  .setAutoresponseListener(
    "command-name",
    /**
     *
     * @param {AutocompleteInteraction} interaction
     * @param {SuwaClient} client
     */
    async (interaction, client) => {
      const choices = [];
      const focusedValue = interaction.options.getFocused(true);
      client.commandHandler.getCommandnameList(true).forEach((value) =>
        choices.push({
          name: value,
          value: value,
        })
      );

      let lastChoices = choices.filter((choice) => choice.name.includes(focusedValue.value));
      await interaction.respond(lastChoices.slice(0, 25));
    }
  );
