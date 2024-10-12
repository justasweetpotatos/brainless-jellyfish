const fs = require("fs");
const logger = require("../utils/logger");
const { Client } = require("discord.js");
const path = require("path");

/**
 *
 * @param {Client} client
 */
module.exports = (client) => {
  client.handleEvents = async () => {
    logger.log.eventRegiter(`Handling events progress...`);

    const eventFolder = path.join(__dirname, "../events")

    const eventFolders = fs.readdirSync(eventFolder);
    for (const folder of eventFolders) {
      const eventFiles = fs.readdirSync(path.join(eventFolder, folder)).filter((file) => file.endsWith(".js"));

      switch (folder) {
        case "client":
          for (const file of eventFiles) {
            const event = require(`../events/${folder}/${file}`);
            if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
            else client.on(event.name, (...args) => event.execute(...args, client));
            logger.log.eventRegiter(`Event "${file}" loaded successfully.`);
          }
          break;
        case "noichu":
          for (const file of eventFiles) {
            const event = require(`../events/${folder}/${file}`);
            if (event.name && event.execute) {
              if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
              else client.on(event.name, (...args) => event.execute(...args, client));

              logger.log.eventRegiter(`Event "${file}" loaded successfully.`);
            } else logger.errors.eventRegiter(`Invalid event file: ${file}. Missing required properties.`);
          }
          break;
        case "prefixCommands":
          for (const file of eventFiles) {
            const event = require(`../events/${folder}/${file}`);
            if (event.name && event.execute) {
              if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
              else client.on(event.name, (...args) => event.execute(...args, client));
              logger.log.eventRegiter(`Event "${file}" loaded successfully.`);
            } else logger.errors.eventRegiter(`Invalid event file: ${file}. Missing required properties.`);
          }
          break;
        case "guild":
          for (const file of eventFiles) {
            const event = require(`../events/${folder}/${file}`);
            if (event.once) {
              client.once(event.name, (...args) => event.execute(...args, client));
              logger.log.eventRegiter(`Event "${event.name}" loaded successfully.`);
            } else {
              client.on(event.name, (...args) => event.execute(...args, client));
            }
          }
          break;
        // Add additional cases for other event folders if needed
      }
    }
  };
};
