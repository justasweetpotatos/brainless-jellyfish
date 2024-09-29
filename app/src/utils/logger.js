const path = require("path");
const fs = require("fs");

/**
 * @returns {string}
 * @example
 */
function getTimestamp() {
  const now = new Date();
  return now.toISOString().replace(/T/, " ").replace(/\..+/, "");
}

class LogToFileSystem {
  constructor() {
    this.systemCreateTimestamp = new Date();

    this.logDir = path.join(__dirname, "log");
    this.logFile = path.join(
      this.logDir,
      this.systemCreateTimestamp.toISOString().replace(/T/g, " ").replace(/[:]/g, "-").slice(0, -4) + "txt"
    );

    if (!fs.existsSync(this.logDir)) fs.mkdirSync(this.logDir);
    if (!fs.existsSync(this.logFile))
      fs.writeFileSync(
        this.logFile,
        `This is log create by client, created time is ${getTimestamp(this.createdTimestamp, true)}.\n`
      );
  }

  /**
   * Write message to log file
   * @param {string} content The content of message.
   */
  write(content) {
    fs.appendFileSync(this.logFile, content + "\n");
  }
}

class MessageType {
  static log = Object.freeze("log");
  static info = Object.freeze("info");
  static success = Object.freeze("success");
  static warn = Object.freeze("warn");
  static error = Object.freeze("error");
}

class Logger {
  /**
   *
   * @param {string} label Name of component
   * @param {LogToFileSystem} system Write to file system
   */
  constructor(label, system) {
    this.label = label;
    this.system = system;
  }

  /**
   *
   * @param {string} content
   * @param {string} type
   * @param {boolean || true} printToFile
   */
  print(content, type, printToFile = true) {
    const logTimestamp = `${getTimestamp()}`;

    const message = `[${logTimestamp}][${this.label.toUpperCase()}][${type.toUpperCase()}] ${content}`;
    printToFile ? this.system.write(message) : "";

    switch (type) {
      case MessageType.log:
        console.log(message);
        break;
      case MessageType.warn:
        console.warn(message);
        break;
      case MessageType.info:
        console.info(message);
        break;
      case MessageType.success:
        console.info(message); // temp
        break;
      case MessageType.error:
        console.error(message);
        break;
      default:
        console.log(message);
        break;
    }
  }

  /**
   *
   * @param {string} message
   * @param {boolean} printToFile
   */
  log(message, printToFile) {
    this.print(message, MessageType.log, printToFile);
  }
  /**
   *
   * @param {string} message
   * @param {boolean} printToFile
   */
  info(message, printToFile) {
    this.print(message, MessageType.info, printToFile);
  }
  /**
   *
   * @param {string} message
   * @param {boolean} printToFile
   */
  success(message, printToFile) {
    this.print(message, MessageType.success, printToFile);
  }
  /**
   *
   * @param {string} message
   * @param {boolean} printToFile
   */
  warn(message, printToFile) {
    this.print(message, MessageType.warn, printToFile);
  }
  /**
   *
   * @param {string} message
   * @param {boolean} printToFile
   */
  error(message, printToFile) {
    this.print(message, MessageType.error, printToFile);
  }
}

module.exports = { LogToFileSystem, Logger };
