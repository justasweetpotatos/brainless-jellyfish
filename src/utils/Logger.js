"use strict";
exports.__esModule = true;
var path = require("path");
var fs = require("fs");
function getTimestamp() {
    var now = new Date();
    return now.toISOString().replace(/T/, " ").replace(/\..+/, "");
}
var LoggerColors = /** @class */ (function () {
    function LoggerColors() {
    }
    LoggerColors.Reset = "\x1b[0m";
    LoggerColors.Bright = "\x1b[1m";
    LoggerColors.Dim = "\x1b[2m";
    LoggerColors.Underscore = "\x1b[4m";
    LoggerColors.Blink = "\x1b[5m";
    LoggerColors.Reverse = "\x1b[7m";
    LoggerColors.Hidden = "\x1b[8m";
    LoggerColors.FgBlack = "\x1b[30m";
    LoggerColors.FgRed = "\x1b[31m";
    LoggerColors.FgGreen = "\x1b[32m";
    LoggerColors.FgYellow = "\x1b[33m";
    LoggerColors.FgBlue = "\x1b[34m";
    LoggerColors.FgMagenta = "\x1b[35m";
    LoggerColors.FgCyan = "\x1b[36m";
    LoggerColors.FgWhite = "\x1b[37m";
    LoggerColors.FgGray = "\x1b[90m";
    LoggerColors.BgBlack = "\x1b[40m";
    LoggerColors.BgRed = "\x1b[41m";
    LoggerColors.BgGreen = "\x1b[42m";
    LoggerColors.BgYellow = "\x1b[43m";
    LoggerColors.BgBlue = "\x1b[44m";
    LoggerColors.BgMagenta = "\x1b[45m";
    LoggerColors.BgCyan = "\x1b[46m";
    LoggerColors.BgWhite = "\x1b[47m";
    LoggerColors.BgGray = "\x1b[100m";
    return LoggerColors;
}());
var Logger = /** @class */ (function () {
    function Logger(componentName, loggerFilePath) {
        this.loggerComponentName = "Logger";
        this.componentName = componentName;
        this.loggerFilePath = loggerFilePath;
    }
    Logger.createLogFile = function () {
        try {
            var timeCreate = new Date().toLocaleString().replace(/:/g, "-").replace(/\//g, "-");
            var logFilePath = path.join(__dirname, "../logs/".concat(timeCreate, ".txt"));
            if (!fs.existsSync(logFilePath)) {
                fs.appendFileSync(logFilePath, "", "utf-8");
            }
            return logFilePath;
        }
        catch (error) {
            return "";
        }
    };
    Logger.prototype.writeToLogFile = function (lines, logFilePath) { };
    Logger.prototype.lineFiller = function (input, lineLength) {
        if (lineLength === void 0) { lineLength = 150; }
        var lines = [];
        var position = 0;
        while (position < input.length) {
            var line = input.slice(position, position + lineLength);
            line = line.padEnd(lineLength, " ");
            lines.push(line);
            position += lineLength;
        }
        return lines;
    };
    Logger.prototype.print = function (message, tagName, color) {
        var timeCreate = "[".concat(getTimestamp(), "]");
        var finalMessage = "".concat(timeCreate, "[").concat(tagName, "][").concat(this.componentName, "]: ").concat(message);
        if (tagName === "ERROR") {
            console.log(color + finalMessage + LoggerColors.Reset);
        }
        else {
            var lines = this.lineFiller(color + finalMessage + LoggerColors.Reset);
            lines.forEach(function (line) {
                console.log(line);
            });
        }
        fs.appendFileSync(this.loggerFilePath, finalMessage + "\n", "utf-8");
    };
    Logger.prototype.log = function (message) {
        this.print(message, "LOG", LoggerColors.FgGray);
    };
    Logger.prototype.info = function (message) {
        this.print(message, "INFO", LoggerColors.BgGray);
    };
    Logger.prototype.success = function (message) {
        this.print(message, "SUCCESS", LoggerColors.FgGreen);
    };
    Logger.prototype.warn = function (message) {
        this.print(message, "WARN", LoggerColors.FgYellow);
    };
    Logger.prototype.error = function (message) {
        this.print(message, "ERROR", LoggerColors.FgRed);
    };
    return Logger;
}());
exports["default"] = Logger;
