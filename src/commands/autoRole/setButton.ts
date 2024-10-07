import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  Colors,
  Embed,
  EmbedBuilder,
  TextChannel,
} from "discord.js";
import SuwaClient from "../../bot";
import { ClientSlashCommandSubcommandBuilder } from "../../models/ClientCommand";
import { autoRoleSetButtonMessageIdOption, autoRoleSetButtonNameOption } from "../commandOptions/stringOptions";

const setButton = new ClientSlashCommandSubcommandBuilder(__filename)
  .setName("set-button")
  .setDescription("Set button to message")
  .setExecutor(async (client: SuwaClient, interaction: ChatInputCommandInteraction) => {
    !interaction.deferred ? await interaction.deferReply({ ephemeral: true }) : undefined;
    const embed = new EmbedBuilder({
      footer: { text: interaction.user.displayName, iconURL: interaction.user.avatarURL() ?? "" },
      timestamp: Date.now(),
    });
    const channel = interaction.channel;

    if (channel instanceof TextChannel) {
      const buttonId = interaction.options.getString("button-name", true);
      const messageId = interaction.options.getString("message-id", true);
      const message = await channel.messages.fetch(messageId);
      const role = channel.guild.roles.cache.get(buttonId.split("_").at(2) ?? "123");

      if (message && role) {
        const manager = client.autoRoleManager.callGuildManager(channel.guild);
        const statusMessage = await manager.setToMessage(message, buttonId, role);
        if (!statusMessage) embed.setTitle("Action complete !").setColor(Colors.Green);
        else embed.setTitle(statusMessage).setColor(Colors.Yellow);
      } else {
        embed.setTitle("Message or role not found !").setColor(Colors.Yellow);
      }
    } else {
      embed.setTitle("Channel invalid, pls switch to text channel !").setColor(Colors.Yellow);
    }

    await interaction.editReply({ embeds: [embed] });
  })
  .setAutocompleteExecutor(async (client: SuwaClient, interaction: AutocompleteInteraction) => {
    if (interaction.guild) {
      const manager = client.autoRoleManager.callGuildManager(interaction.guild);
      const values = manager.getButtonOptionsForAutocompleteInteraction();
      const filteredValues = values.filter((item) => item.name !== interaction.options.getFocused());
      await interaction.respond(filteredValues);
    }
  })
  .addStringOption(autoRoleSetButtonNameOption)
  .addStringOption(autoRoleSetButtonMessageIdOption);

module.exports = setButton;
