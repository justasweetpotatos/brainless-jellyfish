import * as path from "path";
import * as fs from "fs";
import { ButtonInteraction, Collection } from "discord.js";
import SuwaClient from "../bot";
import { ButtonData } from "../interfaces/ComponentData";
import { ClientError, ErrorCode } from "../utils/error/ClientError";
import { Logger } from "../utils/Logger";

class ComponentManager {
  private readonly client: SuwaClient;
  private readonly logger: Logger;

  public readonly buttonComponentFolderPath: string;

  public buttonCollection: Collection<string, ButtonData>;

  constructor(client: SuwaClient) {
    this.client = client;
    this.logger = new Logger("component-manager", client.logSystem);

    this.buttonComponentFolderPath = path.join(__dirname, "../components/buttons");

    this.buttonCollection = new Collection<string, ButtonData>();
  }

  getButtonData(customId: string): ButtonData {
    const buttonData = this.buttonCollection.get(customId);
    if (buttonData) return buttonData;
    else throw new ClientError(`No button with id: ${customId}`, ErrorCode.LOAD_COMPONENT_FAILED);
  }

  loadComponents() {
    this.loadButtonComponents();
  }

  loadButtonComponents() {
    if (fs.existsSync(this.buttonComponentFolderPath)) {
      fs.readdirSync(this.buttonComponentFolderPath).forEach((folder) => {
        try {
          folder = path.join(this.buttonComponentFolderPath, folder);
          if (fs.existsSync(folder)) {
            fs.readdirSync(folder).forEach((file) => {
              if (!file.endsWith(".ts") && !file.endsWith(".js")) return;
              const buttonData: ButtonData = require(path.join(folder, file));

              if (buttonData) this.buttonCollection.set(buttonData.customId, buttonData);
              else throw new ClientError(`Component in file "${file}" is invalid !`, ErrorCode.LOAD_COMPONENT_FAILED);
            });
          } else throw new ClientError(`components folder "${folder}" not found !`, ErrorCode.LOAD_COMMAND_FAILED);
        } catch (error) {
          this.client.errorHandler.handleButtonError({ error: error, logger: this.logger });
        }
      });
    } else throw new ClientError("components folder not found !", ErrorCode.LOAD_COMMAND_FAILED);
  }
}

export default ComponentManager;
