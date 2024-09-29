const { Client, GatewayIntentBits, version, REST } = require("discord.js");

// const { Logger, LogSystem } = require("../utils/logger");
// const { EventHandler } = require("../handler/eventHandler");
// const { InteractionHandler } = require("../handler/interactionHandler");
// const { CommandHandler } = require("../handler/commandHandler");
// const { ErrorHandler } = require("../utils/errorHandler/errorHandler");
// const { MessageHandler } = require("../handler/messageHandler");
// const { Connector } = require("../database/connect");
// const DatabaseHandler = require("../handler/guildDatabaseHandler");
// const MusicQueueHandler = require("../function/music/queueHandler");

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

    this.logSystem = new LogSystem();
    this.logSystem.init();
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
      process.exit(1);
    }

    this.rest = new REST({ version: "10" }).setToken(TOKEN);

    this.once("ready", this.onClientStated);

    try {
      this.errorHandler = new ErrorHandler(this);

      this.logger.log(this.clientInfo);

      // Init database
      this.databaseHandler = new DatabaseHandler(this);

      this.eventHandler = new EventHandler(this);
      this.eventHandler.registerEvents();
      this.slashCommandHandler = new CommandHandler(this);
      this.slashCommandHandler.loadCommands();

      this.messageHandler = new MessageHandler(this);
      this.interactionHandler = new InteractionHandler(this);

      // this.musicQueueHandler = new MusicQueueHandler(this);
    } catch (error) {
      this.logger.error(error.stack);
      this.logger.warn("Stopping client...");
      process.exit(0);
    }

    this.login(TOKEN);
    this.logger.success(`SuwaClient is ready now !`);
  }

  /**
   * Function will executed on client started
   */
  onClientStated = async () => {
    try {
      this.databaseHandler.loadDatabase().then(async () => {
        this.slashCommandHandler.registerCommands();
      });
    } catch (error) {
      this.logger.error(error.stack);
    }
  };

  getStatus() {
    ClientStatus.client_ping = this.ws.ping;
    ClientStatus.latency = Date.now() - interaction.createdTimestamp;
    return ClientStatus;
  }
}

module.exports = { SuwaClient, ClientStatus };
