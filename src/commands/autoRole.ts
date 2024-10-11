import { PermissionFlagsBits } from "discord.js";
import ClientSlashCommandBuilder from "../structures/ClientSlashCommandBuilder";

module.exports = new ClientSlashCommandBuilder(__filename)
  .setName("autorole")
  .setDescription("any")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles);
