const { Events } = require("discord.js");
const { EventError } = require("../utils/error/clientError");

class EventBuilder {
  constructor(filename) {
    this.filename = filename;

    this.name = "";
  }

  /**
   * 
   * @param {string} name 
   */
  setName(name) {
    if (!Events[name]) throw new EventError("Event name not !", null, EventError.UNKNOWN_ERROR);

    this.name = name;
  }
}
