// Limiting use command rate
if (this.limiter.canProceed(interaction)) {
} else {
  const embed = new EmbedBuilder({
    title: `You are using command too fast !`,
    description: `Please try again after <t:${Math.floor(interaction.createdTimestamp / 1000) + 5}:R>`,
    color: Colors.Yellow,
    timestamp: interaction.createdTimestamp,
  });

  if (builder.deferedCommand) await interaction.editReply({ embeds: [embed] });
}
