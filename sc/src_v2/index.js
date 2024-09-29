const { SuwaClient } = require("./client/bot");

require(`dotenv`).config();
const { TOKEN } = process.env;

const client = new SuwaClient("1168430797599019022");
client.start(TOKEN);
