import { ConnectionOptions, createPool, Pool } from "mysql";
import SuwaBot from "../bot/SuwaBot";

export default class Connector {
  private readonly client: SuwaBot;
  private readonly connectionConfig: ConnectionOptions = {};

  private pool?: Pool;

  constructor(client: SuwaBot) {
    this.client = client;
  }

  createPool(connectionConfig?: ConnectionOptions) {
    if (!connectionConfig) this.pool = createPool(this.connectionConfig);
    else this.pool = createPool(connectionConfig);
  }
}
