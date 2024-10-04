import { ButtonInteraction, ChatInputCommandInteraction, Colors, EmbedBuilder, Interaction } from "discord.js";
import SuwaClient from "../../bot";
import { ClientError, ErrorCode } from "./ClientError";
import { ClientSlashCommandBuilder } from "../../models/ClientCommand";
import { ButtonErrorData, CommandErrorData, EventErrorData } from "../../interfaces/ErrorData";

const dangerIconUrl =
  "https://cdn.discordapp.com/attachments/1269194340543107193/1269194910154883144/pngwing.com.png?ex=66af2d5f&is=66addbdf&hm=b77198e21a06b3b586d0b91de107da723eef48829ebf739947914ce594a5ed97&";

class ClientErrorHandler {
  private readonly client: SuwaClient;
  private readonly createdTimestamp: Date;
  constructor(client: SuwaClient) {
    this.client = client;
    this.createdTimestamp = new Date();
  }

  identifyError(error: ClientError | unknown): ClientError {
    return error instanceof ClientError
      ? error
      : error instanceof Error
      ? new ClientError(error.message, ErrorCode.UNKNOWN_ERROR, error)
      : new ClientError("An unknown error occurred", ErrorCode.UNKNOWN_ERROR);
  }

  async handleSlashCommandError(data: CommandErrorData) {
    const clientError = this.identifyError(data.error);

    if (data.interaction) await this.sendCommandErrorMessage(clientError, data.interaction);
    data.logger.error(clientError.createMessage());
  }

  async handleButtonError(data: ButtonErrorData) {
    const clientError = this.identifyError(data.error);

    if (data.interaction) await this.sendButtonErrorMessage(clientError, data.interaction);
    data.logger.error(clientError.createMessage());
  }

  async handleEventError(data: EventErrorData) {
    const clientError = this.identifyError(data.error);

    if (data.interaction) await this.sendEventErrorMessage(clientError, data.interaction);
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
      iconURL: dangerIconUrl,
    });

    // Send to where interaction created.
    if (interaction) {
      interaction.deferred ?? (await interaction.deferReply({ ephemeral: true }));
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
      iconURL: dangerIconUrl,
    });

    // Send to where interaction created.
    if (interaction) {
      interaction.deferred ? "" : await interaction.deferReply({ ephemeral: true });
      await interaction.editReply({ embeds: [embed] });
    }
  }

  async sendEventErrorMessage(error: ClientError, interaction?: Interaction) {}
}

export { ClientErrorHandler };
