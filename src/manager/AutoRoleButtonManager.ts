import { Collection, Guild } from "discord.js";
import SuwaClient from "../bot";
import { Logger } from "../utils/Logger";
import GuildAutoroleManager from "./GuildAutoroleManager";
import { GuildAutoroleConfig } from "../structures/interface/autorole";

class GetRoleButtonManager {
  private readonly client: SuwaClient;
  private readonly logger: Logger;

  public guildGetRoleButtonManagerCollection: Collection<string, GuildAutoroleManager>;

  constructor(client: SuwaClient) {
    this.client = client;
    this.logger = new Logger("button-role-manager", client.logSystem);
    this.guildGetRoleButtonManagerCollection = new Collection<string, GuildAutoroleManager>();
  }

  createGuildManager(guild: Guild): GuildAutoroleManager {
    const manager = new GuildAutoroleManager(guild);
    this.guildGetRoleButtonManagerCollection.set(guild.id, manager);
    return manager;
  }

  /**
   * Return a GuildAutoroleManager, if not existed, create new one
   */
  callGuildManager(guild: Guild): GuildAutoroleManager {
    const manager = this.guildGetRoleButtonManagerCollection.get(guild.id);
    if (!manager) return this.createGuildManager(guild);
    else return manager;
  }

  updateGuildManager(guild: Guild, manager: GuildAutoroleManager): GuildAutoroleManager {
    this.guildGetRoleButtonManagerCollection.set(guild.id, manager);
    return manager;
  }
}

const mockData: Array<GuildAutoroleConfig> = [
  {
    guildId: "811939594882777128",
    autoroleMessagesContent: new Collection(),
    autoroleButtonsData: new Collection(),
  },
  {
    guildId: "1165708698723823697",
    autoroleMessagesContent: new Collection(),
    autoroleButtonsData: new Collection(),
  },
  {
    guildId: "1084323144870940772",
    autoroleMessagesContent: new Collection(),
    autoroleButtonsData: new Collection(),
  },
];

export default GetRoleButtonManager;

class GuildAutoroleManager {
  constructor() {
    
  }
}