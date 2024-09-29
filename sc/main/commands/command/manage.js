const {
  ClientSlashCommandSubcommandGroupBuilder,
} = require("../../../../src_v2/typings/command");

module.exports = new ClientSlashCommandSubcommandGroupBuilder(
  __filename,
  __dirname
)
  .setName("manage")
  .setDescription("any");
