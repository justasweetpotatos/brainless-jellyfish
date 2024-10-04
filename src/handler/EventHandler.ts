import { Collection } from "discord.js";
import SuwaClient from "../bot";
import { Logger } from "../utils/Logger";
import * as path from "path";
import * as fs from "fs";
import { ClientError, ErrorCode } from "../utils/error/ClientError";
import { ExecuteEventFunction } from "../interfaces/ExecuteFunction";

class EventHandler {
  private readonly client: SuwaClient;
  private readonly logger: Logger;
  public eventCollection: Collection<string, ExecuteEventFunction>;

  constructor(client: SuwaClient) {
    this.client = client;
    this.logger = new Logger("event-handler", client.logSystem);
    this.eventCollection = new Collection<string, ExecuteEventFunction>();
  }

  loadEvents() {
    const eventsFolderPath = path.join(__dirname, "../events");
    try {
      this.logger.log("Start loading events.");
      if (fs.existsSync(eventsFolderPath)) {
        fs.readdirSync(eventsFolderPath).forEach((file) => {
          if (!file.endsWith(".ts") && !file.endsWith("js")) return;
          const filePath = path.join(eventsFolderPath, file);
          const data = require(filePath);
          if (!data.name || !data.execute) throw new ClientError("Event data is invalid.", ErrorCode.LOAD_EVENT_FAILED);
          else {
            if (data.once) this.client.once(data.name, data.execute);
            else this.client.on(data.name, data.execute);
            this.eventCollection.set(data.name, data);
          }
          this.logger.success(`Loaded event "${data.name}".`);
        });
        this.logger.success(`Successfully loaded all events, total ${this.eventCollection.size}!`);
      }
    } catch (error) {
      this.client.errorHandler.handleEventError({ error: error, logger: this.logger });
    }
  }
}

export default EventHandler;
