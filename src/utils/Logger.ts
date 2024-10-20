import * as path from "path";
import * as fs from "fs";
import { LogMessageType } from "../enum/general";
import SuwaBot from "../bot/SuwaBot";

function getStringTimestamp(date?: Date): string {
  return (date ?? new Date()).toISOString().replace(/T/, " ").replace(/\..+/, "");
}

class LogPrinter {
  public systemCreateTimestamp: Date;
  private logDir: string;
  private logFile: string;

  private client: SuwaBot;

  constructor(client: SuwaBot) {
    this.client = client;
    this.systemCreateTimestamp = new Date();

    this.logDir = path.join(__dirname, "log");
    this.logFile = path.join(
      this.logDir,
      this.systemCreateTimestamp.toISOString().replace(/T/g, " ").replace(/[:]/g, "-").slice(0, -4) + "txt"
    );

    if (!fs.existsSync(this.logDir)) fs.mkdirSync(this.logDir);
    if (!fs.existsSync(this.logFile) && !(this.client.clientRunMode === "debug"))
      fs.writeFileSync(
        this.logFile,
        `This is log create by client, created time is ${getStringTimestamp(this.systemCreateTimestamp)}.\n`
      );
  }

  /**
   * Write message to log file
   */
  write(content: string) {
    if (!(this.client.clientRunMode === "debug")) fs.appendFileSync(this.logFile, content + "\n");
  }
}

class Logger {
  public readonly label: string;
  public readonly printer: LogPrinter;

  /**
   *
   * @param {string} label Component label
   * @param {LogPrinter} printer Write to file system
   */
  constructor(label: string, printer: LogPrinter) {
    this.label = label;
    this.printer = printer;
  }

  print(content: string, type: LogMessageType | LogMessageType.LOG, printToFile?: boolean) {
    const logTimestamp = `${getStringTimestamp()}`;

    const message = `[${logTimestamp}][${this.label.toUpperCase()}][${type.toUpperCase()}] ${content}`;

    if (printToFile ?? true) this.printer.write(message);

    switch (type) {
      case LogMessageType.LOG:
        console.log(message);
        break;
      case LogMessageType.WARN:
        console.warn(message);
        break;
      case LogMessageType.INFO:
        console.info(message);
        break;
      case LogMessageType.SUCCESS:
        console.info(message); // temp
        break;
      case LogMessageType.ERROR:
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
  log(message: string, printToFile?: boolean) {
    this.print(message, LogMessageType.LOG, printToFile);
  }
  /**
   *
   * @param {string} message
   * @param {boolean} printToFile
   */
  info(message: string, printToFile?: boolean) {
    this.print(message, LogMessageType.INFO, printToFile);
  }
  /**
   *
   * @param {string} message
   * @param {boolean} printToFile
   */
  success(message: string, printToFile?: boolean) {
    this.print(message, LogMessageType.SUCCESS, printToFile);
  }
  /**
   *
   * @param {string} message
   * @param {boolean} printToFile
   */
  warn(message: string, printToFile?: boolean) {
    this.print(message, LogMessageType.WARN, printToFile);
  }
  /**
   *
   * @param {string} message
   * @param {boolean} printToFile
   */
  error(message: string, printToFile?: boolean) {
    this.print(message, LogMessageType.ERROR, printToFile ?? true);
  }
}

export { LogPrinter, Logger };
