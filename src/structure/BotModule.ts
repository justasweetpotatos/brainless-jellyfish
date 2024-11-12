import { BaseModule } from "./BaseModule";
import { BotModuleOptions, BotModuleWorkMode } from "./interface/module";
import SuwaBot from "../bot/SuwaBot";
import { Logger } from "../utils/Logger";
import {
  AutocompleteInteraction,
  ButtonInteraction,
  ChatInputCommandInteraction,
  Collection,
  CommandInteraction,
  Events,
  Guild,
  GuildMember,
  Interaction,
  Message,
} from "discord.js";

export abstract class BotModule<T extends BotModuleOptions> extends BaseModule<BotModuleOptions> {
  protected readonly client: SuwaBot;
  protected readonly logger: Logger;
  public readonly createdTimestamp: number;
  public acivateTimestamp: number = 0;
  private runnedFunctionCounter: number = 0;
  private currentFunctionRunning: number = 0;
  public readonly moduleTrafficReceivedCounter: Collection<number, number>;
  private beforeStartFunctions: Array<Function> = [];

  public workMode: BotModuleWorkMode;

  constructor(options: T) {
    super(options);

    this.createdTimestamp = Date.now();
    this.client = options.client;
    this.logger = new Logger(options.name, options.client.logPrinter);
    this.moduleTrafficReceivedCounter = new Collection();
    this.workMode = "enable";
    this.beforeStartFunctions = [this.createListener];
  }

  /**
   * no description
   */
  activateModule() {
    this.on("moduleActivated", () => this.onModuleActivated());
    this.on("functionRunSuccessfully", (id) => {
      this.runnedFunctionCounter += 1;
      if (this.currentFunctionRunning === this.beforeStartFunctions.length - 1)
        this.emit("moduleAcivated", () => this.onModuleActivated());
    });
    this.beforeStartFunctions.forEach((runFunction, index) => {
      this.currentFunctionRunning == index;
      try {
        runFunction.call(this);
      } catch (error) {
        if (error instanceof Error) this.logger.error(error.message);
      }
    });
  }

  pushBeforeActivateFunction(runFunction: Function) {
    this.beforeStartFunctions.push(runFunction);
  }

  private createListener() {
    this.logger.info("Creating module listeners...");
    this.on(Events.MessageCreate, (message: Message) => this.pushMessageEvent(message));
    this.on(Events.InteractionCreate, (interaction: Interaction) => this.pushInteraction(interaction));
    this.on(Events.GuildUpdate, (oldGuild: Guild, newGuild: Guild) =>
      this.pushGuildEvent(oldGuild, newGuild)
    );
    this.on(Events.GuildMemberUpdate, (oldMember: GuildMember, newMember: GuildMember) =>
      this.pushMemberEvent(oldMember, newMember)
    );
    this.logger.success("Created all listeners !");
    this.emit("functionRunSuccessfully", 1);
  }

  setWorkMode(mode: BotModuleWorkMode) {
    this.workMode = mode;
    return this;
  }

  private onModuleActivated() {
    this.logger.success(`Module acitvated !`);
  }

  abstract pushInteraction(
    interaction:
      | Interaction
      | CommandInteraction
      | ChatInputCommandInteraction
      | ButtonInteraction
      | AutocompleteInteraction
  ): Promise<void>;
  abstract pushMessageEvent(message: Message): Promise<void>;
  abstract pushGuildEvent(oldGuild: Guild, newGuild: Guild): Promise<void>;
  abstract pushMemberEvent(oldMember: GuildMember, newMember: GuildMember): Promise<void>;
}
