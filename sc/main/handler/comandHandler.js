const path = requre("path");
const fs = require("fs");
const {
  ClientSlashCommandBuilder,
  ClientSlashCommandSubcommandBuilder,
} = require("../../../src_v2/typings/command");
const { Collection, Client, Routes } = require("discord.js");

class CommandHandler {
  /**
   *
   * @param {Client} client
   */
  constructor(client) {
    this.client = client;
    this.commandFolder = path.join(__dirname, "them vao sau");

    this.commands = new Collection();
    this.commandJSONArray = [];
  }

  loadFolder() {
    // If folder is not exist, create new folder.
    if (!fs.existsSync(this.commandFolder))
      throw new Error("No command folder found, warning !");

    fs.readdirSync(this.commandFolder).forEach((file) => {
      try {
        if (!file.endsWith(".js")) return;

        const builder = require(file);
        if (builder instanceof ClientSlashCommandBuilder) {
          if (builder.isExecuted)
            this.commands.set(builder.name, builder.executor);
          this.commandJSONArray.push(builder.toJSON());
        } else
          throw new TypeError("Builder must be ClientSlashCommandBuilder.");
      } catch (error) {
        console.log(error);
      }
    });
  }

  /**
   * Not done yet
   * Refreshing application slash command for each guild
   */
  async registerCommands() {
    const guildRoute = Routes.applicationGuildCommands();

    await this.client.rest.put();
  }
}
