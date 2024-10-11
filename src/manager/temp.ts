import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
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
import { autoDeferReply } from "../utils/functions";

declare type AutoroleButtonContent = {
  id: string;
  customId: string;
  roleId: string;
  style: ButtonStyle;
  label: string;
};

declare type AutoroleMessageContent = {
  id: string;
  channelId: string;
  buttonIdList: Array<string>;

  title: string;
  description: string;
  color: number;
};

class GuildAutoroleManager {
  public readonly guild: Guild;

  // Data
  public readonly buttonContentCollection: Collection<string, AutoroleButtonContent> = new Collection();
  public readonly messageContentCollection: Collection<string, AutoroleMessageContent> = new Collection();

  constructor(guild: Guild) {
    this.guild = guild;
  }

  async sendEditContentModal(messageId: string, interaction: CommandInteraction | ButtonInteraction) {
    const content = this.messageContentCollection.get(messageId);

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

      await modalSubmitInteraction.editReply({})
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
}

export default GuildAutoroleManager;
