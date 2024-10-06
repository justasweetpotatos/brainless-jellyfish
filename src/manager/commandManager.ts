import {
  Collection,
  CommandInteraction,
  REST,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
} from "discord.js";

import SuwaClient from "../bot";
import CommandLoader from "./command/CommandLoader";
import { Logger } from "../utils/Logger";

interface GuildConfig {
  id: string;
  name: string;
  config: {};
}

class CommandManager {
  private readonly client: SuwaClient;
  private readonly logger: Logger;

  constructor(client: SuwaClient) {
    this.client = client;
    this.logger = new Logger("command-manager", client.logSystem);
  }

  async registerCommandForDefaultGuild() {
    const defaultGuild = this.client.guilds.cache.get("1165708698723823697");
    if (defaultGuild) {
      const route = Routes.applicationGuildCommands(this.client.clientId, defaultGuild.id);
      const jsonBody: Array<RESTPostAPIChatInputApplicationCommandsJSONBody> = [];
      this.client.commandHandler.commandCollection.forEach((slashCommadnBuilder) => {
        jsonBody.push(slashCommadnBuilder.toJSON());
      });
      await this.client.rest.put(route, { body: jsonBody });

      this.logger.success(`Registered command for guild default named: ${defaultGuild.name}-${defaultGuild.id}`);
    }
  }
}

export default CommandManager;
