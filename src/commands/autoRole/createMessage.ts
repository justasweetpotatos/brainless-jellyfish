import {
  AutocompleteInteraction,
  ButtonBuilder,
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  Message,
  TextChannel,
  VoiceChannel,
} from "discord.js";
import SuwaClient from "../../bot";
import ClientSlashCommandSubcommandBuilder from "../../structures/ClientSlashCommandSubcommandBuilder";
import { autoRoleSetCreateMessageWithEmbedOption } from "../commandOptions/booleanOptions";
import {
  autoRoleSetButtonNameOption,
  autoRoleSetMessageDesctiptionOption,
  autoRoleSetMessageTitleOption,
} from "../commandOptions/stringOptions";
import { autoRoleSetMessageEmbedColorOption } from "../commandOptions/numberOptions";
import { autoDeferReply, createEmbedWithTimestampAndCreateUser } from "../../utils/functions";

module.exports = new ClientSlashCommandSubcommandBuilder(__filename)
  .setName("create-message")
  .setDescription("Create autoRole message and add buttons")
  .setExecutor(async (client: SuwaClient, interaction: ChatInputCommandInteraction) => {
    await autoDeferReply(interaction, { ephemeral: true });

    const replyEmbed = createEmbedWithTimestampAndCreateUser(interaction);

    const buttonId: string = interaction.options.getString("button-name", true);
    const createEmbed: boolean = interaction.options.getBoolean("create-embed", true);
    const title: string = interaction.options.getString("title", true);
    const description = interaction.options.getString("description") ?? undefined;
    const embedColor = interaction.options.getNumber("color") ?? undefined;

    const embed = new EmbedBuilder({
      title: title,
      description: description,
      color: embedColor,
      footer: { text: "Autorole System" },
      timestamp: Date.now(),
    });
    const channel = interaction.channel;

    if (!channel) return;
    if (!interaction.guild) return;
    if (!(channel instanceof TextChannel || channel instanceof VoiceChannel)) return;

    let message: Message;

    if (createEmbed) message = await channel.send({ embeds: [embed] });
    else message = await channel.send({ content: `**${title}**\n${description}` });

    const manager = client.autoRoleManager.callGuildManager(interaction.guild);
    const statusMessage = await manager.setToMessage(message, buttonId);
    client.autoRoleManager.updateGuildManager(interaction.guild, manager);

    if (statusMessage) replyEmbed.setTitle("Action failed !").setDescription(statusMessage).setColor("Yellow");
    else replyEmbed.setTitle("Action complete !").setColor("Green");

    await interaction.editReply({ embeds: [replyEmbed] });
    //
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
      case "color":
        const colorList = Object.entries(Colors).map(([key, value]) => {
          return { name: key, value: value };
        });
        const filtered = colorList.filter((color) =>
          color.name.toLowerCase().includes(focusedValue.value.toLowerCase())
        );
        await interaction.respond(filtered.slice(0, 24));
        break;
      default:
        await interaction.respond([]);
        break;
    }
  })
  .addStringOption(autoRoleSetButtonNameOption)
  .addBooleanOption(autoRoleSetCreateMessageWithEmbedOption)
  .addStringOption(autoRoleSetMessageTitleOption)
  .addStringOption(autoRoleSetMessageDesctiptionOption)
  .addNumberOption(autoRoleSetMessageEmbedColorOption);
