import { Guild } from "discord.js";
import GuildAutoroleManager from "../manager/GuildAutoroleManager";



class ClientGuild {
  public readonly guild: Guild;

  // modules
  public readonly autoroleManager: GuildAutoroleManager;

  // constructor
  constructor(guild: Guild) {
    this.guild = guild;
    this.autoroleManager = new GuildAutoroleManager(guild);
  }

  async syncData() {

  }
}
