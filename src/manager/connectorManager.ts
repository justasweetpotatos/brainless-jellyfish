import { Collection } from "discord.js";
import { Connection } from "mysql";

import SuwaClient from "../bot";
import Connector from "../database/connector";
import Logger from "../utils/Logger";

class ConnectionManager {
  private connections: Collection<String, Connection>;
  private adminConnection: Connection | null = null;
  private connector: Connector;
  private logger: Logger;

  private host: string = "localhost";
  private username: string = "root";
  private password: string = "MySQLServer";
  private dbPort: number = 3306;

  private defaultConnectionConfig = {
    host: this.host,
    user: this.username,
    password: this.password,
    port: this.dbPort,
  };

  public client: SuwaClient;

  constructor(client: SuwaClient) {
    this.client = client;
    this.connector = new Connector(client);
    this.connections = new Collection();
    this.logger = new Logger("COM-ConnectionManager", client.loggerFilePath);
  }

  public getConnection(threadId: String) {
    return this.connections.get(threadId);
  }

  public forceCloseAllConnection() {
    this.connections.forEach((conn) => conn.destroy());
  }

  async createMainConnection(): Promise<Connection> {
    if (this.adminConnection) {
      this.logger.log("Main connection already exists!");
      return this.adminConnection;
    }

    try {
      this.logger.log("Creating main connection...");

      this.adminConnection = this.connector.createConnection({
        host: this.host,
        user: this.username,
        password: this.password,
        port: this.dbPort,
      });

      await this.connector.checkingConnection(this.adminConnection);

      this.logger.success("Creat main connection Successfully !");

      return this.adminConnection;
    } catch (error) {
      error instanceof Error
        ? this.logger.error(`Create main connection failed: ${error.stack}`)
        : this.logger.error("Undefined error !");
      throw error;
    }
  }
}

export default ConnectionManager;
