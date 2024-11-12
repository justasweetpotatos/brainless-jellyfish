import { Client, GatewayIntentBits, REST, version } from "discord.js";
import { Logger, LogPrinter } from "../utils/Logger";
import Connector from "../database/connector";
import { ModuleManager } from "./ModuleManager";
import EventHandler from "../handler/EventHandler";
import { ErrorHandlerModule } from "../modules/ErrorHandlerModule";

export type ClientRunMode = "normal" | "debug";

export default class SuwaBot extends Client {
  public readonly name: string = "Suwa_Client";
  public readonly botId: string;
  public readonly logger: Logger;
  public readonly logPrinter: LogPrinter;
  public connector: Connector;
  public startedTimestamp: number = 0;

  public clientRunMode: ClientRunMode;
  public readonly moduleManager: ModuleManager;
  public readonly errorHandlerModule: ErrorHandlerModule;

  public readonly eventHandler: EventHandler;

  constructor(botId: string) {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ],
    });

    this.botId = botId;

    this.logPrinter = new LogPrinter(this);
    this.logger = new Logger("main", this.logPrinter);
    this.connector = new Connector();
    this.clientRunMode = "debug";
    this.moduleManager = new ModuleManager(this);
    this.errorHandlerModule = new ErrorHandlerModule({ client: this, name: "error-handler" });

    this.eventHandler = new EventHandler(this);

    this.on("ready", () => this.onClientReady());
  }

  async start(token: string) {
    this.startedTimestamp = Date.now();
    if (!token) {
      this.logger.info("Token is empty !");
      this.logger.warn("Shutdown bot...");
      process.exit(0);
    }

    // Show infomation
    this.logger.info("Startup");
    this.displayStatus();

    // Create and load rest
    this.rest = new REST({ version: "10" }).setToken(token);
    this.logger.success("REST created! Version is 10.");

    // Modules Loading data
    await this.loadPreferences();

    // Login
    this.logger.info("Loggin...");
    await this.login(token);

    this.connector.createPromisePool();

    this.moduleManager.createEventListeners();
    await this.moduleManager.activateAllModule();
  }

  onClientReady() {
    this.readyTimestamp = Date.now();
    this.moduleManager.commandModule.registerCommands();
    this.logger.success(
      `Bot has ready, start up took ${(this.readyTimestamp - this.startedTimestamp) / 1000} seconds`
    );
  }

  async loadPreferences() {
    this.eventHandler.loadEvents();
  }

  async commandLineReader() {}

  displayStatus(): void {
    this.logger.log(`Client Info: 
      > Client Name: ${this.name}
      > Client Version: BETA-5.0.0
      > Discord JS version: ${version}
      > REST Version: 10
      > Number of server joined: `);
  }
}
