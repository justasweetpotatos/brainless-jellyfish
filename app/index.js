const { SuwaClient } = require("./src/client/client");

// require(`dotenv`).config();
// const { TOKEN } = process.env;

const botConfig = require("./src/config/bot.json").config;

const client = new SuwaClient(botConfig.client_id);
client.start(botConfig.token);
