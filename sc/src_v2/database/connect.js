const { Connection, createConnection } = require("mysql");
const { SuwaClient } = require("../client/bot");

class Connector {
  connectionData = {
    host: "localhost",
    user: "root",
    password: "SuwaClient@mysql",
    port: 3305,
  };

  /**
   *
   * @param {SuwaClient} client
   */
  constructor(client) {
    this.client = client;
  }

  init() {
    this.mainConnection = createConnection(this.connectionData);
    return this.mainConnection;
  }

  /**
   *
   * @returns {Connection}
   */
  createConnection() {
    this.logger.info(`Creating connection for user: ${this.connectionData.user}`);
    const conn = mysql.createConnection(this.connectionData);
    this.connections.set(conn.threadId.toString(), conn);
    this.logger.info(`Create connection successfully ! Thread: ${conn.threadId}`);
    return conn;
  }

  /**
   * @param {string} threadId
   */
  closeConnection(threadId) {
    this.connections.get(threadId).destroy();
    this.connections.delete(threadId);
  }

  /**
   *
   * @param {string} query
   * @param {Array<any>} values
   * @returns {Promise<any>}
   */
  async runQuery(query, values) {
    return new Promise((resolve, reject) => {
      this.mainConnection.query(query, values, (err, results) => {
        err ? reject(err) : resolve(results);
      });
    });
  }
}

module.exports = { Connector };
