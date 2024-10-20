import ConnectingWordGameModule from "../structure/ConnectingWordGameModule";
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

  async onInteractionCreate() {
    
  }

  async activateAllModule() {
    this.connectingWordGameModule.setWorkMode("enable");
  }
}
