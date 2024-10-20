import { Interaction, Message } from "discord.js";
import ConnectingWordGameModule from "../modules/ConnectingWordGameModule";
import { Logger } from "../utils/Logger";
import SuwaBot from "./SuwaBot";

export class ModuleManager {
  private readonly client: SuwaBot;
  private readonly logger: Logger;

  public readonly connectingWordGameModule: ConnectingWordGameModule;

  constructor(client: SuwaBot) {
    this.client = client;
    this.logger = new Logger("module-manager", this.client.logPrinter);

    this.connectingWordGameModule = new ConnectingWordGameModule({ client: client, name: "connecting-word-module" });
  }

  async onInteractionCreate(interaction: Interaction) {
    //
  }

  async onMessageCreate(message: Message){
    this.logger.log(`From: ${message.author.globalName}, content: ${message.cleanContent}`);
    this.connectingWordGameModule.emit("message-create", message);
  }

  async activateAllModule() {
    this.connectingWordGameModule.setWorkMode("enable").activateModule();
  }
}
