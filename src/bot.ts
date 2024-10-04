import { Client, CommandInteraction, GatewayIntentBits, version } from "discord.js";

import { Logger, LogToFileSystem } from "./utils/Logger";
import ConnectionManager from "./manager/connectorManager";
import CommandManager from "./manager/commandManager";
import ClientGuildManager from "./manager/guild/GuildManager";
import { ClientErrorHandler } from "./utils/error/ClientErrorHandler";
import CommandHandler from "./handler/CommandHandler";
import ComponentManager from "./manager/ComponentManager";
import InteractionHandler from "./handler/InteractionHandler";
import ComponentHandler from "./handler/ComponentHandler";
import EventHandler from "./handler/EventHandler";

class SuwaClient extends Client {
  public clientName: string = "Suwa_Client";
  public clientId: string;
  // public connManager: ConnectionManager;
  // public comManager: CommandManager;
  // public clientGuildManager: ClientGuildManager;
  public errorHandler: ClientErrorHandler;
  public eventHandler: EventHandler;
  public componentHandler: ComponentHandler;
  public componentManager: ComponentManager;
  public interactionHandler: InteractionHandler;
  public commandHandler: CommandHandler;

  public readonly clientMode: string = "debug";

  public logger: Logger;
  public logSystem: LogToFileSystem;

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

    this.logSystem = new LogToFileSystem(this);
    this.logger = new Logger("Client", this.logSystem);
    this.errorHandler = new ClientErrorHandler(this);
    this.eventHandler = new EventHandler(this);
    this.interactionHandler = new InteractionHandler(this);
    this.commandHandler = new CommandHandler(this);
    this.componentManager = new ComponentManager(this);
    this.componentHandler = new ComponentHandler(this);
  }

  displayInfo(): void {
    this.logger.log(`Client Info: 
      > Client Name: ${this.clientName}
      > Client Version: 
      > Discord JS version: ${version}
      > REST Version: 10
      > Number of server joined: `);
  }

  async start(token: string) {
    this.logger.info("Startup...");

    // await this.connectDb();
    // await this.comManager.initialize();
    this.componentManager.loadComponents();
    this.eventHandler.loadEvents();
    this.commandHandler.loadCommands();

    await this.login(token);
    this.logger.success("Client is ready!");
  }

  async connectDb() {
    try {
      this.logger.log("Initialization root connect to database...");
      // this.connManager.createRootConnection();
      this.logger.log("Database connection good! Continue.");
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
