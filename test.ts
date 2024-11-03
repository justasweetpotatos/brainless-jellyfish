import { Collection, Message } from "discord.js";

interface MessageDataMTF {
  readonly id: string;
  readonly createdTimestamp: number;
}

interface UserDataMTF {
  readonly id: string;
  messages: Array<MessageDataMTF>;
}

interface GuildDataNodeMTF {
  readonly timerBySeconds: number;
  counter: number;
  userData: Map<string, UserDataMTF>;
}

interface GuildDataMTF {
  readonly id: string;
  nodeMap: Map<number, GuildDataNodeMTF>;
  lastNode: GuildDataNodeMTF;
}

class MTFManager {
  readonly guildDataCollection: Collection<string, GuildDataMTF> = new Collection();
  private nowBySeconds = Math.floor(Date.now() / 1000);

  constructor() {}

  // private isGuildHaveExistedData(guildId: string) {
  //   return this.guildDataCollection.get(guildId);
  // }

  private createNewGuildMTFNode(message?: Message): GuildDataNodeMTF {
    const guildDataNodeMTF: GuildDataNodeMTF = {
      timerBySeconds: this.nowBySeconds,
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

  private createNewGuildMTF(initMessage: Message<true>) {
    return {
      id: initMessage.guildId,
      lastNode: this.createNewGuildMTFNode(initMessage),
      nodeMap: new Map(),
    };
  }

  onMessageCreateEventReceived(message: Message) {
    if (!message.inGuild()) return;
    const nowBySeconds = Math.floor(Date.now() / 1000);
    let guilData = this.guildDataCollection.get(message.guildId);
    if (!guilData) {
      this.guildDataCollection.set(message.guildId, this.createNewGuildMTF(message));
    } else if (guilData.lastNode.timerBySeconds !== nowBySeconds) {
      guilData.nodeMap.set(nowBySeconds, guilData.lastNode);
      guilData.lastNode = this.createNewGuildMTFNode(message);
    } else {
      this.pushMessageToNode(guilData.lastNode, message);
    }
  }
}
