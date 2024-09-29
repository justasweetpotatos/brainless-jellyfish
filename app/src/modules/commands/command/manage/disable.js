const {
  SlashCommandStringOption,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Colors,
} = require("discord.js");
const { ClientSlashCommandSubcommandBuilder } = require("../../../../models/command");
const { SuwaClient } = require("../../../../client/client");

const iconURL =
  "https://cdn.discordapp.com/attachments/1269194340543107193/1269194910154883144/pngwing.com.png?ex=66af2d5f&is=66addbdf&hm=b77198e21a06b3b586d0b91de107da723eef48829ebf739947914ce594a5ed97&";

module.exports = new ClientSlashCommandSubcommandBuilder(__filename)
  .setName("disable")
  .setDescription("Unload a command for this guild")
  .addStringOption(
    new SlashCommandStringOption()
      .setName("command-name")
      .setDescription("Name of the command")
      .setRequired(true)
      .setAutocomplete(true)
  )
  .setAutoresponseListener(
    "command-name",
    /**
     *
     * @param {AutocompleteInteraction} interaction
     * @param {SuwaClient} client
     */
    async (interaction, client) => {
      const choices = [];
      const focusedValue = interaction.options.getFocused(true);
      const guildSlashCommandManager = client.slashCommandManager.guildSlashCommandManagerCollection.get(
        interaction.guild.id
      );
      guildSlashCommandManager.getCommandNameList().forEach((parts) => {
        choices.push({
          name: parts.join(" ").trimEnd(),
          value: parts.join(" ").trimEnd(),
        });
      });

      let filteredChoices = choices.filter((choice) => choice.name.includes(focusedValue.value));
      await interaction.respond(filteredChoices.slice(0, 25));
    }
  )
  .setExecutor(
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {SuwaClient} client
     */
    async (interaction, client) => {
      const optionValue = interaction.options.get("command-name").value;
      const commandParts = optionValue.split(" ");

      interaction.deferred ? "" : await interaction.deferReply({ ephemeral: true });

      if (client.slashCommandManager.isLockedCommand(commandParts)) {
        const embed = new EmbedBuilder({
          author: { icon_url: iconURL, name: "Locked Bot Command" },
          title: `Command can't be disable by user !`,
          description: `
            -# ***This command was belong to manage guild command group !***

            > *Please contact to bot owner for more infomation or join to: *
            > *https://discord.gg/thien-ha-cua-sua for help !*
            
            `,
          color: Colors.Yellow,
          timestamp: Date.now(),
          footer: {
            // not done yet
            text: `⏳ Ping to server: ${client.getStatus(interaction).latency}ms`,
          },
        });
        await interaction.editReply({ embeds: [embed] });
        return;
      }

      await client.slashCommandManager.guildSlashCommandManagerCollection
        .get(interaction.guild.id)
        .disableCommand(commandParts);
      const embed = new EmbedBuilder({
        author: {
          name: "Disabled Command",
        },
        title: `Command "${optionValue}" was disable successfully !`,
        description: `
            > ***To enable command, please use command "command manager load <command-name>***"
            >
            > *If you have any question, please contact to bot owner for more infomation *
            > *or join to discord https://discord.gg/thien-ha-cua-sua for help !*
        `,
        color: Colors.Green,
        timestamp: Date.now(),
        footer: {
          // not done yet
          text: `⏳ Ping to server: ${client.getStatus(interaction).latency}ms`,
        },
      });
      await interaction.editReply({ embeds: [embed] });
    }
  );
