import {
  RESTGetAPIApplicationGuildCommandsResult,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
} from "discord.js";

import SuwaClient from "../bot";
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
    const defaultGuild = this.client.guilds.cache.get("811939594882777128");
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

  async reloadCommands() {
    this.client.commandHandler.loadCommands();
    const defaultGuild = this.client.guilds.cache.get("811939594882777128");
    if (defaultGuild) {
      const route = Routes.applicationGuildCommands(this.client.clientId, defaultGuild.id);

      // Lấy danh sách các lệnh hiện tại
      const currentCommands = (await this.client.rest.get(route)) as RESTGetAPIApplicationGuildCommandsResult;

      // Xóa từng lệnh hiện tại
      const deletePromises = currentCommands.map(async (command) => {
        await this.client.rest.delete(`${route}/${command.id}`);
        this.logger.log(`Remove command: ${command.name}`);
      });

      await Promise.all(deletePromises);

      // Đăng ký lại các lệnh
      const jsonBody: Array<any> = [];
      this.client.commandHandler.commandCollection.forEach((slashCommandBuilder) => {
        jsonBody.push(slashCommandBuilder.toJSON());
      });

      await this.client.rest.put(route, { body: jsonBody });

      this.logger.success(`Reloaded commands for guild: ${defaultGuild.name}-${defaultGuild.id}`);
    }
  }
}

export default CommandManager;
