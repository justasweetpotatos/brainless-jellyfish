import { Connection, ConnectionConfig, createConnection } from "mysql";
import SuwaClient from "../bot";
import { Logger } from "../utils/Logger";

class Connector {
  private logger: Logger;

  private client: SuwaClient;

  constructor(client: SuwaClient) {
    this.client = client;
    this.logger = new Logger("Database", this.client.logSystem);
  }

  public createConnection(config: ConnectionConfig): Connection {
    return createConnection(config);
  }

  public async checkingConnection(conn: Connection): Promise<void> {
    return new Promise((resolver, reject) => {
      conn.connect((err) => {
        this.logger.log("Checking Connection...");
        this.logger.log("Connecting to database...");
        if (err) return reject(err);

        this.logger.success(`Connected to database ! Connection thread: ${conn.threadId}`);
        resolver();
      });
    });
  }

  public async executeQuery(query: string, values: any[], connection: Connection): Promise<any> {
    return new Promise((resolve, reject) => {
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
