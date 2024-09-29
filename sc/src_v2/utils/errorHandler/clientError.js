class ClientError extends Error {
  static UNKNOWN_ERROR = Object.freeze("C_1000");

  /**
   *
   * @param {string} [message] - The message addon
   * @param {string} [stack] - The stack from other error
   * @param {string} [code] - Static
   */
  constructor(message, stack, code) {
    super(message, stack);
    this.code = code ? code : ClientError.defaultCodes.UNKNOWN_ERROR;
    this.name = this.constructor.name;
    this.throwedStack = stack;
  }

  /**
   *
   * @param {boolean} [getStack] - If true, create message with stack (Include default message)
   * @returns {string}
   */
  getMessage(getStack) {
    return `${CommandError.defaultMessages[this.code]}: \n${getStack ? this.stack : this.message}`;
  }
}

class CommandError extends ClientError {
  // Client network error
  static INTERACTION_NOT_FOUND = Object.freeze("CM_1000");
  static MESSSAGE_NOT_FOUND = Object.freeze("CM_1001");
  static USER_NOT_FOUND = Object.freeze("CM_1002");

  // Client process error
  static LOAD_COMMAND_FAILED = Object.freeze("CM_1100");
  static REGISTER_COMMAND_FAILED = Object.freeze("CM_1101");
  static DISABLE_COMMAND_FAILED = Object.freeze("CM_1102");
  static ENABLE_COMMAND_FAILED = Object.freeze("CM_1103");
  static REFRESH_COMMAND_FAILED = Object.freeze("CM_1104");
  static EXECUTE_COMMAND_FAILED = Object.freeze("CM_1105");
  static EXECUTE_AUTOCOMPLETE_RESPONSE_FAILED = Object.freeze("CM_1106");

  // Type error
  static INVAVID_COMMAND_BUILDER_TYPE = Object.freeze("CM_1107");

  /**
   *
   * @param {string} code Command error code
   * @returns {string}
   */
  static getMessage(code) {
    const messages = Object.freeze({
      [CommandError.LOAD_COMMAND_FAILED]: "Load command failed",
      [CommandError.REGISTER_COMMAND_FAILED]: "Register command failed",
      [CommandError.DISABLE_COMMAND_FAILED]: "Disable command failed",
      [CommandError.ENABLE_COMMAND_FAILED]: "Enable command failed",
      [CommandError.REFRESH_COMMAND_FAILED]: "Refresh command failed",
      [CommandError.EXECUTE_COMMAND_FAILED]: "Execute command failed",
    });

    return messages[code];
  }
}

class EventError extends ClientError {
  static LOAD_EVENT_FAILED = Object.freeze("EV_1100");
  static REGISTER_EVENT_FAILED = Object.freeze("EV_1101");
  static EXECUTE_EVENT_FAILED = Object.freeze("EV_1102");

  /**
   *
   * @param {string} code Command error code
   * @returns {string}
   */
  static getMessage(code) {
    const messages = Object.freeze({
      [EventError.LOAD_EVENT_FAILED]: "LOAD_EVENT_FAILED",
      [EventError.REGISTER_EVENT_FAILED]: "REGISTER_EVENT_FAILED",
      [EventError.EXECUTE_EVENT_FAILED]: "EXECUTE_EVENT_FAILED",
    });

    return messages[code];
  }
}

class DatabaseError extends ClientError {
  static codes = Object.freeze({});

  static defaultMessages = Object.freeze({});
}

module.exports = { ClientError, EventError, CommandError };
