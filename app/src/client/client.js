const { Client, GatewayIntentBits, version, REST, Events } = require("discord.js");

const { Logger, LogToFileSystem } = require("../utils/logger");
const CommandHandler = require("../handler/comandHandler");
const EventHandler = require("../handler/eventHandler");
const { ErrorHandler } = require("../utils/error/errorHandler");
const InteractionHandler = require("../handler/interactionHandler");
const { SlashCommandManager } = require("../manager/commandManager");

const ClientStatus = {
  name: "SuwaClient",
  info: {
    client_version: "3.0.0",
    API_version: `discord.js ${version}`,
    rest: `Version 10`,
    count_of_joined_server: 0,
  },
  latency: 0,
  client_ping: 0,
};

class SuwaClient extends Client {
  clientInfo = `Client Info: 
    > Client Name: Suwa Client
    > Client Version: 
    > API: ${ClientStatus.info.API_version}
    > REST: ${ClientStatus.info.rest}
    > Joined Server Count: 1
  `;
  /**
   *
   * @param {string} clientID
   */
  constructor(clientID) {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ],
    });

    this.logSystem = new LogToFileSystem();
    this.logger = new Logger("client", this.logSystem);

    process.on("uncaughtException", (error) => this.logger.error(error.stack));

    this.clientID = clientID;
    if (!this.clientID || clientID.length == 0) throw new Error("Missing clientID !");
  }

  /**
   *
   * @param {string} TOKEN
   */
  async start(TOKEN) {
    this.logger.log(`Startup...`);

    if (!TOKEN || TOKEN.length == 0) {
      this.logger.warn("Token is empty! Pls give your bot token !");
      this.logger.warn("Stopping client...");
      process.exit(1);
    }

    this.rest = new REST({ version: "10" }).setToken(TOKEN);

    this.once("ready", this.onClientStated);

    try {
      this.logger.log(this.clientInfo);

      // Init database
      // this.databaseHandler = new DatabaseHandler(this);

      // this.eventHandler = new EventHandler(this);
      // this.eventHandler.registerEvents();
      // this.slashCommandHandler = new CommandHandler(this);
      // this.slashCommandHandler.loadCommands();

      // this.messageHandler = new MessageHandler(this);
      // this.interactionHandler = new InteractionHandler(this);

      // this.musicQueueHandler = new MusicQueueHandler(this);

      this.errorHandler = new ErrorHandler(this);
      this.eventHandler = new EventHandler(this);
      this.eventHandler.loadFolder();
      this.commandHandler = new CommandHandler(this);
      this.commandHandler.loadFolder();
      this.slashCommandManager = new SlashCommandManager(this);
      this.interactionHandler = new InteractionHandler(this);
    } catch (error) {
      this.logger.error(error.stack);
      this.logger.warn("Stopping client...");
      process.exit(0);
    }

    await this.login(TOKEN);
  }

  /**
   * Function will executed on client started
   */
  onClientStated = async () => {
    this.slashCommandManager.registerApplicationCommandsForAllGuilds();
    this.logger.success(`SuwaClient is ready now !`);
  };

  /**
   * @param {import("discord.js").Interaction} interaction
   */
  getStatus(interaction) {
    ClientStatus.client_ping = this.ws.ping;
    ClientStatus.latency = Date.now() - interaction.createdTimestamp;
    return ClientStatus;
  }
}

module.exports = { SuwaClient, ClientStatus };
