import { Message, Interaction } from "discord.js";
import { BotModule } from "../structure/BotModule";
import { BotModuleOptions } from "../structure/interface/module";

interface EventManagerModuleOptions extends BotModuleOptions {}

export class EventManagerModule extends BotModule<EventManagerModuleOptions> {
  constructor(options: EventManagerModuleOptions) {
    super(options);
  }

  async pushInteraction(interaction: Interaction): Promise<void> {
    return;
  }

  async pushMessageEvent(message: Message): Promise<void> {
    return;
  }

  pushGuildEvent(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  pushMemberEvent(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
