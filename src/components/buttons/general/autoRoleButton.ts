import { ButtonBuilder, ButtonInteraction, Colors, EmbedBuilder } from "discord.js";
import { ButtonData } from "../../../interfaces/ComponentData";
import SuwaClient from "../../../bot";
import { ClientError, ErrorCode } from "../../../utils/error/ClientError";
import { AutoRoleButtonCustomId } from "../../../utils/enums/button";

const autoRoleButton: ButtonData = {
  customId: AutoRoleButtonCustomId.AUTOROLE_BUTTON,
  data: new ButtonBuilder(),
  execute: async (client: SuwaClient, interaction: ButtonInteraction) => {
    interaction.deferred ? "" : await interaction.deferReply({ ephemeral: true });

    const parts: Array<string> = interaction.id.split("_");
    const role = await interaction.guild?.roles.fetch(parts[1]);
    const member = await interaction.guild?.members.fetch(interaction.user.id);

    if (!role)
      throw new ClientError(
        `Can't find the ${parts[1] ? `role with id: ${parts[1]}` : `undefined role id`}`,
        ErrorCode.EXECUTE_COMPONENT_INTERACTION_FAILED
      );
    if (!member)
      throw new ClientError(
        `Can't find the member with id ${interaction.user.id}`,
        ErrorCode.EXECUTE_COMPONENT_INTERACTION_FAILED
      );

    if (member.roles.cache.get(role.id)) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder({
            title: `Bạn đã có role <@&${role.id}> rồi, bấm cái quần què <:Cat_DuaTaoDayA:1173959894941057074>`,
            color: Colors.Yellow,
          }),
        ],
      });
    } else {
      await member.roles.add(role);
      await interaction.editReply({
        embeds: [new EmbedBuilder({ title: `Đã thêm role <@&${role.id}> thành công !`, color: Colors.Green })],
      });
    }
  },
};

module.exports = autoRoleButton;
