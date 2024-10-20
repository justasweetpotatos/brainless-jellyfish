import { ButtonInteraction } from "discord.js";
import { Logger } from "../utils/Logger";
import SuwaBot from "../bot/SuwaBot";

class ComponentHandler {
  private readonly client: SuwaBot;
  private readonly logger: Logger;
  constructor(client: SuwaBot) {
    this.client = client;
    this.logger = new Logger("component-handler", client.logPrinter);
  }

  async executeButtonInteraction(interaction: ButtonInteraction) {
    try {
      if (!interaction.guild) return;

      // if (interaction.customId.startsWith(AutoRoleButtonCustomId.AUTOROLE_BUTTON)) {
      //   const manager = this.client.autoRoleManager.callGuildManager(interaction.guild);
      //   await manager.executeButtonInteraction(interaction);
      // } else if (interaction.customId.startsWith(AutoRoleButtonCustomId.REMOVING_BUTTON)) {
      //   const manager = this.client.autoRoleManager.callGuildManager(interaction.guild);
      //   await manager.executeRemoveActionButtonInteraction(interaction);
      // } else if (interaction.customId.startsWith("preview")) {
      //   await interaction.deferReply({ ephemeral: true });
      //   await interaction.editReply({ content: "Preview mode: true" });
      // } else {
      //   const buttonData = this.client.componentManager.getButtonData(interaction.customId);
      //   await buttonData.execute(this.client, interaction);
      // }
    } catch (error) {
      // await this.client.errorHandler.handleButtonError({ error: error, logger: this.logger });
    }
  }
}

export default ComponentHandler;