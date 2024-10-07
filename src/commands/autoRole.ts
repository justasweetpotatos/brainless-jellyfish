import { PermissionFlagsBits } from "discord.js";
import { ClientSlashCommandBuilder } from "../models/ClientCommand";

module.exports = new ClientSlashCommandBuilder(__filename)
  .setName("auto-role")
  .setDescription("any")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles);
