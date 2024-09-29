const { ChatInputCommandInteraction } = require("discord.js");
const { ClientSlashCommandSubcommandBuilder } = require("../../../../models/command");

module.exports = new ClientSlashCommandSubcommandBuilder(__filename)
  .setName("list")
  .setDescription("any")
  .setExecutor(
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {SuwaClient} client
     */
    async (interaction, client) => {
      interaction.deferred ? "" : await interaction.deferReply({ ephemeral: true });
      await interaction.editReply({ content: "done " });
    }
  );
