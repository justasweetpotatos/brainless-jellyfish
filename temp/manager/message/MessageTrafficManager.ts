import { Collection, Guild, Message } from "discord.js";
import SuwaClient from "../../bot";
import MessageTrafficTracker from "./MessageTrafficTracker";

export default class MessageTrafficManager {
  private client: SuwaClient;
  private trackerCollection: Collection<string, MessageTrafficTracker> = new Collection<string, MessageTrafficTracker>();

  constructor(client: SuwaClient) {
    this.client = client;
  }

  async loadServerData(client: SuwaClient) {
    const guilds = client.guilds.cache;
    guilds.forEach(async (guild) => {
      this.trackerCollection.set(guild.id, new MessageTrafficTracker(guild));
    });
  }

  async onMessage(message: Message) {
    if (message.guildId) {
      const guildTracker = this.trackerCollection.get(message.guildId);
      if (guildTracker && guildTracker.isActive) {
        guildTracker.onMessage(message);
        this.trackerCollection.set(message.guildId, guildTracker);
      }
    }
  }

  async onGuildCreate(guild: Guild) {
    if (!this.trackerCollection.get(guild.id)) {
      this.trackerCollection.set(guild.id, new MessageTrafficTracker(guild, false));
    }
  }
}
