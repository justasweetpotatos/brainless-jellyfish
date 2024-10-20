import { PermissionFlagsBits } from "discord.js";
import { ClientSlashCommandBuilder } from "../models/ClientCommand";

module.exports = new ClientSlashCommandBuilder(__filename)
  .setName("purge")
  .setDescriptionLocalization("vi", "xóa-tin-nhắn")
  .setDescription("any")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);
