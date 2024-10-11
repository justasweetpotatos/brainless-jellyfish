import { PermissionFlagsBits } from "discord.js";
import ClientSlashCommandBuilder from "../structures/ClientSlashCommandBuilder";

module.exports = new ClientSlashCommandBuilder(__filename)
  .setName("purge")
  .setDescriptionLocalization("vi", "xóa-tin-nhắn")
  .setDescription("any")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);
