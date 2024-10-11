import {
  ActionRowBuilder,
  APIEmbedField,
  ButtonBuilder,
  ButtonComponent,
  ButtonInteraction,
  ButtonStyle,
  ChatInputCommandInteraction,
  Collection,
  Colors,
  EmbedBuilder,
  Guild,
  Interaction,
  Message,
  Snowflake,
} from "discord.js";
import { AutoroleButtonData, ButtonData } from "../interfaces/ComponentData";
import {
  autoDeferReply,
  craftActionRowButtonComponents,
  createEmbedWithTimestampAndCreateUser,
} from "../utils/functions";
import { ClientError, ErrorCode } from "../utils/error/ClientError";
import { AutoRoleButtonCustomId } from "../utils/enums/button";

class GuildAutoroleManager {
  private readonly guild: Guild;

  public autoRoleButtonCollection: Collection<string, ButtonData>;

  constructor(guild: Guild) {
    this.guild = guild;
    this.autoRoleButtonCollection = new Collection<string, ButtonData>();
  }

  async setToMessage(message: Message, buttonId: string) {
    const buttonData = this.autoRoleButtonCollection.get(buttonId);
    if (buttonData) {
      const oldButton: Array<ButtonBuilder> = [];
      message.components.forEach((messageActionRow, index) => {
        if (index > 0) return;
        messageActionRow.components.forEach((component) => {
          if (
            component instanceof ButtonComponent &&
            component.customId?.startsWith(AutoRoleButtonCustomId.AUTOROLE_BUTTON)
          ) {
            oldButton.push(
              new ButtonBuilder({
                label: component.label ?? undefined,
                customId: component.customId,
                emoji: component.emoji ?? undefined,
                style: component.style,
              })
            );
          }
        });
      });
      oldButton.push(buttonData.data);

      const actionRow = craftActionRowButtonComponents(oldButton);
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

  paserButtonData(buttonComponent: ButtonComponent) {
    if (!buttonComponent.customId?.startsWith("autorole")) return undefined;
    const parts = buttonComponent.customId.split("_");
    return {
      type: parts[0],
      uniqueId: parts[1],
      customId: buttonComponent.customId,
      roleId: parts[2],

      label: parts[3],
      style: buttonComponent.style,
      emojiId: buttonComponent.emoji?.id,
    };
  }

  async executeButtonInteraction(interaction: ButtonInteraction) {
    await autoDeferReply(interaction, { ephemeral: true });

    const buttonRawData = this.paserButtonData(interaction.component as ButtonComponent);
    if (!buttonRawData) throw new ClientError(`Not autorole button !`, ErrorCode.EXECUTE_COMPONENT_INTERACTION_FAILED);

    const role = await interaction.guild?.roles.fetch(buttonRawData?.roleId);
    const member = await interaction.guild?.members.fetch(interaction.user.id);

    if (!role)
      throw new ClientError(
        `Can't find the ${buttonRawData.roleId ? `role with id: ${buttonRawData.roleId}` : `undefined role id`}`,
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

  async executeRemoveActionButtonInteraction(interaction: ButtonInteraction) {
    await autoDeferReply(interaction, { ephemeral: true });
    const replyEmbed = createEmbedWithTimestampAndCreateUser(interaction);
    const buttonRawData = this.paserButtonData(interaction.component as ButtonComponent);

    if (!buttonRawData) {
      return;
    }

    const actionRowBuilderList = this.craftRemovedEditionActionRowBuilder(interaction.message, buttonRawData.uniqueId);
    await interaction.message.edit({ components: actionRowBuilderList });
    replyEmbed.setTitle("Action Complete !").setColor("Green");
    await interaction.editReply({ embeds: [replyEmbed] });
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

  craftRemovedEditionActionRowBuilder(message: Message, buttonUniqueId: string) {
    const messageActionRowlist = message.components;
    const actionRowBuilderlist: Array<ActionRowBuilder<ButtonBuilder>> = [];

    messageActionRowlist.forEach((actionRow, index) => {
      const actionRowBuilder = new ActionRowBuilder<ButtonBuilder>();

      actionRow.components.forEach((component, componentIndex) => {
        if (componentIndex > 1) return;
        if (!(component instanceof ButtonComponent && component.customId)) return;
        const buttonRawData = this.paserButtonData(component);

        let disabled = component.data.disabled ?? false;
        if (component.customId.includes(buttonUniqueId)) disabled = !component.data.disabled;

        if (component.customId.includes(AutoRoleButtonCustomId.EDITING_BUTTON)) {
          actionRowBuilder.addComponents([
            new ButtonBuilder({
              customId: `${AutoRoleButtonCustomId.EDITING_BUTTON}_${buttonRawData?.uniqueId}_${buttonRawData?.emojiId}_${buttonRawData?.label}`,
              disabled: disabled,
              label: buttonRawData?.label,
              style: buttonRawData?.style,
              emoji: component.emoji ?? undefined,
            }),
            new ButtonBuilder({
              customId: `${AutoRoleButtonCustomId.REMOVING_BUTTON}_${buttonRawData?.uniqueId}`,
              label: disabled ? "Undo" : "Remove",
              style: disabled ? ButtonStyle.Primary : ButtonStyle.Danger,
            }),
          ]);
        }
      });
      if (actionRowBuilder.components.length != 0) actionRowBuilderlist.push(actionRowBuilder);
    });

    return actionRowBuilderlist;
  }

  craftActionRowBuilderListFromActionRowComponentList(message: Message, getOnlyAutoroleButton: boolean = false) {
    const messageActionRowlist = message.components;
    const actionRowBuilderlist: Array<ActionRowBuilder<ButtonBuilder>> = [];

    messageActionRowlist.forEach((actionRow) => {
      actionRow.components.forEach((component) => {
        if (
          component instanceof ButtonComponent &&
          getOnlyAutoroleButton &&
          component.customId?.startsWith(AutoRoleButtonCustomId.AUTOROLE_BUTTON)
        ) {
          const buttonRawData = this.paserButtonData(component);
          const actionRowBuilder = new ActionRowBuilder<ButtonBuilder>();
          actionRowBuilder.addComponents([
            new ButtonBuilder({
              customId: `${AutoRoleButtonCustomId.EDITING_BUTTON}_${buttonRawData?.uniqueId}_${buttonRawData?.roleId}_${buttonRawData?.label}`,
              label: buttonRawData?.label,
              style: buttonRawData?.style,
              emoji: component.emoji ?? undefined,
            }),
            new ButtonBuilder({
              customId: `${AutoRoleButtonCustomId.REMOVING_BUTTON}_${buttonRawData?.uniqueId}`,
              label: "Remove",
              style: ButtonStyle.Danger,
            }),
          ]);
          if (actionRowBuilder.components.length != 0) actionRowBuilderlist.push(actionRowBuilder);
        }
      });
    });

    return actionRowBuilderlist;
  }

  async sendMessageEditingInterface(interaction: ChatInputCommandInteraction, message: Message) {
    const interfaceEmbed = createEmbedWithTimestampAndCreateUser(interaction);
    const actionRowBuilderlist = this.craftActionRowBuilderListFromActionRowComponentList(message, true);

    interfaceEmbed.setTitle("Editing Message").setDescription(``).setColor("Blurple");

    if (actionRowBuilderlist.length == 0) {
      interfaceEmbed.setTitle("No component found !").setColor("Yellow");
      await interaction.editReply({ embeds: [interfaceEmbed] });
    } else await interaction.editReply({ embeds: [interfaceEmbed], components: actionRowBuilderlist });
  }
}

export default GuildAutoroleManager;

class GuildAutoroleManager_v2 {
  public readonly guild: Guild;
  public readonly autoRoleMessageCollection: Collection<string, Message> = new Collection();
  public readonly autoRoleButtonCollection: Collection<string, ButtonData> = new Collection();

  constructor(guild: Guild) {
    this.guild = guild;
  }

  async executeAutoroleAddRoleButtonInteraction(interaction: ButtonInteraction) {}

  async createMessage(interaction: ChatInputCommandInteraction, buttonBuilderList: Array<ButtonData>) {
    await autoDeferReply(interaction);
    const replyEmbed = createEmbedWithTimestampAndCreateUser(interaction);

    const autoroleMessageEmbed = new EmbedBuilder();
    const actionRowBuilder = new ActionRowBuilder<ButtonBuilder>();

    buttonBuilderList.forEach((buttonBuilder) => {
      const buttonBuilderData = GuildAutoroleManager_v2.paserButtonBuilderData(buttonBuilder);
      if (!buttonBuilderData) return;
      actionRowBuilder.setComponents(buttonBuilder.data);
    });
  }

  static paserButtonComponentData(buttonComponent: ButtonComponent): AutoroleButtonData | undefined {
    if (!buttonComponent.customId?.startsWith("autorole")) return undefined;
    const parts = buttonComponent.customId.split("_");
    return {
      typeId: parts[0],
      uniqueId: parts[1],
      customId: buttonComponent.customId,
      roleId: parts[2],

      label: parts[3],
      style: buttonComponent.style,
      emojiId: buttonComponent.emoji?.id,
    };
  }

  static paserButtonBuilderData(buttonData: ButtonData): AutoroleButtonData | undefined {
    if (!buttonData.customId.startsWith("autorole")) return;
    const parts = buttonData.customId.split("_");

    return {
      typeId: parts[0],
      uniqueId: parts[1],
      customId: buttonData.customId,
      roleId: parts[2],

      label: parts[3],
      style: buttonData.data.data.style,
    };
  }
}
