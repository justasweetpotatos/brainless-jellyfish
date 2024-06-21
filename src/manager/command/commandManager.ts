import { Collection, CommandInteraction, Routes } from "discord.js";

import SuwaClient from "../../bot";
import CommandLoader from "./CommandLoader";
import Logger from "../../utils/Logger";

interface GuildConfig {
  id: string;
  name: string;
  config: {};
}

class CommandManager {
  private client: SuwaClient;
  private logger: Logger;

  private commandLoader: CommandLoader;

  private guilds: Collection<string, GuildConfig> = new Collection();

  constructor(client: SuwaClient) {
    this.client = client;
    this.logger = new Logger("CommandManager", client.loggerFilePath);

    this.commandLoader = new CommandLoader(this.client);
  }

  async initialize() {
    this.logger.log("Start refreshing application (/) commands...");

    await this.commandLoader.loadAllCommands();
    await this.refreshGuildCommands();

    this.logger.success("Successfully refreshing appplication (/) commands !");
  }

  async reloadCommand(commandName: string) {
    try {
      this.logger.log(`Start reloading command named "${commandName}"...`);
      await this.commandLoader.reloadCommand(commandName);
      this.logger.success(`Finished reloading command name "${commandName}"!`);
    } catch (error) {
      this.logger.error(`${error instanceof Error ? `${error.message}\n${error.stack}` : ""}`);
    }
  }

  async executeCommand(interaction: CommandInteraction) {
    const executorData = this.commandLoader.executors.get(interaction.commandName);

    if (!executorData) throw new Error("No executor for this function!");
    else await executorData?.execute(interaction, this.client);
  }

  async refreshGuildCommands() {
    const response = this.client.guilds.cache;

    response.forEach((guildData) => {
      this.guilds.set(guildData.id, {
        id: guildData.id,
        name: guildData.name,
        config: {},
      });

      this.client.rest.put(Routes.applicationGuildCommands(this.client.clientId, guildData.id), {
        body: this.commandLoader.commandsToJson(),
      });
    });
  }
}

export default CommandManager;
