import { Connection, createConnection } from "mysql";
import SuwaClient from "../bot";
import { Logger } from "../utils/Logger";

interface ConnectionConfig {
  host: string | "localhost";
  username: string | "root";
  password: string | "";
  port: number | 3306;
}

class Connector {
  private client: SuwaClient;
  public readonly logger: Logger;

  private readonly defaultConfig: ConnectionConfig = {
    host: "localhost",
    username: "root",
    password: "root",
    port: 3306,
  };
  private config: ConnectionConfig;
  private rootConnection: Connection | undefined = undefined;

  constructor(client: SuwaClient, config?: ConnectionConfig) {
    this.client = client;
    this.logger = new Logger("connection-manager", this.client.logSystem);
    this.config = config ?? this.defaultConfig;
  }

  public createRootConnection() {
    this.rootConnection = this.createConnection(this.config);
  }

  public createConnection(config?: ConnectionConfig): Connection {
    this.logger.log("Creating connection...");
    const conn = createConnection(this.config ?? this.defaultConfig);

    try {
      this.logger.log("Conneciton created! Checking connecttion...");
      conn.connect((err) => {
        if (err) throw err;
      });

      if (conn.state == "disconnected") throw new Error(`Connect state: ${conn.state}`);

      return conn;
    } catch (error) {
      this.logger.error("Create connection failed !");
      throw error;
    }
  }

  public async executeQuery(query: string, values: any[], connection?: Connection) {
    return new Promise((resolve, reject) => {
      connection = connection ?? this.rootConnection;
      if (!connection) throw new Error("No connection found !");

      connection.query(query, values, (err, results) => {
        if (err) {
          this.logger.error(`Query execution failed: ${err}`);
          return reject(err);
        }
        resolve(results);
      });
    });
  }
}

export default Connector;
