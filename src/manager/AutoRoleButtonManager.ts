import { Collection, Guild } from "discord.js";
import SuwaClient from "../bot";
import { Logger } from "../utils/Logger";
import GuildAutoRoleManager from "./GuildAutoRoleButtonManager";

class GetRoleButtonManager {
  private readonly client: SuwaClient;
  private readonly logger: Logger;

  public guildGetRoleButtonManagerCollection: Collection<string, GuildAutoRoleManager>;

  constructor(client: SuwaClient) {
    this.client = client;
    this.logger = new Logger("button-role-manager", client.logSystem);
    this.guildGetRoleButtonManagerCollection = new Collection<string, GuildAutoRoleManager>();
  }

  createGuildManager(guild: Guild): GuildAutoRoleManager {
    const manager = new GuildAutoRoleManager(guild);
    this.guildGetRoleButtonManagerCollection.set(guild.id, manager);
    return manager;
  }

  /**
   * Return a GuildAutoRoleManager, if not existed, create new one
   */
  callGuildManager(guild: Guild): GuildAutoRoleManager {
    const manager = this.guildGetRoleButtonManagerCollection.get(guild.id);
    if (!manager) return this.createGuildManager(guild);
    else return manager;
  }

  updateGuildManager(guild: Guild, manager: GuildAutoRoleManager): GuildAutoRoleManager {
    this.guildGetRoleButtonManagerCollection.set(guild.id, manager);
    return manager;
  }
}

export default GetRoleButtonManager;
