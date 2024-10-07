import {
  AutocompleteInteraction,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  TextChannel,
  VoiceChannel,
} from "discord.js";
import SuwaClient from "../../bot";
import { ClientSlashCommandSubcommandBuilder } from "../../models/ClientCommand";
import {
  autoRoleSetButtonEmojiOption,
  autoRoleSetButtonMessageIdOption,
  autoRoleSetButtonNameOption,
} from "../commandOptions/stringOptions";

const setButton = new ClientSlashCommandSubcommandBuilder(__filename)
  .setName("set-button")
  .setDescription("Set button to message")
  .setExecutor(async (client: SuwaClient, interaction: ChatInputCommandInteraction) => {
    !interaction.deferred ? await interaction.deferReply({ ephemeral: true }) : undefined;

    const replyEmbed = new EmbedBuilder({
      footer: { text: interaction.user.displayName, iconURL: interaction.user.avatarURL() ?? "" },
      timestamp: Date.now(),
    });

    const buttonId = interaction.options.getString("button-name", true);
    const messageId = interaction.options.getString("message-id", true);

    const channel = interaction.channel;
    if (!channel) return;
    if (!interaction.guild) return;
    if (!(channel instanceof TextChannel || channel instanceof VoiceChannel)) return;

    const message = await channel.messages.fetch(messageId);

    // let buttonData = require("../../components/buttons/general/autoRoleButton") as ButtonData;
    // buttonData = { customId: buttonId, data: new ButtonBuilder(buttonData.data.data), execute: buttonData.execute };

    const manager = client.autoRoleManager.callGuildManager(interaction.guild);
    const statusMessage = await manager.setToMessage(message, buttonId);
    client.autoRoleManager.updateGuildManager(interaction.guild, manager);

    if (statusMessage) replyEmbed.setTitle("Action failed !").setDescription(statusMessage).setColor("Yellow");
    else replyEmbed.setTitle("Action complete !").setColor("Green");

    await interaction.editReply({ embeds: [replyEmbed] });
  })
  .setAutocompleteExecutor(async (client: SuwaClient, interaction: AutocompleteInteraction) => {
    if (!interaction.guild) return;
    const focusedValue = interaction.options.getFocused(true);
    switch (focusedValue.name) {
      case "button-name":
        const manager = client.autoRoleManager.callGuildManager(interaction.guild);
        const values = manager.getButtonOptionsForAutocompleteInteraction();
        const filteredValues = values.filter((item) => item.name !== focusedValue.value);
        await interaction.respond(filteredValues);
        break;
      case "style":
        const styleList = Object.entries(ButtonStyle).map(([key, value]) => {
          return { name: key, value: value };
        });
        const filtered = styleList.filter((style) =>
          style.name.toLowerCase().includes(focusedValue.value.toLowerCase())
        );
        await interaction.respond(filtered);
        break;
      default:
        await interaction.respond([]);
        break;
    }
  })
  .addStringOption(autoRoleSetButtonNameOption)
  .addStringOption(autoRoleSetButtonMessageIdOption)
  .addStringOption(autoRoleSetButtonEmojiOption);

module.exports = setButton;
