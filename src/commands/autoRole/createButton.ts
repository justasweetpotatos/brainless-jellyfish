import {
  AutocompleteInteraction,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
} from "discord.js";
import { ClientSlashCommandSubcommandBuilder } from "../../models/ClientCommand";
import SuwaClient from "../../bot";
import { autoRoleSetButtonEmojiOption, autoRoleSetButtonLabelOption } from "../commandOptions/stringOptions";
import { ButtonData } from "../../interfaces/ComponentData";
import { autoRoleCreateButtonRoleOption } from "../commandOptions/roleOptions";
import { autoRoleSetButtonStyleOption } from "../commandOptions/numberOptions";

module.exports = new ClientSlashCommandSubcommandBuilder(__filename)
  .setName("create-button")
  .setDescription("Create an auto role button")
  .setExecutor(async (client: SuwaClient, interaction: ChatInputCommandInteraction) => {
    !interaction.deferred ? await interaction.deferReply({ ephemeral: true }) : "";

    const replyEmbed = new EmbedBuilder({
      footer: { text: interaction.user.displayName, iconURL: interaction.user.avatarURL() ?? "" },
      timestamp: Date.now(),
    });

    // Get data
    const label = interaction.options.getString("label", true);
    const role = interaction.options.getRole("role", true);
    let emojiId = interaction.options.getString("emoji");
    let buttonStyleId = interaction.options.getNumber("style") ?? 1;

    // Checking data is existed
    if (!interaction.guild) return;

    const bot = await interaction.guild.members.fetch(client.user?.id ?? "");
    if (!bot) return;

    if (bot.roles.highest.position < role.position) {
      replyEmbed
        .setTitle(`Bot can't access this role!`)
        .setDescription(
          `The level of role ${role.toString()} is higher than the highest bot role level: ${bot.roles.highest}`
        )
        .setColor("Yellow");
      return;
    }

    let emoji = await interaction.guild.emojis.fetch(emojiId?.replace(/:.*?:/g, "").replace(/[<>]/g, "") ?? "");

    const buttonData: ButtonData = require("../../components/buttons/general/autoRoleButton");
    let newButtonBuilder: ButtonBuilder = new ButtonBuilder({
      customId: `${buttonData.customId}_${interaction.id}`,
      label: label,
      style: buttonStyleId,
      emoji: emoji.id ?? undefined,
    });

    // get manager and create data
    const manager = client.autoRoleManager.callGuildManager(interaction.guild);

    newButtonBuilder = manager.createAutoRoleButton({
      customId: `${buttonData.customId}_${interaction.id}_${role.id}_${label.trim()}`,
      data: newButtonBuilder,
      execute: buttonData.execute,
    });

    client.autoRoleManager.updateGuildManager(interaction.guild, manager);

    await manager.previewButton(
      interaction,
      new ButtonBuilder({
        customId: `preview`,
        label: label,
        style: buttonStyleId,
        emoji: emoji.id ?? undefined,
      })
    );
  })
  .setAutocompleteExecutor(async (client: SuwaClient, interaction: AutocompleteInteraction) => {
    if (!interaction.guild) return;
    const focusedValue = interaction.options.getFocused(true);
    switch (focusedValue.name) {
      case "style":
        const styleList = [
          { name: "Primary", value: 1 },
          { name: "Secondary", value: 2 },
          { name: "Success", value: 3 },
          { name: "Danger", value: 4 },
          { name: "Link", value: 5 },
          { name: "Premium", value: 6 },
        ];
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
  .addRoleOption(autoRoleCreateButtonRoleOption)
  .addStringOption(autoRoleSetButtonLabelOption)
  .addNumberOption(autoRoleSetButtonStyleOption)
  .addStringOption(autoRoleSetButtonEmojiOption);
