import {
  ButtonInteraction,
  ChatInputCommandInteraction,
  CommandInteraction,
  InteractionDeferReplyOptions,
} from "discord.js";

export async function autoDeferReplyInteraction(
  interaction: CommandInteraction | ChatInputCommandInteraction | ButtonInteraction,
  options: InteractionDeferReplyOptions
) {
  await interaction.deferReply(options);
}
