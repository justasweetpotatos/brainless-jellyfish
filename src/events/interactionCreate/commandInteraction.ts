import { CommandInteraction } from "discord.js";
import SuwaClient from "../../bot";

module.exports = {
  name: "CommandInteraction",
  async execute(interaction: CommandInteraction, client: SuwaClient) {
    client.comManager.executeCommand(interaction);
  },
};
