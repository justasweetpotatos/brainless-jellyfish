const path = require("path");
const fs = require("fs");

const { Collection, Events } = require("discord.js");

const { SuwaClient } = require("../client/client");
const { Logger } = require("../utils/logger");
const { EventError } = require("../utils/error/clientError");

class EventHandler {
  /**
   *
   * @param {SuwaClient} client
   */
  constructor(client) {
    this.client = client;

    this.logger = new Logger("event-handler", client.logSystem);

    this.eventFolder = path.join(__dirname, "../modules/events");
    this.events = new Collection();
  }

  loadFolder() {
    // If folder is not exist, create new folder.
    if (!fs.existsSync(this.eventFolder)) throw new Error("No event folder found, warning !");

    this.logger.log("Loading event modules...");

    fs.readdirSync(this.eventFolder).forEach((file) => {
      if (!file.endsWith(".js")) return;

      const { name, execute, once } = require(path.join(this.eventFolder, file));

      if (!Events[name])
        throw new EventError(`>${name} is not valid event name !`, null, EventError.INVALID_EVENT_NAME);

      if (!execute || !typeof execute === "function")
        throw new EventError(
          `Execute is not found or type is not a function !`,
          null,
          EventError.INVALID_EVENT_EXECUTOR
        );

      once
        ? this.client.once(Events[name], (...args) => execute(...args, this.client))
        : this.client.on(Events[name], (...args) => execute(...args, this.client));

      this.logger.success(`Registered event name ${name}.`);
    });
  }
}

module.exports = EventHandler;
