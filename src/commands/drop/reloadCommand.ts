import { CommandInteraction, SlashCommandBuilder, SlashCommandStringOption } from "discord.js";
import SuwaClient from "../../bot";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reload-command")
    .setDescription("any")
    .addStringOption(
      new SlashCommandStringOption()
        .setName("command-name")
        .setDescription("Name of command")
        .setRequired(true)
    ),
  async execute(interaction: CommandInteraction, client: SuwaClient) {
    // await interaction.deferReply({ ephemeral: true });
    // const commandName = interaction.options.get("command-name")?.value?.toString();
    // client.comManager.reloadCommand(commandName ? commandName : "");
    // await interaction.editReply({ content: "Done !" });
  },
};
