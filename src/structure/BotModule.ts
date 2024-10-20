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
  Message,
} from "discord.js";

export abstract class BotModule extends BaseModule<BotModuleOptions> {
  private readonly client: SuwaBot;
  private readonly logger: Logger;
  public readonly createdTimestamp: number;
  public readonly ModuleTrafficReceivedCounter: Collection<number, number>;

  public workMode: BotModuleWorkMode;

  constructor(options: BotModuleOptions) {
    super(options);

    this.createdTimestamp = Date.now();
    this.client = options.client;
    this.logger = new Logger(options.name, options.client.logPrinter);
    this.ModuleTrafficReceivedCounter = new Collection();
    this.workMode = "enable";
  }

  abstract activateModule(): void;

  setWorkMode(mode: BotModuleWorkMode) {
    this.workMode = mode;
    return this;
  }

  abstract pushInteraction(
    interaction: CommandInteraction | ChatInputCommandInteraction | ButtonInteraction | AutocompleteInteraction
  ): Promise<void>;
  abstract pushMessageEvent(message: Message): Promise<void>;
  abstract pushGuildEvent(): Promise<void>;
  abstract pushMemberEvent(): Promise<void>;
}
