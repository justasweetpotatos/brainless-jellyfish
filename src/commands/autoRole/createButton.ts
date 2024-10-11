import { AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js";
import SuwaClient from "../../bot";
import { autoRoleSetButtonEmojiOption, autoRoleSetButtonLabelOption } from "../commandOptions/stringOptions";
import { autoRoleCreateButtonRoleOption } from "../commandOptions/roleOptions";
import { autoRoleSetButtonStyleOption } from "../commandOptions/numberOptions";
import { autoDeferReply, createEmbedWithTimestampAndCreateUser } from "../../utils/functions";
import ClientSlashCommandSubcommandBuilder from "../../structures/ClientSlashCommandSubcommandBuilder";
import { AutoroleButtonContent } from "../../structures/interface/autorole";

module.exports = new ClientSlashCommandSubcommandBuilder(__filename)
  .setName("create-button")
  .setDescription("Create an auto role button")
  .setExecutor(async (client: SuwaClient, interaction: ChatInputCommandInteraction) => {
    await autoDeferReply(interaction, { ephemeral: true });
    const replyEmbed = createEmbedWithTimestampAndCreateUser(interaction);

    if (!interaction.guild) return;
    const bot = await interaction.guild.members.fetch(client.user?.id ?? "");
    if (!bot) return;

    // Get data
    const label = interaction.options.getString("label", true);
    const role = interaction.options.getRole("role", true);
    let emojiId = interaction.options.getString("emoji");
    let buttonStyleId = interaction.options.getNumber("style") ?? 1;

    if (bot.roles.highest.position < role.position) {
      replyEmbed
        .setTitle(`Bot can't access this role!`)
        .setDescription(
          `The level of role ${role.toString()} is higher than the highest bot role level: ${bot.roles.highest}`
        )
        .setColor("Yellow");
      await interaction.editReply({ embeds: [replyEmbed] });
      return;
    }

    let emoji = await interaction.guild.emojis.fetch(emojiId?.replace(/:.*?:/g, "").replace(/[<>]/g, "") ?? "");

    const buttonContent: AutoroleButtonContent = {
      id: "",
      customId: "",
      label: label,
      style: buttonStyleId,
      roleId: role.id,
      emojiId: emoji.id ?? "",
    };

    // get manager and create data
    const manager = client.autoRoleManager.callGuildManager(interaction.guild);
    await manager.createButton(buttonContent);
    client.autoRoleManager.updateGuildManager(interaction.guild, manager);
    replyEmbed.setTitle("Action Complete !").setColor("Green");
    await interaction.editReply({ embeds: [replyEmbed] });
    await manager.previewButton(interaction, buttonContent);
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
