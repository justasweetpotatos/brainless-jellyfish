const path = require("path");
const fs = require("fs");

const file = path.join(__dirname, "/src/structure/moduleData/EnglishDictionary_src-unknow.json");

const dictionary = require(file);
const newDictionary = {};

Object.keys(dictionary).forEach((key) => {
  if (!newDictionary[key.charAt(0)]) {
    newDictionary[key.charAt(0)] = { [key]: { source: "unknow" }, data_counter: 0 };
  } else {
    newDictionary[key.charAt(0)][key] = { source: "unknow" };
    newDictionary[key.charAt(0)].data_counter += 1;
  }
});

fs.writeFileSync(file, JSON.stringify(newDictionary, null, 2));
