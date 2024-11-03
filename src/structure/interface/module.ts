import { Collection } from "discord.js";
import SuwaBot from "../../bot/SuwaBot";

export interface BaseModuleOptions {
  name: string;
}

export interface BotModuleOptions extends BaseModuleOptions {
  client: SuwaBot;
}

export type BotModuleWorkMode = "mainternance" | "debug" | "disable" | "enable";

export interface MessageDataMTF {
  readonly id: string;
  readonly createdTimestamp: number;
}

export interface UserDataMTF {
  readonly id: string;
  messages: Array<MessageDataMTF>;
}

export interface GuildDataNodeMTF {
  readonly timeBySeconds: number;
  readonly timeByMinutes: number;
  readonly timeByHours: number;
  counter: number;
  userData: Map<string, UserDataMTF>;
}

export interface GuildDataMTF {
  readonly id: string;
  nodeMap: Collection<number, GuildDataNodeMTF>;
  lastNode: GuildDataNodeMTF;
}
