import { ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, Colors, EmbedBuilder } from "discord.js";
import { ClientSlashCommandSubcommandBuilder } from "../../models/ClientCommand";
import SuwaClient from "../../bot";
import {
  autoRoleCreateButtonEmojiOption,
  autoRoleCreateButtonLabelOption,
  autoRoleCreateButtonStyleOption,
} from "../commandOptions/stringOptions";
import { ButtonData } from "../../interfaces/ComponentData";
import { autoRoleCreateButtonRoleOption } from "../commandOptions/roleOptions";

module.exports = new ClientSlashCommandSubcommandBuilder(__filename)
  .setName("create-button")
  .setDescription("Create an auto role button")
  .setExecutor(async (client: SuwaClient, interaction: ChatInputCommandInteraction) => {
    !interaction.deferred ? await interaction.deferReply({ ephemeral: true }) : "";

    if (interaction.guild) {
      const manager = client.autoRoleManager.callGuildManager(interaction.guild);

      const label = interaction.options.getString("label", true);
      const role = interaction.options.getRole("role", true);

      const bot = await interaction.guild.members.fetch(client.user?.id ?? "");
      if (!bot || bot.roles.highest.position < role.position) {
        await interaction.editReply({
          embeds: [
            new EmbedBuilder({
              title: `Bot can't access this role!`,
              description: `The level of role ${role.toString()} is higher than the highest bot role level: ${
                bot.roles.highest
              }`,
              color: Colors.Yellow,
            }),
          ],
        });
        return;
      }

      let emoji = await interaction.guild.emojis.fetch(
        interaction.options.getString("emoji".replace(/[<@]/g, "")) ?? ""
      );
      let style: number | null = interaction.options.getNumber("style");

      const buttonData: ButtonData = require("../../components/buttons/general/autoRoleButton");

      let newButtonBuilder: ButtonBuilder = new ButtonBuilder({
        customId: `${buttonData.customId}_${interaction.id}`,
        label: label,
        style: style ?? ButtonStyle.Primary,
        emoji: emoji.id ?? undefined,
      });

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
          style: style ?? ButtonStyle.Primary,
          emoji: emoji.id ?? undefined,
        })
      );
    }
  })
  .addRoleOption(autoRoleCreateButtonRoleOption)
  .addStringOption(autoRoleCreateButtonLabelOption)
  .addStringOption(autoRoleCreateButtonStyleOption)
  .addStringOption(autoRoleCreateButtonEmojiOption);
