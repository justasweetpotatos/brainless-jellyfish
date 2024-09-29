const path = require("path");
const { EmbedBuilder, Colors, ChatInputCommandInteraction } = require("discord.js");
const { SuwaClient } = require("../../client/client");
const { CommandError } = require("./clientError");
const { ClientSlashCommandBuilder } = require("../../models/command");
const { Logger } = require("../logger");

class ErrorHandler {
  /**
   *
   * @param {SuwaClient} client
   */
  constructor(client) {
    this.client = client;
    this.createdTimestamp = new Date();
  }

  // /**
  //  *
  //  * @param {DatabaseError} error
  //  * @param {Logger} logger
  //  */
  // async handleDatabaseError(error, logger) {
  //   logger.error(error.stack);
  // }

  // /**
  //  *
  //  * @param {ClientError} error
  //  * @param {Logger} logger
  //  * @param {import("discord.js").Interaction} interaction
  //  */
  // async handleClientError(error, logger, interaction) {
  //   if (interaction) {
  //     interaction.deferred ? await this.sendCommandErrorInfoToUser(interaction, error) : "";
  //   }

  //   logger.error(error.stack);
  // }

  // /**
  //  *
  //  * @param {CommandError} error
  //  * @param {ChatInputCommandInteraction} [interaction]
  //  */
  // async handleCommandError(error, interaction) {
  //   const commandName = this.client.slashCommandHandler.getCommandFromInteraction(interaction);
  //   await this.sendMessageToClient(error, commandName, interaction);
  //   this.client.slashCommandHandler.logger.error(error.stack);
  // }

  /**
   *
   * @param {{error: CommandError, interaction: ChatInputCommandInteraction, logger: Logger}} error
   */
  async handleSlashCommandError({ error, interaction, logger }) {
    if (interaction) await this.sendCommandErrorMessage(error, interaction);
    logger.error(error.getFullMessage());
  }

  /**
   *
   * @param {CommandError} error
   * @param {ClientSlashCommandBuilder} builder
   * @param {ChatInputCommandInteraction} interaction
   */
  async sendCommandErrorMessage(error, interaction) {
    const commandName = ClientSlashCommandBuilder.getCommandNameStackFromInteraction(interaction, true);

    const endTimestamp = Date.now();
    const embed = new EmbedBuilder({
      title: `An unexpected error occurred !`,
      description: `
        -# ***Please contact to bot owner to report this error !***

        > **\`COMMAND      :\` ${commandName}**
        > **\`ERROR CODE   :\` ${error.code}**
        > **\`DESCRIPTION  :\` ${error.content}**
        > **\`CREATED TIME :\` <t:${Math.floor(interaction.createdTimestamp / 1000)}:f>-<t:${Math.floor(
        interaction.createdTimestamp / 1000
      )}:R>** 
        > **\`DURATION     :\` ${endTimestamp - interaction.createdTimestamp}ms**
      `,
      color: Colors.Red,
      timestamp: endTimestamp,
      footer: {
        // not done yet
        text: `⏳ Ping to server: ${this.client.getStatus(interaction).latency}ms`,
      },
    });

    embed.setAuthor({
      name: "Command Error",
      iconURL:
        "https://cdn.discordapp.com/attachments/1269194340543107193/1269194910154883144/pngwing.com.png?ex=66af2d5f&is=66addbdf&hm=b77198e21a06b3b586d0b91de107da723eef48829ebf739947914ce594a5ed97&",
    });

    // Send to where interaction created.
    if (interaction) {
      interaction.deferred ? "" : await interaction.deferReply({ ephemeral: true });
      await interaction.editReply({ embeds: [embed] });
    }
  }
}

module.exports = { ErrorHandler };
