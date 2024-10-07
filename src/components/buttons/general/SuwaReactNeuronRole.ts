import { ButtonBuilder, ButtonInteraction, ButtonStyle, Colors, EmbedBuilder } from "discord.js";
import { ButtonData } from "../../../interfaces/ComponentData";
import SuwaClient from "../../../bot";

const closeMesageButton: ButtonData = {
  customId: "react-role-button",
  data: new ButtonBuilder().setCustomId("react-role-button").setLabel("Verify").setStyle(ButtonStyle.Success),
  execute: async (client: SuwaClient, interaction: ButtonInteraction) => {
    interaction.deferred ? "" : await interaction.deferReply({ ephemeral: true });
    const neuronRole = await interaction.guild?.roles.fetch("821334665440002068");
    const member = await interaction.guild?.members.fetch(interaction.user.id);
    if (neuronRole && member) {
      if (member.roles.cache.get("821334665440002068")) {
        // member.roles.remove(neuronRole);
        await interaction.editReply({
          embeds: [
            new EmbedBuilder({
              title: "Bạn đã có role neuron rồi, bấm cái quần què <:Cat_DuaTaoDayA:1173959894941057074>",
              color: Colors.Green,
            }),
          ],
        });
      } else {
        member.roles.add(neuronRole);
        await interaction.editReply({
          embeds: [new EmbedBuilder({ title: "Đã thêm role thành công !", color: Colors.Green })],
        });
      }
    }
  },
};

module.exports = closeMesageButton;
