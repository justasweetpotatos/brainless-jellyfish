import { ButtonInteraction, ChatInputCommandInteraction, Interaction } from "discord.js";
import { ClientError } from "../utils/error/ClientError";
import { Logger } from "../utils/Logger";

export interface CommandErrorData {
  error: ClientError | unknown;
  logger: Logger;
  interaction?: ChatInputCommandInteraction;
}

export interface ButtonErrorData {
  error: ClientError | unknown;
  logger: Logger;
  interaction?: ButtonInteraction;
}

export interface EventErrorData {
  error: ClientError | unknown;
  logger: Logger;
  interaction?: Interaction;
}
