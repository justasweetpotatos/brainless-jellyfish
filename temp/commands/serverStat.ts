import { ActionRowBuilder, ButtonBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import SuwaClient from "../../src/bot";
import { ClientSlashCommandBuilder } from "../models/ClientCommand";
import { autoDeferReply, createEmbedWithTimestampAndCreateUser } from "../utils/functions";

module.exports = new ClientSlashCommandBuilder(__filename)
  .setName("guild-info")
  .setDescription("Display the infomation of guild.")
  .setExecutor(async (client: SuwaClient, interaction: ChatInputCommandInteraction) => {
    await autoDeferReply(interaction);
    const replyEmbed = createEmbedWithTimestampAndCreateUser(interaction).setColor("Blurple");
    const closeButton: ButtonBuilder = require("../components/buttons/general/CloseButton");
    const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(closeButton);
    const guild = interaction.guild;

    if (!guild) return;

    const bots = (await guild.members.fetch()).filter((member) => member.user.bot);
    const role = await guild.roles.fetch();

    replyEmbed.setAuthor({ name: guild.name, iconURL: guild.iconURL() ?? undefined });
    replyEmbed.setThumbnail(guild.iconURL());
    replyEmbed.setColor("Blurple");
    replyEmbed.setTitle(`Guild id: ${guild?.id}`);
    replyEmbed.setDescription(`
        **Basic infomaintion:**

        > **\`OWNER      :\` <@${guild.ownerId}>**
        > **\`MEMBERS    :\` ${guild.memberCount}**
        > **\`BOTS       :\` ${bots.size}**
        > **\`BOOSTS     :\` ${guild.premiumSubscriptionCount}**
        > **\`CREATED AT :\` <t:${(guild.createdTimestamp / 1000).toFixed(0)}:f>**
        > **\`ROLES      :\` ${role.size}**

        *Provided by Suwa Bot.*
    `);
    replyEmbed.setImage(guild.bannerURL({ size: 4096 }));

    await interaction.editReply({ embeds: [replyEmbed], components: [actionRow] });
  });
