import { ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import SuwaClient from "../bot";
import { ClientSlashCommandBuilder } from "../models/ClientCommand";

module.exports = new ClientSlashCommandBuilder(__filename)
  .setName("refresh-command")
  .setDescription("any")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .setExecutor(async (client: SuwaClient, interaction: ChatInputCommandInteraction) => {
    !interaction.deferred ? await interaction.deferReply({ ephemeral: true }) : "";
    if (interaction.user.id !== `866628870123552798`) {
      await interaction.editReply({ content: "Bạn không phải người điều hành bot !" });
      return;
    }

    await client.commandManager.reloadCommands();
    await client.loadPreferences();
    await interaction.editReply({ content: "done !" });
  });
