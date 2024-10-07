import {
  APIEmbedField,
  ButtonBuilder,
  ButtonInteraction,
  ChatInputCommandInteraction,
  Collection,
  Colors,
  EmbedBuilder,
  Guild,
  Message,
  Role,
  Snowflake,
} from "discord.js";
import { ButtonData } from "../interfaces/ComponentData";
import { craftActionRowButtonComponents } from "../utils/functions";
import { ClientError, ErrorCode } from "../utils/error/ClientError";

class GuildAutoRoleManager {
  private readonly guild: Guild;

  public autoRoleButtonCollection: Collection<string, ButtonData>;

  constructor(guild: Guild) {
    this.guild = guild;
    this.autoRoleButtonCollection = new Collection<string, ButtonData>();
  }

  async setToMessage(message: Message, buttonId: string) {
    const buttonData = this.autoRoleButtonCollection.get(buttonId);
    if (buttonData) {
      const actionRow = craftActionRowButtonComponents([buttonData.data]);
      if (message.editable) {
        await message.edit({ components: [actionRow] });
        return undefined;
      } else return "Message cant editable !";
    } else return "Button data not found !";
  }

  createAutoRoleButton(buttonData: ButtonData, newCustomId?: string) {
    buttonData.customId = newCustomId ?? buttonData.customId;
    buttonData.data.setCustomId(newCustomId ?? buttonData.customId);
    this.autoRoleButtonCollection.set(newCustomId ?? buttonData.customId, buttonData);
    return buttonData.data;
  }

  removeAutoRoleButton(buttonData: ButtonData | Snowflake) {
    if (typeof buttonData === "string") {
      const buttonBuilder = this.autoRoleButtonCollection.get(buttonData);
      if (!buttonBuilder) return false;
      this.autoRoleButtonCollection.delete(buttonData);
    } else {
      const buttonBuilder = this.autoRoleButtonCollection.get(buttonData.customId);
      if (!buttonBuilder) return false;
      this.autoRoleButtonCollection.delete(buttonData.customId);
    }

    return true;
  }

  async executeButtonInteraction(interaction: ButtonInteraction) {
    interaction.deferred ? "" : await interaction.deferReply({ ephemeral: true });

    const roleId = interaction.customId.split("_")[2];
    const role = await interaction.guild?.roles.fetch(roleId);
    const member = await interaction.guild?.members.fetch(interaction.user.id);

    if (!role)
      throw new ClientError(
        `Can't find the ${roleId ? `role with id: ${roleId}` : `undefined role id`}`,
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
            title: `Bấm cái quần què <:Cat_DuaTaoDayA:1173959894941057074> !`,
            description: `**Bạn đã có role ${role.toString()} rồi !**`,
            color: Colors.Purple,
          }),
        ],
      });
    } else {
      await member.roles.add(role);
      await interaction.editReply({
        embeds: [
          new EmbedBuilder({
            title: `Thao tác thành công !`,
            description: `Đã thêm role ${role.toString()} cho ${interaction.member?.toString()}`,
            color: Colors.Green,
          }),
        ],
      });
    }
  }

  async previewButton(interaction: ChatInputCommandInteraction, buttonData: ButtonBuilder) {
    const actionRow = craftActionRowButtonComponents([buttonData]);
    await interaction.editReply({ content: "Done! Preview:", components: [actionRow] });
  }

  getButtonOptionsForAutocompleteInteraction() {
    const list: Array<APIEmbedField> = [];
    this.autoRoleButtonCollection.forEach((buttonBuilder, buttonId) => {
      list.push({ name: buttonId.split("_").at(3) ?? "button", value: buttonId });
    });
    return list;
  }
}

export default GuildAutoRoleManager;
