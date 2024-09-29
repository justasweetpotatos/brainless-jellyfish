const path = require("path");
const {
  EmbedBuilder,
  Colors,
  CommandInteraction,
  AutocompleteInteraction,
  Guild,
  ChatInputCommandInteraction,
} = require("discord.js");
const { SuwaClient } = require("../../client/bot");
const { CommandError, ClientError } = require("./clientError");
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

  /**
   *
   * @param {DatabaseError} error
   * @param {Logger} logger
   */
  async handleDatabaseError(error, logger) {
    logger.error(error.stack);
  }

  /**
   *
   * @param {ClientError} error
   * @param {Logger} logger
   * @param {import("discord.js").Interaction} interaction
   */
  async handleClientError(error, logger, interaction) {
    if (interaction) {
      interaction.deferred ? await this.sendCommandErrorInfoToUser(interaction, error) : "";
    }

    logger.error(error.stack);
  }

  /**
   *
   * @param {CommandError} error
   * @param {ChatInputCommandInteraction} [interaction]
   */
  async handleCommandError(error, interaction) {
    const commandName = this.client.slashCommandHandler.getCommandFromInteraction(interaction);
    await this.sendMessageToClient(error, commandName, interaction);
    this.client.slashCommandHandler.logger.error(error.stack);
  }

  /**
   *
   * @param {CommandError} error
   * @param {string} commandName
   * @param {ChatInputCommandInteraction} interaction
   */
  async sendMessageToClient(error, commandName, interaction) {
    const endTimestamp = Date.now();
    const embed = new EmbedBuilder({
      title: `An unexpected error occurred !`,
      description: `
        Please contact to admin to report this error !
        
        > **\`COMMAND      :\` ${commandName}**
        > **\`ERROR CODE   :\` ${error.code}**
        > **\`DESCRIPTION  :\` ${error}**
        > **\`CREATED TIME :\` <t:${Math.floor(interaction.createdTimestamp / 1000)}:f>**
        > **\`AGO          :\` <t:${Math.floor(interaction.createdTimestamp / 1000)}:R>**
        > **\`DURATION     :\` ${endTimestamp - interaction.createdTimestamp}ms**
      `,
      color: Colors.Red,
      timestamp: endTimestamp,
      footer: {
        text: `⏳ Ping to server: ${(endTimestamp - interaction.createdTimestamp) * 2}ms`,
      },
    });
    embed.setThumbnail(
      "https://cdn.discordapp.com/attachments/1269194340543107193/1269194910154883144/pngwing.com.png?ex=66af2d5f&is=66addbdf&hm=b77198e21a06b3b586d0b91de107da723eef48829ebf739947914ce594a5ed97&"
    );

    // Send to where interaction created.
    if (interaction) {
      interaction.deferred ? "" : await interaction.deferReply({ fetchReply: true });
      await interaction.editReply({ embeds: [embed] });
    }

    // Send to log bot channel.
  }
}

module.exports = { ErrorHandler };
