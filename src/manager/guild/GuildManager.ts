import { Collection } from "discord.js";
import SuwaClient from "../../bot";

interface GuildConfig {
  id: string;
  name: string;
  config: {};
}

class ClientGuildManager {
  private client: SuwaClient;
  private guilds: Collection<string, GuildConfig>;

  constructor(client: SuwaClient) {
    this.client = client;
    this.guilds = new Collection();
  }

  async fetchAllGuildJoined() {
    const response = this.client.guilds.cache;

    response.forEach((guildData) => {
      this.guilds.set(guildData.id, {
        id: guildData.id,
        name: guildData.name,
        config: {},
      });
    });
  }
}

export default ClientGuildManager;
