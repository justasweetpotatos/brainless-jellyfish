import * as path from "path";
import * as fsnosync from "fs";

const fs = fsnosync.promises;

import {
  Collection,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from "discord.js";
import SuwaClient from "../../bot";
import { Logger } from "../../utils/Logger";

enum CommandLoaderErrorCode {
  INVALID_BUILDER_DATA_TYPE = 101,
  NULL_OR_UNDEFINED_EXECUTOR = 105,
}

const CommandLoaderErrorMessages: Record<CommandLoaderErrorCode, string> = {
  [CommandLoaderErrorCode.INVALID_BUILDER_DATA_TYPE]: "Invalid builder data type",
  [CommandLoaderErrorCode.NULL_OR_UNDEFINED_EXECUTOR]: "Null or undefined executor",
};

class CommandLoaderError extends Error {
  public code: CommandLoaderErrorCode;
  public context: any;

  constructor(message: string, code: CommandLoaderErrorCode, context?: any) {
    super(message);
    this.name = `${CommandLoaderErrorMessages[code]}`;
    this.code = code;
    this.context = context;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CommandLoaderError);
    }
  }
}

class CommandLoader {
  private client: SuwaClient;
  private logger: Logger;
  private mainPath: string = path.join(__dirname, "../../commands");

  public commands: Collection<string, SlashCommandBuilder>;
  public executors: Collection<
    string,
    { type: string; filePath: string; execute: Function; parentPath?: string }
  >;

  constructor(client: SuwaClient) {
    this.client = client;
    this.logger = new Logger("CommandLoader", this.client.logSystem);

    this.commands = new Collection();
    this.executors = new Collection();
  }

  async loadAllCommands() {
    try {
      this.logger.log("Start loading application (/) commands...");

      const commandFileList = await fs.readdir(this.mainPath);

      for (const commandFileName of commandFileList) {
        if (!commandFileName.endsWith(".ts")) continue;
        try {
          await this.loadCommand(commandFileName);
        } catch (error) {
          this.logger.error(`${error}`);
        }
      }

      this.logger.log(`Loaded total ${this.executors.size} command!`);
      this.logger.log(`Total slash command (not include child): ${this.commands.size}`);
    } catch (error) {
      this.logger.error(`${error}`);
    }
  }

  async reloadAllCommands(): Promise<void> {
    try {
      this.logger.log("Start reloading all application (/) commands...");

      const commandFileList = await fs.readdir(this.mainPath);

      for (const commandFileName of commandFileList) {
        if (!commandFileName.endsWith(".ts")) continue;
        try {
          await this.loadCommand(commandFileName);
        } catch (error) {
          this.logger.error(`${error}`);
        }
      }

      this.logger.log(`Loaded total ${this.executors.size} command!`);
      this.logger.log(`Total slash command (not include child): ${this.commands.size}`);
      this.logger.success(`Reloaded commands complete !`);
    } catch (error) {
      this.logger.error(`${error}`);
    }
  }

  async reloadCommand(commandName: string) {
    const command = this.executors.get(commandName);
    if (!command) throw new Error(`No command found with name: ${commandName}`);

    if (!command.parentPath) await this.loadCommand(command.filePath);
    else await this.loadCommand(command.parentPath);
  }

  async loadCommand(filePathOrFileName: string) {
    let commandFilePath: string;
    if (filePathOrFileName.startsWith(this.mainPath)) commandFilePath = filePathOrFileName;
    else commandFilePath = path.join(this.mainPath, filePathOrFileName);

    const { data, execute } = require(commandFilePath);

    if (data instanceof SlashCommandBuilder) {
      if (!execute)
        throw new CommandLoaderError(
          "This command file doesn't have executor !",
          CommandLoaderErrorCode.NULL_OR_UNDEFINED_EXECUTOR
        );

      try {
        const commandDirPath = commandFilePath.replace(".ts", "");
        const subcommandFileList = await fs.readdir(commandDirPath);

        for (const subcommandFileName of subcommandFileList) {
          if (!subcommandFileName.endsWith(".ts")) continue;

          await this.loadSubcommandBuilder(
            data,
            subcommandFileName,
            path.join(commandDirPath, subcommandFileName)
          );
        }

        this.commands.set(data.name, data);
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes("ENOENT")) {
            this.commands.set(data.name, data);
            this.executors.set(data.name, {
              type: (typeof data).toString(),
              filePath: commandFilePath,
              execute: execute,
            });
            console.log(execute);
            console.log(data);
            this.logger.log(`Loaded command with name: ${data.name}`);
          } else throw error;
        }
      }
    } else
      throw new CommandLoaderError(
        `Require SlashCommandBuilder but received ${typeof data}`,
        CommandLoaderErrorCode.NULL_OR_UNDEFINED_EXECUTOR
      );
  }

  async loadSubcommandBuilder(
    builder: SlashCommandBuilder,
    subcommandFileName: string,
    subcommandFilePath: string
  ) {
    const { data, execute } = require(subcommandFilePath);

    if (data instanceof SlashCommandSubcommandBuilder) {
      if (!execute)
        throw new CommandLoaderError(
          `This command file ${subcommandFilePath} doesn't have executor !`,
          CommandLoaderErrorCode.NULL_OR_UNDEFINED_EXECUTOR
        );

      const commandName = `${builder.name} ${data.name}`;

      builder.addSubcommand(data);
      this.executors.set(commandName, {
        type: (typeof data).toString(),
        filePath: subcommandFilePath,
        execute: execute,
        parentPath: subcommandFilePath.replace(subcommandFileName, ""),
      });

      this.logger.log(`Loaded command with name: ${commandName}`);
    } else if (data instanceof SlashCommandSubcommandGroupBuilder) {
      if (!execute)
        throw new CommandLoaderError(
          `This command file ${subcommandFilePath} doesn't have executor !`,
          CommandLoaderErrorCode.NULL_OR_UNDEFINED_EXECUTOR
        );

      const groupDirPath = subcommandFilePath.replace(".ts", "");

      const componentFileList = await fs.readdir(groupDirPath);

      for (const componentFileName of componentFileList) {
        try {
          const componentFilePath = path.join(groupDirPath, componentFileName);
          const componentDataObject = require(componentFilePath);
          const componentData = componentDataObject.data;
          const componentExecutor = componentDataObject.execute;

          if (!componentExecutor)
            throw new CommandLoaderError(
              `This command file ${componentFilePath} doesn't have executor !`,
              CommandLoaderErrorCode.NULL_OR_UNDEFINED_EXECUTOR
            );

          const componentName = `${builder.name} ${data.name} ${componentData.name}`;

          if (componentData instanceof SlashCommandSubcommandBuilder) {
            data.addSubcommand(componentData);
            this.executors.set(componentName, {
              type: (typeof data).toString(),
              filePath: componentFilePath,
              execute: componentExecutor,
              parentPath: subcommandFilePath.replace(subcommandFileName, ""),
            });

            this.logger.log(`Loaded command with name: ${componentName}`);
          } else
            throw new CommandLoaderError(
              `Require SlashCommandBuilder but received ${typeof data}`,
              CommandLoaderErrorCode.NULL_OR_UNDEFINED_EXECUTOR
            );
        } catch (error) {
          if (error instanceof CommandLoaderError) this.logger.warn(`${error.stack}`);
          else throw error;
        }
      }
    }
  }

  commandsToJson(): Array<Object> {
    const array: Array<Object> = [];
    this.commands.forEach((command) => {
      const json = command.toJSON();
      json ? array.push(json) : "";
    });
    return array;
  }
}

export default CommandLoader;
