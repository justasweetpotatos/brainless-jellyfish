import { Client, Collection, GatewayIntentBits, REST, version } from "discord.js";
import { Logger, LogPrinter } from "../utils/Logger";
import Connector from "../database/Connector";
import ConnectingWordGameModule from "../structure/ConnectingWordGameModule";
import { BotModule } from "../structure/BotModule";

export type ClientRunMode = "normal" | "debug";

export default class SuwaBot extends Client {
  public readonly name: string = "Suwa_Client";
  public readonly botId: string;
  public readonly logger: Logger;
  public readonly logPrinter: LogPrinter;
  public connector: Connector;

  public clientRunMode: ClientRunMode;

  public readonly moduleCollection: Collection<string, BotModule>;
  
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
    this.connector = new Connector(this);
    this.clientRunMode = "debug";
    this.moduleCollection = new Collection();

  }

  async start(token?: string) {
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
    this.logger.success("Bot is ready!");
  }

  async loadDatabase() {
    this.logger.info("Loading database.");
    // this.connector =
  }

  async loadPreferences() {}

  displayStatus(): void {
    this.logger.log(`Client Info: 
      > Client Name: ${this.name}
      > Client Version: BETA-5.0.0
      > Discord JS version: ${version}
      > REST Version: 10
      > Number of server joined: `);
  }
}