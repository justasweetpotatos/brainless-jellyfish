import { User } from "discord.js";

export interface searchMessageOptions {
  amount: number;
  substring?: string;
  target?: User;
  isBot?: boolean;
  includeAttachments?: boolean;
  includeEmbed?: boolean;
  before?: string;
  after?: string;
}
