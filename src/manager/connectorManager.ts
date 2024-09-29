import { Connection, createConnection } from "mysql";
import SuwaClient from "../bot";

interface ConnectionConfig {
  host: string | "localhost";
  username: string | "root";
  password: string | "";
  port: number | 3306;
}

class Connector {
  private client: SuwaClient;
  private readonly defaultConfig: ConnectionConfig = {
    host: "localhost",
    username: "root",
    password: "root",
    port: 3306,
  };
  private config: ConnectionConfig;
  private rootConnection: Connection;

  constructor(client: SuwaClient, config: ConnectionConfig) {
    this.client = client;
    this.config = config ?? this.defaultConfig;
    this.rootConnection = this.createConnection(this.config);
  }

  public createConnection(config: ConnectionConfig) {
    return createConnection(config);
  }

  public async executeQuery(query: string, values: any[], connection?: Connection) {
    return new Promise((resolve, reject) => {
      connection = connection ?? this.rootConnection;
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
