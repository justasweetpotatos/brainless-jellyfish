const { ChatInputCommandInteraction } = require("discord.js");
const {
  ClientSlashCommandSubcommandBuilder,
} = require("../../../src_v2/typings/command");

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
      //   await interaction.channel.send({ content: "done !" });
      return "done";
    }
  );
