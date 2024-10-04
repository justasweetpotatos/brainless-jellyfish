import { ButtonInteraction, ChatInputCommandInteraction, Colors, EmbedBuilder } from "discord.js";
import SuwaClient from "../../bot";
import { ClientError, ErrorCode } from "./ClientError";
import { Logger } from "../Logger";
import { ClientSlashCommandBuilder } from "../../models/ClientCommand";
import { ButtonErrorData, CommandErrorData } from "../../interfaces/ErrorData";

class ClientErrorHandler {
  private readonly client: SuwaClient;
  private readonly createdTimestamp: Date;
  constructor(client: SuwaClient) {
    this.client = client;
    this.createdTimestamp = new Date();
  }

  async handleSlashCommandError(data: CommandErrorData) {
    const clientError =
      data.error instanceof ClientError
        ? data.error
        : data.error instanceof Error
        ? new ClientError(data.error.message, ErrorCode.EXECUTE_COMMAND_FAILED, data.error)
        : new ClientError("An unknown error occurred", ErrorCode.UNKNOWN_ERROR);

    if (data.interaction) await this.sendCommandErrorMessage(clientError, data.interaction);
    data.logger.error(clientError.createMessage());
  }

  async handleButtonError(data: ButtonErrorData) {
    const clientError =
      data.error instanceof ClientError
        ? data.error
        : data.error instanceof Error
        ? new ClientError(data.error.message, ErrorCode.EXECUTE_COMMAND_FAILED, data.error)
        : new ClientError("An unknown error occurred", ErrorCode.UNKNOWN_ERROR);

    if (data.interaction) await this.sendButtonErrorMessage(clientError, data.interaction);
    data.logger.error(clientError.createMessage());
  }

  async sendButtonErrorMessage(error: ClientError, interaction: ButtonInteraction) {
    const endTimestamp = Date.now();
    const embed = new EmbedBuilder({
      title: `An unexpected error occurred !`,
      description: `
        -# ***Please contact to bot owner to report this error !***

        > **\`BUTTON ID    :\` ${interaction.customId}**
        > **\`ERROR CODE   :\` ${error.code}**
        > **\`DESCRIPTION  :\` ${error.baseMessage}**
        > **\`CREATED TIME :\` <t:${Math.floor(interaction.createdTimestamp / 1000)}:f>-<t:${Math.floor(
        interaction.createdTimestamp / 1000
      )}:R>** 
        > **\`DURATION     :\` ${endTimestamp - interaction.createdTimestamp}ms**
      `,
      color: Colors.Red,
      timestamp: endTimestamp,
      footer: {
        // not done yet ${this.client.getStatus(interaction).latency}
        text: `⏳ Ping to server: ms`,
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

  async sendCommandErrorMessage(error: ClientError, interaction: ChatInputCommandInteraction) {
    const commandName = ClientSlashCommandBuilder.getCommandStackName(interaction, true);

    const endTimestamp = Date.now();
    const embed = new EmbedBuilder({
      title: `An unexpected error occurred !`,
      description: `
        -# ***Please contact to bot owner to report this error !***

        > **\`COMMAND      :\` ${commandName}**
        > **\`ERROR CODE   :\` ${error.code}**
        > **\`DESCRIPTION  :\` ${error.baseMessage}**
        > **\`CREATED TIME :\` <t:${Math.floor(interaction.createdTimestamp / 1000)}:f>-<t:${Math.floor(
        interaction.createdTimestamp / 1000
      )}:R>** 
        > **\`DURATION     :\` ${endTimestamp - interaction.createdTimestamp}ms**
      `,
      color: Colors.Red,
      timestamp: endTimestamp,
      footer: {
        // not done yet ${this.client.getStatus(interaction).latency}
        text: `⏳ Ping to server: ms`,
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

export { ClientErrorHandler };
