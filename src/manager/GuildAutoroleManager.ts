import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChatInputCommandInteraction,
  Collection,
  Colors,
  CommandInteraction,
  EmbedBuilder,
  Guild,
  ModalBuilder,
  TextChannel,
  TextInputBuilder,
  TextInputStyle,
  VoiceChannel,
} from "discord.js";
import {
  autoDeferReply,
  craftActionRowButtonComponents,
  createEmbedWithTimestampAndCreateUser,
} from "../utils/functions";
import { AutoroleButtonContent, AutoroleMessageContent } from "../structures/interface/autorole";

class GuildAutoroleManager {
  public readonly guild: Guild;

  // Data
  public readonly buttonContentCollection: Collection<string, AutoroleButtonContent> = new Collection();
  public readonly messageContentCollection: Collection<string, AutoroleMessageContent> = new Collection();

  constructor(guild: Guild) {
    this.guild = guild;
  }

  async sendEditor(interaction: CommandInteraction | ButtonInteraction, messageId: string) {
    await autoDeferReply(interaction);
    const replyEmbed = createEmbedWithTimestampAndCreateUser(interaction);
    const messageContent = this.messageContentCollection.get(messageId);
    const buttonContentList = this.getButtonContentCollectionFromMessage(messageId);
    const buttonBuilderList = this.buttonContentToButtonBuilder(buttonContentList);
    const actionRowList: Array<ActionRowBuilder<ButtonBuilder>> = [];

    if (!messageContent) return;

    replyEmbed
      .setTitle(messageContent.title)
      .setDescription(messageContent.description)
      .setColor(messageContent.color)
      .setFooter({ text: "Autorole System - Editing" });

    buttonContentList.forEach((content, index) => {
      let btn = buttonBuilderList.at(index);
      if (!btn) return;
      let actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents([
        btn,
        new ButtonBuilder({
          customId: `autorole-edit-button_${content.customId}`,
          label: "Edit",
          style: ButtonStyle.Success,
        }),
      ]);
      actionRowList.push(actionRow);
    });

    await interaction.editReply({ embeds: [replyEmbed], components: actionRowList });
  }

  getButtonContentCollectionFromMessage(messageId: string) {
    const array: Array<AutoroleButtonContent> = [];
    const messageContent = this.messageContentCollection.get(messageId);
    if (!messageContent) return array;
    this.buttonContentCollection.forEach((content) => {
      if (content.customId.startsWith("autorole-button")) array.push(content);
    });
    return array;
  }

  buttonContentToButtonBuilder(contentCollection: Array<AutoroleButtonContent>) {
    const components: Array<ButtonBuilder> = [];
    contentCollection.forEach(async (content) => {
      components.push(
        new ButtonBuilder({
          customId: content.customId,
          label: content.label,
          style: content.style,
          emoji: content.emojiId ?? undefined,
        })
      );
    });

    return components;
  }

  async sendEditContentModal(messageId: string, interaction: CommandInteraction | ButtonInteraction) {
    const content = this.messageContentCollection.get(messageId);
    const replyEmbed = createEmbedWithTimestampAndCreateUser(interaction);

    // Return a error message
    if (!content) return;

    const titleInputCustomId = `autorole-edit-title_${content.id}`;
    const descriptionInputCustomId = `autorole-edit-description_${content.id}`;

    await interaction.showModal(this.createEditModal(content));

    await interaction.awaitModalSubmit({ time: 600_60 }).then(async (modalSubmitInteraction) => {
      await autoDeferReply(modalSubmitInteraction);

      if (!modalSubmitInteraction.customId.startsWith("autorole-edit-modal")) return;

      const title = modalSubmitInteraction.fields.getTextInputValue(titleInputCustomId);
      const description = modalSubmitInteraction.fields.getTextInputValue(descriptionInputCustomId);

      content.title = title;
      content.description = description;

      this.messageContentCollection.set(content.id, content);

      replyEmbed.setTitle("Action Conplete !").setColor("Green");

      await modalSubmitInteraction.editReply({ embeds: [replyEmbed] });
    });
  }

  createEditModal(oldContent: AutoroleMessageContent) {
    const modalBuilder = new ModalBuilder({
      title: "Edit Autorole Message",
      customId: "autorole-edit-modal",
    });

    const titleInput = new TextInputBuilder()
      .setLabel("Message title")
      .setPlaceholder("Content Here")
      .setCustomId(`autorole-edit-title_${oldContent.id}`)
      .setRequired(true)
      .setStyle(TextInputStyle.Short);

    const descriptionInput = new TextInputBuilder()
      .setLabel("Message description")
      .setPlaceholder("Content Here")
      .setCustomId(`autorole-edit-description_${oldContent.id}`)
      .setRequired(true)
      .setStyle(TextInputStyle.Paragraph);

    const actionRow1 = new ActionRowBuilder<TextInputBuilder>().addComponents(titleInput);
    const actionRow2 = new ActionRowBuilder<TextInputBuilder>().addComponents(descriptionInput);

    modalBuilder.addComponents([actionRow1, actionRow2]);

    return modalBuilder;
  }

  async createMessage(content: AutoroleMessageContent, channel: TextChannel | VoiceChannel) {
    const replyEmbed = new EmbedBuilder({ title: "Creating in progress, please waiting !", color: Colors.Blurple });
    const replyMessage = await channel.send({ embeds: [replyEmbed] });

    const actionRow = new ActionRowBuilder<ButtonBuilder>();
    content.buttonIdList.forEach((id) => {
      const buttonContent = this.buttonContentCollection.get(id);
      if (!buttonContent) return;
      const buttonBuilder = new ButtonBuilder({
        label: buttonContent.label,
        customId: buttonContent.customId,
        style: buttonContent.style,
        emoji: buttonContent.emojiId,
      });
      actionRow.addComponents(buttonBuilder);
    });

    const autoroleMessageEmbed = new EmbedBuilder()
      .setTitle(content.title)
      .setDescription(content.description)
      .setColor(content.color)
      .setFooter({
        text: "Autorole System",
      })
      .setTimestamp(Date.now());

    const message = await channel.send({ embeds: [autoroleMessageEmbed], components: [actionRow] });
    content.id = message.id;
    this.messageContentCollection.set(content.id, content);

    replyEmbed
      .setTitle("Action complete !")
      .setColor("Green")
      .setFooter({ text: `Duration: ${Math.floor(Date.now() - replyMessage.createdTimestamp)}` });
    await replyMessage.edit({ embeds: [replyEmbed] });

    setTimeout(async () => {
      replyMessage.editable ? await replyMessage.delete() : undefined;
    }, 5000);
  }

  async createButton(content: AutoroleButtonContent) {
    content.id = Date.now().toString();
    content.customId = `autorole_${content.id}_${content.roleId}`;

    this.buttonContentCollection.set(content.id, content);
  }

  getButtonOptions(): Array<{ name: string; value: string }> {
    return this.buttonContentCollection.map((content) => {
      return { name: content.label, value: content.id };
    });
  }

  async previewButton(interaction: ChatInputCommandInteraction, buttonContent: AutoroleButtonContent) {
    const actionRow = craftActionRowButtonComponents([
      new ButtonBuilder({
        customId: `autorole-button-preview`,
        label: buttonContent.label,
        style: buttonContent.style,
        emoji: buttonContent.emojiId,
      }),
    ]);
    await interaction.editReply({ content: "Done! Preview:", components: [actionRow] });
  }
}

export default GuildAutoroleManager;
