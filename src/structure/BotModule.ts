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
  public readonly ModuleTrafficReceivedCounter: Collection<number, number>;

  public workMode: BotModuleWorkMode;

  constructor(options: T) {
    super(options);

    this.createdTimestamp = Date.now();
    this.client = options.client;
    this.logger = new Logger(options.name, options.client.logPrinter);
    this.ModuleTrafficReceivedCounter = new Collection();
    this.workMode = "enable";

    this.on("moduleActivated", this.onModuleActivated);
  }

  /**
   * Initialization emitting events
   */
  async activateModule(): Promise<boolean> {
    this.on(Events.MessageCreate, (message: Message) => this.pushMessageEvent(message));
    this.on(Events.InteractionCreate, (interaction: Interaction) => this.pushInteraction(interaction));
    this.on(Events.GuildUpdate, (oldGuild: Guild, newGuild: Guild) => this.pushGuildEvent(oldGuild, newGuild));
    this.on(Events.GuildMemberUpdate, (oldMember: GuildMember, newMember: GuildMember) =>
      this.pushMemberEvent(oldMember, newMember)
    );

    this.emit("moduleActivated");
    return true;
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
