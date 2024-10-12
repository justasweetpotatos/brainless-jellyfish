const { readdirSync } = require("fs");
const logger = require("../utils/logger");
const path = require("path");

module.exports = (client) => {
  client.handleComponents = async () => {
    logger.log.component(`Handling commands progress...`);

    const compnentFolder = path.join(__dirname, "../components");

    const typeOfComponentNameList = readdirSync(compnentFolder);

    for (const typeOfComponentName of typeOfComponentNameList) {
      const listPackName = readdirSync(path.join(__dirname, `../components/${typeOfComponentName}`));
      for (const packName of listPackName) {
        const listFileName = readdirSync(path.join(__dirname, `../components/${typeOfComponentName}/${packName}`));
        switch (typeOfComponentName) {
          case "buttons":
            for (const file of listFileName) {
              const button = require(`../components/${typeOfComponentName}/${packName}/${file}`);
              client.buttons.set(button.data.customId, button);
              logger.log.component(`Button "${button.data.label}" has passed handler !`);
            }
            break;
          case "selectMenus":
            for (const file of listFileName) {
              const menu = require(`../components/${typeOfComponentName}/${packName}/${file}`);
              client.selectMenus.set(menu.data.customId, menu);
              logger.log.component(`Menu "${menu.data.customId}" has passed handler !`);
            }
            break;
          default:
            break;
        }
      }
    }
  };
};
