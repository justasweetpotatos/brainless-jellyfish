import {
  CommandInteraction,
  ChatInputCommandInteraction,
  ButtonInteraction,
  AutocompleteInteraction,
  Message,
  Collection,
  EmbedBuilder,
} from "discord.js";
import { BotModule } from "./BotModule";
import { BotModuleOptions } from "./interface/module";
import dictionary = require("./moduleData/EnglishDictionary_src-unknow.json");

interface ConnectingWordChannelConfig {
  channelId: string;

  lastUserId?: string;
  lastWord?: string;
  limit?: number;
  usedWordList?: Collection<string, number>;

  gamemodeRepeated: boolean;
  gamemodeNoLimit: boolean;
}

interface ConnectingWordGuildData {
  guildId: string;
  activate: boolean;
  ignoredPrefix?: string;
  maxChannel?: number;
  notificationMessageDeleteTimeout?: number;
  channelConfigCollection: Collection<string, ConnectingWordChannelConfig>;
}

interface Dictionary {
  [key: string]: number;
}

export default class ConnectingWordGameModule extends BotModule {
  public readonly guildDataCollection: Collection<string, ConnectingWordGuildData>;
  public readonly dictionary: Dictionary;

  constructor(options: BotModuleOptions) {
    super(options);

    this.guildDataCollection = new Collection();
    this.dictionary = dictionary as Dictionary;
  }

  async pushInteraction(
    interaction: CommandInteraction | ChatInputCommandInteraction | ButtonInteraction | AutocompleteInteraction
  ): Promise<void> {
    return;
  }

  async pushMessage(message: Message<true>): Promise<void> {
    if (!this.guildDataCollection.get(message.guildId ?? "")) {
      this.guildDataCollection.set(message.guildId, {
        activate: false,
        ignoredPrefix: ">",
        channelConfigCollection: new Collection(),
        guildId: message.guildId,
        maxChannel: 1,
      });
      return;
    } else await this.processMessage(message);
  }

  async pushGuildEvent(): Promise<void> {
    return;
  }

  async pushMemberEvent(): Promise<void> {
    return;
  }

  async processMessage(message: Message) {
    const guildData = this.guildDataCollection.get(message.guildId ?? "");
    if (!guildData) return;

    if (message.content.startsWith(guildData.ignoredPrefix ?? ">")) return;

    const channelConfig = guildData.channelConfigCollection.get(message.channelId);
    if (!channelConfig) return;

    const embed = new EmbedBuilder();
    let replyMessage: Message;

    const autoDeleteReplyMessage = (msg: Message) => {
      setTimeout(async () => {
        msg.deletable ? await msg.delete() : undefined;
      }, 5000);
    };

    if (!channelConfig.gamemodeRepeated || message.content.toLowerCase() === channelConfig.lastWord) {
      embed.setTitle("Đã có người dùng từ này trước đó").setDescription("Vui lòng thử lại !").setColor("Yellow");
      replyMessage = await message.reply({ embeds: [embed] });
      await message.react("❌");
      autoDeleteReplyMessage(replyMessage);
      return;
    }

    if (message.author.id === channelConfig.lastUserId) {
      embed
        .setTitle("Bạn đã chơi trước đó")
        .setDescription("Hãy chờ đến hết lượt của người tiếp theo !")
        .setColor("Yellow");
      await message.react("❌");
      replyMessage = await message.reply({ embeds: [embed] });
      autoDeleteReplyMessage(replyMessage);
      return;
    }

    if (!channelConfig.lastWord?.endsWith(message.content.toLowerCase().at(0) ?? "")) {
      embed
        .setTitle(`Từ phải bắt đầu bằng "${channelConfig.lastWord?.at(channelConfig.lastWord?.length - 1)}"`)
        .setDescription("Hãy dùng từ khác")
        .setColor("Yellow");
      await message.react("❌");
      replyMessage = await message.reply({ embeds: [embed] });
      autoDeleteReplyMessage(replyMessage);
      return;
    }

    if (!this.dictionary[message.content.toLowerCase()]) {
      embed.setTitle(`Từ này không có trong từ điển của bot`).setDescription("Hãy dùng từ khác !").setColor("Yellow");
      await message.react("❌");
      replyMessage = await message.reply({ embeds: [embed] });
      autoDeleteReplyMessage(replyMessage);
      return;
    }

    // all checked, send reaction
    await message.react("✅");
    channelConfig.lastUserId = message.author.id;
    channelConfig.lastWord = message.content;
    if (channelConfig.usedWordList) {
      const wordData = channelConfig.usedWordList.get(message.content);
      if (wordData) channelConfig.usedWordList.set(message.content, wordData + 1);
      else channelConfig.usedWordList.set(message.content, 1);
    }

    guildData.channelConfigCollection.set(message.channelId, channelConfig);
    this.guildDataCollection.set(guildData.guildId, guildData);
    return;
  }
}
