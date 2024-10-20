import { Collection, Guild } from "discord.js";
import SuwaClient from "../bot";
import { Logger } from "../utils/Logger";
import GuildAutoRoleManager from "./GuildAutoRoleButtonManager";

class AutoroleButtonManager {
  private readonly client: SuwaClient;
  private readonly logger: Logger;

  public guildAutoroleButtonManagerCollection: Collection<
    string,
    GuildAutoRoleManager
  >;

  constructor(client: SuwaClient) {
    this.client = client;
    this.logger = new Logger("button-role-manager", client.logSystem);
    this.guildAutoroleButtonManagerCollection = new Collection<
      string,
      GuildAutoRoleManager
    >();
  }

  createGuildManager(guild: Guild): GuildAutoRoleManager {
    const manager = new GuildAutoRoleManager(guild);
    this.guildAutoroleButtonManagerCollection.set(guild.id, manager);
    return manager;
  }

  /**
   * Return a GuildAutoRoleManager, if not existed, create new one
   */
  callGuildManager(guild: Guild): GuildAutoRoleManager {
    const manager = this.guildAutoroleButtonManagerCollection.get(guild.id);
    if (!manager) return this.createGuildManager(guild);
    else return manager;
  }

  updateGuildManager(
    guild: Guild,
    manager: GuildAutoRoleManager
  ): GuildAutoRoleManager {
    this.guildAutoroleButtonManagerCollection.set(guild.id, manager);
    return manager;
  }
}

export default AutoroleButtonManager;
