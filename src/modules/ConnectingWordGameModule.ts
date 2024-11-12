import {
  CommandInteraction,
  ChatInputCommandInteraction,
  ButtonInteraction,
  AutocompleteInteraction,
  Message,
  Collection,
  EmbedBuilder,
  Colors,
} from "discord.js";
import { BotModule } from "../structure/BotModule";
import { BotModuleOptions } from "../structure/interface/module";
import dictionary = require("../structure/moduleData/EnglishDictionary_src-unknow.json");
import { ConnectingWordGameGuildConfigRepository } from "../database/repositories/ConnectingWordGameGuildConfigRepository";
import { ConnectingWordGameGuildConfig } from "../database/models/ConnectingWordGameGuildConfig";
import { ConnectingWordGameChannelConfigRepository } from "../database/repositories/ConnectingWordGameChannelConfigRepository";
import { ConnectingWordChannelConfig } from "../database/models/ConnectingWordGameChannelConfig";

interface Dictionary {
  [startChar: string]: {
    [word: string]: { source: string } | number;
  };
}

export default class ConnectingWordGameModule extends BotModule<BotModuleOptions> {
  public readonly guildDataCollection: Collection<string, ConnectingWordGameGuildConfig>;
  public readonly channelDataCollection: Collection<string, ConnectingWordChannelConfig>;
  public readonly dictionary: Dictionary;
  private readonly guildRepository: ConnectingWordGameGuildConfigRepository;
  private readonly channelRepository: ConnectingWordGameChannelConfigRepository;

  constructor(options: BotModuleOptions) {
    super(options);

    this.guildDataCollection = new Collection();
    this.channelDataCollection = new Collection();
    this.dictionary = dictionary as Dictionary;
    this.channelRepository = new ConnectingWordGameChannelConfigRepository();
    this.guildRepository = new ConnectingWordGameGuildConfigRepository();

    this.pushBeforeActivateFunction(this.caching);
  }

  async caching() {
    this.logger.info("Start caching...");
    this.guildRepository.usePool(this.client.connector.pool);
    this.channelRepository.usePool(this.client.connector.pool);
    (await this.guildRepository.getAll()).forEach((config) =>
      this.guildDataCollection.set(config.guildId, config)
    );
    (await this.channelRepository.getAll()).forEach((config) =>
      this.channelDataCollection.set(config.channelId, config)
    );
    this.logger.success(
      `Cached total: ${this.guildDataCollection.size + this.channelDataCollection.size} data packs!`
    );
  }

  async pushInteraction(
    interaction:
      | CommandInteraction
      | ChatInputCommandInteraction
      | ButtonInteraction
      | AutocompleteInteraction
  ): Promise<void> {
    return;
  }

  async pushMessageEvent(message: Message<true>): Promise<void> {
    if (message.author.bot) return;
    if (!this.guildDataCollection.get(message.guildId)) {
      this.guildDataCollection.set(message.guildId, new ConnectingWordGameGuildConfig(message.guildId));
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
    const channelConfig = this.channelDataCollection.get(message.channelId);
    if (!channelConfig) return;

    const content = message.content.toLowerCase();

    if (this.isPrefix(content, channelConfig)) {
      return;
    }

    const embed = new EmbedBuilder();
    let replyMessage: Message;

    const autoDeleteReplyMessage = (msg: Message) => {
      setTimeout(async () => {
        msg.deletable ? await msg.delete() : undefined;
      }, channelConfig.notificationMessageTimeAlive);
    };

    if (this.isLastUser(message.author.id, channelConfig)) {
      embed
        .setTitle("Bạn đã chơi trước đó")
        .setDescription("> **Hãy chờ đến hết lượt của người tiếp theo !**")
        .setColor("Yellow");
      await message.react("❌");
      replyMessage = await message.reply({ embeds: [embed] });
      autoDeleteReplyMessage(replyMessage);
      return;
    }

    if (!this.checkStartChar(content, channelConfig)) {
      embed
        .setDescription(
          `> **Bạn phải dùng từ bắt đầu bằng ${channelConfig.lastWord?.charAt(
            channelConfig.lastWord.length - 1
          )}** `
        )
        .setColor("Yellow");
      replyMessage = await message.reply({ embeds: [embed] });
      await message.react("❌");
      autoDeleteReplyMessage(replyMessage);
      return;
    }

    if (this.isRepeatedWord(content, channelConfig)) {
      embed
        .setTitle("Đã có người dùng từ này trước đó")
        .setDescription("Vui lòng thử lại !")
        .setColor("Yellow");
      replyMessage = await message.reply({ embeds: [embed] });
      await message.react("❌");
      autoDeleteReplyMessage(replyMessage);
      return;
    }

    if (!this.checkDictionary(content)) {
      embed
        .setTitle(`Từ này không có trong từ điển của bot`)
        .setDescription("Hãy dùng từ khác !")
        .setColor("Yellow");
      await message.react("❌");
      replyMessage = await message.reply({ embeds: [embed] });
      autoDeleteReplyMessage(replyMessage);
      return;
    }

    // all checked, send reaction
    await message.react("✅");
    channelConfig.lastUserId = message.author.id;
    channelConfig.lastWord = message.content;
    channelConfig.counter += 1;
    if (channelConfig.usedWordList) {
      if (!channelConfig.usedWordList[message.content.charAt(0)])
        channelConfig.usedWordList[message.content.charAt(0)] = {};
      channelConfig.usedWordList[message.content.charAt(0)][message.content] = { source: "any" };
    }

    if (this.isReachedLimit(channelConfig)) {
      channelConfig.lastUserId = undefined;
      channelConfig.lastWord = undefined;
      channelConfig.counter = 0;

      embed
        .setColor("Green")
        .setTitle(`> *Đã chạm giới hạn: \`${channelConfig.counter}\` từ !*`)
        .setDescription(`*Reseted game !*`);
      replyMessage = await message.reply({ embeds: [embed] });
    } else if (!this.checkCanContinue(content, channelConfig)) {
      channelConfig.lastWord = undefined;
      channelConfig.usedWordList = {};
      channelConfig.counter = 0;
      embed
        .setTitle(`Không còn từ có thể nối tiếp !`)
        .setDescription(`*Hãy bắt đầu bằng một từ mới*`)
        .setColor(Colors.Yellow);
      replyMessage = await message.reply({ embeds: [embed] });
    }

    if (channelConfig.requireDatabaseSync) {
      await this.channelRepository.update(channelConfig.channelId, channelConfig.toJSON());
      channelConfig.requireDatabaseSync = false;
      channelConfig.resetCachingCounter();
    }

    return;
  }

  private isPrefix(content: string, config: ConnectingWordChannelConfig): boolean {
    if (content.startsWith(">") || content.startsWith(":")) {
      return true;
    }
    return false;
  }

  private checkStartChar(content: string, config: ConnectingWordChannelConfig): boolean {
    return content.charAt(0) === config.lastWord?.charAt(config.lastWord.length - 1);
  }

  private checkDictionary(content: string): boolean {
    if (this.dictionary[content.charAt(0)][content]) {
      return true;
    }
    return false;
  }

  private isLastUser(userId: string, config: ConnectingWordChannelConfig): boolean {
    if (config.repeated) {
      return false;
    } else {
      return userId === config.lastUserId;
    }
  }

  private isRepeatedWord(content: string, config: ConnectingWordChannelConfig): boolean {
    if (config.duplicate) {
      return false;
    }

    if (config.usedWordList && config.usedWordList[content.charAt(0)]) {
      if (config.usedWordList[content.charAt(0)][content]) {
        return true;
      }
    }

    return false;
  }

  private isReachedLimit(config: ConnectingWordChannelConfig): boolean {
    if (config.counter === config.limit) {
      return true;
    }
    return false;
  }

  private checkCanContinue(content: string, config: ConnectingWordChannelConfig): boolean {
    if (!config.usedWordList) {
      return true;
    }
    const sizeD = Object.keys(config.usedWordList[content.charAt(0)]).length;
    const sizeL = this.dictionary[content.charAt(0)].data_counter;

    if ((sizeL as number) <= sizeD) {
      return false;
    }
    return true;
  }
}
