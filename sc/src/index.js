require(`dotenv`).config();
const { TOKEN } = process.env;
const { Client, Collection, GatewayIntentBits, REST } = require("discord.js");
const fs = require("fs");
const logger = require("./utils/logger");
const { AuthSessionManager } = require("./functions/discordAuth/session/sessionManager");
const { NoichuChannelConfigRepository, GuildConfigRepository } = require("./database/repository");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

logger.log.server(`Start up...`);
logger.log.server(`Creating caches...`);

client.commands = new Collection();
client.subcommands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.commandJSONArray = [];
client.subcommandJSONArray = [];
client.unloadedCommands = new Collection();
client.unloadedSubcommands = new Collection();
client.commandNameList = [];

client.clientId = "1168430797599019022";
client.guildIdList = [`811939594882777128`, `1135541584100855881`];
client.rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

client.commandPaths = new Collection();

for (const folder of fs.readdirSync("./functions")) {
  const functionFiles = fs.readdirSync(`./functions/${folder}`).filter((file) => file.endsWith(`.js`));

  for (const file of functionFiles) {
    logger.log.server(`readinng path: ./functions/${folder}/${file}`);
    require(`./functions/${folder}/${file}`);
  }
}

for (const handlerPath of fs.readdirSync(`./handlers`)) {
  require(`./handlers/${handlerPath}`)(client);
}

client.authSessionManager = new AuthSessionManager();
(async () => {
  await client.authSessionManager.syncPlayerProfiles();
})();

// repositories
client.noichuChannelConfigRepository = new NoichuChannelConfigRepository();
client.guildConfigRepository = new GuildConfigRepository();

// moderation
client.blacklistedUsers = new Collection();

client.handleEvents();
client.handleCommands();
client.handleComponents();

client.login("MTE2ODQzMDc5NzU5OTAxOTAyMg.G1zcnw.WVwaY7Gz6y6-klNeJIFRft39IZ5X9lxAKov5MU");
