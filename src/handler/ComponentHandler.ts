import { ButtonInteraction } from "discord.js";
import SuwaClient from "../bot";
import { Logger } from "../utils/Logger";
import { ClientError, ErrorCode } from "../utils/error/ClientError";

class ComponentHandler {
  private readonly client: SuwaClient;
  private readonly logger: Logger;
  constructor(client: SuwaClient) {
    this.client = client;
    this.logger = new Logger("component-handler", client.logSystem);
  }

  async executeButtonInteraction(interaction: ButtonInteraction) {
    try {
      const buttonData = this.client.componentManager.getButtonData(interaction.customId);
      await buttonData.execute(this.client, interaction);
    } catch (error) {
      await this.client.errorHandler.handleButtonError({ error: error, logger: this.logger });
    }
  }
}

export default ComponentHandler;
