import {
  Message,
  Interaction,
  Collection,
  AutocompleteInteraction,
  ButtonInteraction,
  ChatInputCommandInteraction,
  CommandInteraction,
} from "discord.js";
import { BotModule } from "../structure/BotModule";
import { BotModuleOptions, GuildDataMTF, GuildDataNodeMTF, UserDataMTF } from "../structure/interface/module";

interface MessageTrafficModuleOptions extends BotModuleOptions {}

class MessageTrafficModule extends BotModule<MessageTrafficModuleOptions> {
  readonly guildDataCollection: Collection<string, GuildDataMTF>;

  constructor(options: MessageTrafficModuleOptions) {
    super(options);

    this.guildDataCollection = new Collection();
  }

  logParameter() {
    try {
      const nodeMap = this.guildDataCollection.get("811939594882777128")?.nodeMap;
      if (!nodeMap) return;
      const lastNode = nodeMap.last();
      if (!lastNode) return;

      const nowBySeconds = Math.floor(Date.now() / 1000);
      const nowByMinutes = Math.floor(nowBySeconds / 60);

      // ${new Date(data.timeBySeconds*1000).toUTCString()}

      let counter = 0;

      nodeMap
        .sort((node1, node2) => node1.timeBySeconds - node2.timeBySeconds)
        .reverse()
        .every((node, nodeKey) => {
          if (node.timeByMinutes === nowByMinutes) {
            counter += node.counter;
            return true;
          } else {
            return false;
          }
        });

      this.logger.info(`At time ${nowByMinutes}: ${counter}`);
    } catch (error) {}
  }

  async pushInteraction(
    interaction:
      | Interaction
      | CommandInteraction
      | ChatInputCommandInteraction
      | ButtonInteraction
      | AutocompleteInteraction
  ): Promise<void> {
    return;
  }

  async pushMessageEvent(message: Message): Promise<void> {
    this.onMessageCreateEventReceived(message);
  }

  async pushGuildEvent(): Promise<void> {
    return;
  }

  async pushMemberEvent(): Promise<void> {
    return;
  }

  // private isGuildHaveExistedData(guildId: string) {
  //   return this.guildDataCollection.get(guildId);
  // }

  private createNewGuildMTFNode(message?: Message): GuildDataNodeMTF {
    const nowBySeconds = Math.floor(Date.now() / 1000);
    const nowByMinutes = Math.floor(nowBySeconds / 60);
    const nowByHours = Math.floor(nowByMinutes / 60);
    const guildDataNodeMTF: GuildDataNodeMTF = {
      timeBySeconds: nowBySeconds,
      timeByMinutes: nowByMinutes,
      timeByHours: nowByHours,
      counter: 1,
      userData: new Map<string, UserDataMTF>(),
    };

    if (!message) return guildDataNodeMTF;

    guildDataNodeMTF.userData.set(message.author.id, {
      id: message.author.id,
      messages: [
        {
          id: message.id,
          createdTimestamp: message.createdTimestamp,
        },
      ],
    });

    return guildDataNodeMTF;
  }

  private pushMessageToNode(node: GuildDataNodeMTF, message: Message<true>) {
    node.counter += 1;
    const userData = node.userData.get(message.author.id);
    if (userData) userData.messages.push({ id: message.id, createdTimestamp: message.createdTimestamp });
    else {
      node.userData.set(message.author.id, {
        id: message.author.id,
        messages: [
          {
            id: message.id,
            createdTimestamp: message.createdTimestamp,
          },
        ],
      });
    }
  }

  private createNewGuildMTF(initMessage: Message<true>): GuildDataMTF {
    return {
      id: initMessage.guildId,
      lastNode: this.createNewGuildMTFNode(initMessage),
      nodeMap: new Collection(),
    };
  }

  onMessageCreateEventReceived(message: Message) {
    if (!message.inGuild()) return;
    const nowBySeconds = Math.floor(Date.now() / 1000);
    const nowByMinutes = Math.floor(nowBySeconds / 60);
    const nowByHours = Math.floor(nowByMinutes / 60);

    let guilData = this.guildDataCollection.get(message.guildId);
    if (!guilData) {
      guilData = this.createNewGuildMTF(message);
      this.guildDataCollection.set(message.guildId, guilData);
    } else {
      if (guilData.lastNode.timeBySeconds !== nowBySeconds) {
        guilData.nodeMap.set(nowBySeconds, guilData.lastNode);
        guilData.lastNode = this.createNewGuildMTFNode(message);
      } else {
        this.pushMessageToNode(guilData.lastNode, message);
      }
    }
  }
}

export { MessageTrafficModule };
