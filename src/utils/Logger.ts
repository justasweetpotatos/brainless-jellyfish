import * as path from "path";
import * as fs from "fs";

function getTimestamp(): string {
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

class Logger {
  public componentName: string;
  public loggerFilePath: string;
  public loggerComponentName: string = "Logger";

  constructor(componentName: string, loggerFilePath: string) {
    this.componentName = componentName;
    this.loggerFilePath = loggerFilePath;
  }

  static createLogFile() {
    try {
      const timeCreate = new Date().toLocaleString().replace(/:/g, "-").replace(/\//g, "-");
      const logFilePath = path.join(__dirname, `../logs/${timeCreate}.txt`);

      if (!fs.existsSync(logFilePath)) {
        fs.appendFileSync(logFilePath, "", "utf-8");
      }

      return logFilePath;
    } catch (error) {
      return "";
    }
  }

  writeToLogFile(lines: string[], logFilePath: string) {}

  lineFiller(input: string, lineLength: number = 150): string[] {
    let lines: string[] = [];
    let position = 0;

    while (position < input.length) {
      let line = input.slice(position, position + lineLength);
      line = line.padEnd(lineLength, " ");
      lines.push(line);
      position += lineLength;
    }

    return lines;
  }

  print(message: string, tagName: string, color: string) {
    const timeCreate = `[${getTimestamp()}]`;

    let finalMessage = `${timeCreate}[${tagName}][${this.componentName}]: ${message}`;

    if (tagName === "ERROR") {
      console.log(color + finalMessage + LoggerColors.Reset);
    } else {
      let lines = this.lineFiller(color + finalMessage + LoggerColors.Reset);
      lines.forEach((line) => {
        console.log(line);
      });
    }

    fs.appendFileSync(this.loggerFilePath, finalMessage + "\n", "utf-8");
  }

  log(message: string) {
    this.print(message, "LOG", LoggerColors.FgGray);
  }

  info(message: string) {
    this.print(message, "INFO", LoggerColors.BgGray);
  }

  success(message: string) {
    this.print(message, "SUCCESS", LoggerColors.FgGreen);
  }

  warn(message: string) {
    this.print(message, "WARN", LoggerColors.FgYellow);
  }

  error(message: string) {
    this.print(message, "ERROR", LoggerColors.FgRed);
  }
}

export default Logger;
