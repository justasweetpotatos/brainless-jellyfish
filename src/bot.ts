import { Client, CommandInteraction, GatewayIntentBits, version } from "discord.js";

import Logger from "./utils/Logger";
import ConnectionManager from "./manager/connectorManager";
import CommandManager from "./manager/command/commandManager";
import ClientGuildManager from "./manager/guild/GuildManager";

class SuwaClient extends Client {
  public clientName: string = "Suwa_Client";
  public clientId: string;
  public connManager: ConnectionManager;
  public comManager: CommandManager;
  public clientGuildManager: ClientGuildManager;

  public logger: Logger;
  public loggerFilePath: string;

  constructor(clientId: string) {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ],
    });

    this.clientId = clientId;

    this.loggerFilePath = Logger.createLogFile();
    this.logger = new Logger("Client", this.loggerFilePath);

    this.connManager = new ConnectionManager(this);
    this.comManager = new CommandManager(this);
    this.clientGuildManager = new ClientGuildManager(this);
  }

  displayInfo(): void {
    this.logger.log(`Client Info: 
      > Client Name: ${this.clientName}
      > Client Version: 
      > Discord JS version: ${version}
      > REST Version: 10
      > Number of server joined: `);
  }

  async start(token?: string) {
    if (!token) {
      this.logger.warn("Token is empty! Pls give your bot token!");
      return;
    }
    this.logger.info("Startup...");

    await this.login(token);

    await this.connectDb();
    await this.comManager.initialize();

    this.on("interactionCreate", (interaction) => {
      if (interaction instanceof CommandInteraction) this.comManager.executeCommand(interaction);
    });

    this.logger.success("Client is ready!");
  }

  async connectDb() {
    try {
      await this.connManager.createMainConnection();
    } catch (error) {
      error instanceof Error
        ? this.logger.error(`Connect to database failed: ${error}`)
        : this.logger.error("Undefined error !");
      this.logger.warn("Stopping client...");
      process.exit(0);
    }
  }
}

export default SuwaClient;
