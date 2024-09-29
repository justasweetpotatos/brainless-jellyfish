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

class LoggerColors {
  static Reset = "\x1b[0m";
  static Bright = "\x1b[1m";
  static Dim = "\x1b[2m";
  static Underscore = "\x1b[4m";
  static Blink = "\x1b[5m";
  static Reverse = "\x1b[7m";
  static Hidden = "\x1b[8m";

  static FgBlack = "\x1b[30m";
  static FgRed = "\x1b[31m";
  static FgGreen = "\x1b[32m";
  static FgYellow = "\x1b[33m";
  static FgBlue = "\x1b[34m";
  static FgMagenta = "\x1b[35m";
  static FgCyan = "\x1b[36m";
  static FgWhite = "\x1b[37m";
  static FgGray = "\x1b[90m";

  static BgBlack = "\x1b[40m";
  static BgRed = "\x1b[41m";
  static BgGreen = "\x1b[42m";
  static BgYellow = "\x1b[43m";
  static BgBlue = "\x1b[44m";
  static BgMagenta = "\x1b[45m";
  static BgCyan = "\x1b[46m";
  static BgWhite = "\x1b[47m";
  static BgGray = "\x1b[100m";
}

class LogSystem {
  constructor() {
    this.createdTimestamp = new Date();
  }

  init() {
    this.logDir = path.join(__dirname, "log");
    this.logFile = path.join(
      this.logDir,
      this.createdTimestamp.toISOString().replace(/T/g, " ").replace(/[:]/g, "-").slice(0, -4) + "txt"
    );

    this.logFile.replace(":", "-");

    if (!fs.existsSync(this.logDir)) fs.mkdirSync(this.logDir);
    if (!fs.existsSync(this.logFile))
      fs.writeFileSync(
        this.logFile,
        `This is log create by client, created time is ${getTimestamp(this.createdTimestamp, true)}.\n`
      );
  }

  /**
   *
   * @param {string} content
   */
  writeToLogFile(content) {
    fs.appendFileSync(this.logFile, content + "\n");
  }
}

class Logger {
  /**
   *
   * @param {string} compName Name of component
   * @param {LogSystem} system
   */
  constructor(compName, system) {
    this.compName = compName;
    this.system = system;
  }

  /**
   * Splits a string into lines of fixed length.
   *
   * @param {string} input - The string to be split.
   * @param {number | 150} lineLength - The length of each line. Can be any positive number, default is 150 if not provided.
   * @returns {string[]} - An array of lines after splitting.
   */
  lineChunker(input, lineLength = 150) {
    // Check the type and validity of lineLength
    if (typeof input !== "string") {
      throw new TypeError("The input parameter must be a string.");
    }
    if (typeof lineLength !== "number" || lineLength <= 0) {
      throw new TypeError("The lineLength parameter must be a positive number.");
    }

    let lines = [];
    let position = 0;

    while (position < input.length) {
      // Slice the string from the current position to the position plus lineLength
      let line = input.slice(position, position + lineLength);
      // Add spaces to the end of the line if needed
      line = line.padEnd(lineLength, " ");
      lines.push(line);
      position += lineLength;
    }

    return lines;
  }

  /**
   *
   * @param {string} message
   * @param {string} tagName
   * @param {string} color
   * @param {boolean} onlyPrintToFile
   * @returns {string}
   */
  print(message, tagName, color, onlyPrintToFile) {
    const timeCreate = `${getTimestamp()}`;
    let finalLog = `${timeCreate}[${tagName}][${this.compName}]: ${message}`;
    this.system.writeToLogFile(finalLog);

    if (onlyPrintToFile) return;
    if (tagName === "ERROR") console.log(color + finalLog + LoggerColors.Reset);
    else {
      let lines = this.lineChunker(color + finalLog + LoggerColors.Reset);
      lines.forEach((line) => {
        console.log(line);
      });
    }
  }

  /**
   *
   * @param {string} message
   * @param {boolean} onlyPrintToFile
   */
  log(message, onlyPrintToFile) {
    this.print(message, "LOG", LoggerColors.FgGray, onlyPrintToFile);
  }
  /**
   *
   * @param {string} message
   * @param {boolean} onlyPrintToFile
   */
  info(message, onlyPrintToFile) {
    this.print(message, "INFO", LoggerColors.BgGray, onlyPrintToFile);
  }
  /**
   *
   * @param {string} message
   * @param {boolean} onlyPrintToFile
   */
  success(message, onlyPrintToFile) {
    this.print(message, "SUCCESS", LoggerColors.FgGreen, onlyPrintToFile);
  }
  /**
   *
   * @param {string} message
   * @param {boolean} onlyPrintToFile
   */
  warn(message, onlyPrintToFile) {
    this.print(message, "WARN", LoggerColors.FgYellow, onlyPrintToFile);
  }
  /**
   *
   * @param {string} message
   * @param {boolean} onlyPrintToFile
   */
  error(message, onlyPrintToFile) {
    this.print(message, "ERROR", LoggerColors.FgRed, onlyPrintToFile);
  }
}

module.exports = { LogSystem, Logger };
