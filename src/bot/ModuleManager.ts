import {
  Events,
  Interaction,
  Message,
  OmitPartialGroupDMChannel,
  PartialMessage,
  ReadonlyCollection,
} from "discord.js";
import ConnectingWordGameModule from "../modules/ConnectingWordGameModule";
import { Logger } from "../utils/Logger";
import SuwaBot from "./SuwaBot";
import { EventManagerModule } from "../modules/EventManagerModule";
import { CommandModule } from "../modules/CommandModule";
import { MessageTrafficModule } from "../modules/MessageTrafficModule";

export class ModuleManager {
  private readonly client: SuwaBot;
  private readonly logger: Logger;

  // system module
  public readonly eventManagerModule: EventManagerModule;
  public readonly commandModule: CommandModule;

  public readonly messageTrafficModule: MessageTrafficModule;
  public readonly connectingWordGameModule: ConnectingWordGameModule;

  constructor(client: SuwaBot) {
    this.client = client;
    this.logger = new Logger("module-manager", this.client.logPrinter);

    // System module
    this.eventManagerModule = new EventManagerModule({ client: client, name: "event-manager-module" });
    this.commandModule = new CommandModule({ client: client, name: "command-module" });

    this.messageTrafficModule = new MessageTrafficModule({ client: client, name: "message-traffic-module" });
    this.connectingWordGameModule = new ConnectingWordGameModule({ client: client, name: "connecting-word-module" });
  }

  async onInteractionCreate(interaction: Interaction) {
    this.commandModule.emit(Events.InteractionCreate, interaction);
  }

  async onMessageCreate(message: Message) {
    try {
      // this.logger.log(`From: ${message.author.id}-${message.author.displayName}, content: ${message.cleanContent}`);
      this.messageTrafficModule.emit(Events.MessageCreate, message);
      this.connectingWordGameModule.emit(Events.MessageCreate, message);
    } catch (error) {
      if (!(error instanceof Error)) return;
      this.logger.error(error.message);
    }
  }

  async onMessageUpdate(message: Message<boolean> | PartialMessage) {}

  async onMessageDelete(message: Message<boolean> | PartialMessage) {}

  async onMessaegBulkDelete(
    messages: ReadonlyCollection<string, OmitPartialGroupDMChannel<Message<boolean> | PartialMessage>>
  ) {}

  createEventListeners() {
    this.logger.info("Creating event listeners");

    // Interaction
    this.client.on(Events.InteractionCreate, (...args) => this.onInteractionCreate(...args));
    // Message action
    this.client.on(Events.MessageCreate, (message) => this.onMessageCreate(message));
    this.client.on(Events.MessageUpdate, (message) => this.onMessageUpdate(message));
    this.client.on(Events.MessageDelete, (message) => this.onMessageDelete(message));
    this.client.on(Events.MessageBulkDelete, (message) => this.onMessaegBulkDelete(message));

    // Message interaction

    //

    this.logger.success(`Created total ${this.client.listeners.length} listerner !`);
  }

  async activateAllModule() {
    this.logger.info("Activating all modules !");
    // this.commandModule.activateModule();

    // this.connectingWordGameModule.activateModule();
    // this.eventManagerModule.activateModule();
    this.messageTrafficModule.activateModule();
    setInterval(() => {
      this.messageTrafficModule.logParameter();
    }, 1000);
  }
}
