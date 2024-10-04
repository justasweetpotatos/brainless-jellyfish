import {
  ActionRow,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  TextBasedChannel,
  TextChannel,
  User,
} from "discord.js";
import { ConnectingWordChannelConfig } from "../../interfaces/ConnectingWords";
import { ConnectingWordMessageType } from "../../utils/enums/ConnectingWordMessageType";
import SuwaClient from "../../bot";
import { ClientError, ErrorCode } from "../../utils/error/ClientError";
import { craftActionRowButtonComponents } from "../../utils/functions";

const defaultConfig: ConnectingWordChannelConfig = {
  registered: false,
  repeatedList: [],
  allowRepeat: false,
  limitToReset: 100,
  wrongMessage: { content: "Từ này không tồn tại trong từ điển của bot !", authorId: "server" },
  wrongStartCharMessage: { content: "Bạn phải bắt đầu bằng chữ `<replace>` !", authorId: "server" },
  isLastUserMessage: { content: "Bạn đã chơi trước đó, vui lòng đợi !", authorId: "server" },
  isRepeatedMessage: { content: "từ `<replace>` đã có người khác sử dụng !", authorId: "server" },
};

const createSetChannelEmbed = (channelId: string) => {
  return new EmbedBuilder({
    title: `Kênh chưa được thiết lập, bạn có muốn thiết lập kênh <#${channelId}> không ?`,
    color: Colors.Yellow,
  });
};

class ConnectingWordChannelManager {
  public readonly id: string;
  public readonly guildId: string;

  public config: ConnectingWordChannelConfig;

  constructor(channel: TextChannel) {
    this.id = channel.id;
    this.guildId = channel.guildId;

    this.config = defaultConfig;
  }

  setMessage(author: User, type: ConnectingWordMessageType, content: string): boolean {
    switch (type) {
      case 1:
        if (!this.config.wrongMessage.content.includes(content)) {
          this.config.wrongMessage.content = content;
          this.config.wrongMessage.authorId = author.id;
        } else return false;
        break;
      case 2:
        if (!this.config.wrongStartCharMessage.content.includes(content)) {
          this.config.wrongStartCharMessage.content = content;
          this.config.wrongStartCharMessage.authorId = author.id;
        } else return false;
        break;
      case 3:
        if (!this.config.isLastUserMessage.content.includes(content)) {
          this.config.isLastUserMessage.content = content;
          this.config.isLastUserMessage.authorId = author.id;
        } else return false;
        break;
      case 4:
        if (!this.config.isRepeatedMessage.content.includes(content)) {
          this.config.isRepeatedMessage.content = content;
          this.config.isRepeatedMessage.authorId = author.id;
        } else return false;
        break;
      default:
        break;
    }
    return true;
  }

  async check(word: string) {}

  async sendSettingInterface(
    interaction: ChatInputCommandInteraction | ButtonInteraction,
    channel?: TextBasedChannel | TextChannel
  ) {
    interaction.deferred ?? (await interaction.deferReply({ fetchReply: true }));
    const client = interaction.client;
    if (channel && interaction.channel instanceof TextChannel) channel = channel;
    else throw new ClientError("No target channel.", ErrorCode.NO_TARGET_CHANNEL);
    if (client instanceof SuwaClient) {
      const setChannelButton = client.componentManager.getButtonData("connecting-word-set-channel-button");
      const setLimitButton = client.componentManager.getButtonData("");
      const setRepeatedButton = client.componentManager.getButtonData("");
      const resetButtonButton = client.componentManager.getButtonData("");
      const closebutton = client.componentManager.getButtonData("close-message-button");

      const embed = createSetChannelEmbed(interaction.channelId);
      const actionRow1 = craftActionRowButtonComponents([
        closebutton.data,
        setLimitButton.data,
        setRepeatedButton.data,
        resetButtonButton.data
      ]);

      await interaction.editReply({ embeds: [embed], components: [actionRow1] });
    }
  }

  createConfigEmbed(): EmbedBuilder {
    return new EmbedBuilder({
      title: `Cài đặt game nối chữ kênh <#${this.id}> :`,
      description: `
        ***Configuration:***
            Channel id: ${this.id}
            Last user: ${this.config.lastUserId?.length === 0 ? "none" : `<@${this.config.lastUserId}>`}
            Last word: ${this.config.lastWord ? this.config.lastWord : "none"}
            Max words: ${this.config.limitToReset}
            Repeated: ${this.config.allowRepeat ? "✅" : "❌"}

            ***Hướng dẫn:***
            **\`Remove      \`: Xóa thiết lập cho kênh chỉ định.**
            **\`Set Limit   \`: Đặt giới hạn reset (Khi đạt một số lượng từ nhất định sẽ tự động reset).**
            **\`Set Repeated\`: Cho phép lặp hoặc không.** 
            **\`Reset       \`: Reset.**
        `,
      color: Colors.Blurple,
      timestamp: Date.now(),
    });
  }
}

export { ConnectingWordChannelManager, ConnectingWordChannelConfig };
