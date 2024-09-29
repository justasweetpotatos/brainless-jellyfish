
const fs = require("fs");
const { Collection } = require("discord.js");
const { Logger } = require("../utils/logger");
const { SuwaClient } = require("../client/bot");
const { EventError } = require("../utils/errorHandler/clientError");

class EventHandler {
  /**
   * @param {SuwaClient} client
   */
  constructor(client) {
    this.client = client;
    this.logger = new Logger("EventHandler", client.logSystem);
    this.eventFolder = path.join(__dirname, "../event");
    this.eventHandlers = new Collection();
  }

  registerEvents() {
    this.logger.log("Handling events progress...");
    const files = fs.readdirSync(this.eventFolder);
    files.forEach((file) => {
      if (file.endsWith(".js")) {
        this.registerEvent(file);
      }
    });
  }

  /**
   * Registers a single event.
   * @param {string} file - The event file name
   */
  registerEvent(file) {
    const eventName = file.replace(".js", "");
    try {
      const event = require(path.join(this.eventFolder, file));

      if (!event || !event.execute) throw new Error(`${file}: Event data or execute function not found!`);

      const executeEvent = async (...args) => {
        try {
          await event.execute(...args, this.client);
        } catch (error) {
          throw new EventError(error.message, error.stack, EventError.codes.EXECUTE_EVENT_FAILED);
        }
      };

      if (event.once) {
        this.client.once(event.name, executeEvent);
      } else {
        this.client.on(event.name, executeEvent);
      }

      this.logger.success(`Event "${eventName}" loaded successfully.`);
      this.eventHandlers.set(eventName, executeEvent);
    } catch (error) {
      this.logger.error(`Failed to register event "${eventName}": ${error.message}`);
    }
  }

  /**
   * Removes an event listener.
   * @param {string} eventName - The name of the event to remove
   */
  removeEventListener(eventName) {
    const handler = this.eventHandlers.get(eventName);
    if (handler) {
      this.client.off(eventName, handler);
      this.logger.success(`Event listener "${eventName}" removed successfully.`);
      this.eventHandlers.delete(eventName);
    } else {
      this.logger.warn(`No event listener found for "${eventName}".`);
    }
  }
}

module.exports = { EventHandler };
