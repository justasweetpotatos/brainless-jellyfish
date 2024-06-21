import SuwaClient from "./bot";

import * as dotenv from "dotenv";

dotenv.config();

const { TOKEN, CLIENT_ID } = process.env;

if (!TOKEN || !CLIENT_ID) {
} else {
  const client = new SuwaClient(CLIENT_ID);
  client.start(TOKEN);
}
