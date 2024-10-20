import SuwaBot from "../../bot/SuwaBot";

export interface BaseModuleOptions {
  name: string;
}

export interface BotModuleOptions extends BaseModuleOptions {
  client: SuwaBot;
}

export type BotModuleWorkMode = "mainternance" | "debug" | "disable" | "enable";
