import { ChatInputCommandInteraction, Colors, EmbedBuilder, PermissionFlagsBits, TextChannel } from "discord.js";
import SuwaClient from "../bot";
import { craftActionRowButtonComponents } from "../utils/functions";
import { reactRoleDescriptionOption, reactRoleTitleOption } from "./commandOptions/stringOptions";
import ClientSlashCommandBuilder from "../structures/ClientSlashCommandBuilder";

module.exports = new ClientSlashCommandBuilder(__filename)
  .setName("send-react-role-message")
  .setDescription("any")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
  .setExecutor(async (client: SuwaClient, interaction: ChatInputCommandInteraction) => {
    interaction.deferred ? "" : await interaction.deferReply({ ephemeral: true });

    const title = interaction.options.getString("title", true);
    const description = interaction.options.getString("description", true);

    if (interaction.channel instanceof TextChannel) {
      const reactButton = client.componentManager.getButtonData("react-role-button");
      const actionRow = craftActionRowButtonComponents([reactButton.data]);
      await interaction.channel.send({
        embeds: [
          new EmbedBuilder({
            title: title,
            description: description,
            color: Colors.Purple,
          }),
        ],
        components: [actionRow],
      });
    }

    await interaction.editReply({ content: "done" });
  })
  .addStringOption(reactRoleTitleOption)
  .addStringOption(reactRoleDescriptionOption);
