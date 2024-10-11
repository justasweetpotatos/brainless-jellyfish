import {
  ButtonComponent,
  ChatInputCommandInteraction,
  CommandInteraction,
  TextChannel,
  VoiceChannel,
} from "discord.js";
import SuwaClient from "../../bot";
import ClientSlashCommandSubcommandBuilder from "../../structures/ClientSlashCommandSubcommandBuilder";
import { autoRoleSetButtonMessageIdOption } from "../commandOptions/stringOptions";
import { autoDeferReply, createEmbedWithTimestampAndCreateUser } from "../../utils/functions";
import { AutoRoleButtonCustomId } from "../../utils/enums/button";

module.exports = new ClientSlashCommandSubcommandBuilder(__filename)
  .setName("remove-buttons")
  .setDescription("Remove all autorole button from message.")
  .setExecutor(async (client: SuwaClient, interaction: ChatInputCommandInteraction) => {
    await autoDeferReply(interaction, { ephemeral: true });
    const replyEmbed = createEmbedWithTimestampAndCreateUser(interaction);
    const commandInteraction = interaction as CommandInteraction;

    const messageId = interaction.options.getString("message-id", true);

    if (!interaction.channel) return;
    if (!(interaction.channel instanceof TextChannel || interaction.channel instanceof VoiceChannel)) return;

    const message = await interaction.channel.messages.fetch(messageId);

    if (!message || !message.editable) {
      replyEmbed
        .setTitle("Message is invalid !")
        .setDescription("Please check the id of the message is valid or belong this bot")
        .setColor("Yellow");
      await commandInteraction.editReply({ embeds: [replyEmbed] });
      return;
    }

    if (!(message.components.length > 0)) {
      replyEmbed.setTitle("No components to delete !").setColor("Yellow");
      await interaction.editReply({ embeds: [replyEmbed] });
      return;
    }

    message.components.forEach((actionRow, index) => {
      actionRow.components.forEach((component, componentIndex) => {
        if (
          component instanceof ButtonComponent &&
          component.customId?.startsWith(AutoRoleButtonCustomId.AUTOROLE_BUTTON)
        ) {
          actionRow.components.splice(componentIndex, 1);
        }
      });

      if (actionRow.components.length == 0) message.components.splice(index);
    });

    await message.edit({ components: message.components });
    replyEmbed.setTitle("Action complete !").setDescription("Removed all buttons !").setColor("Green");
    await interaction.editReply({ embeds: [replyEmbed] });
  })
  .addStringOption(autoRoleSetButtonMessageIdOption);
