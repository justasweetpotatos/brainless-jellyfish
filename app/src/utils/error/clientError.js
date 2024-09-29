class ClientError extends Error {
  static UNKNOWN_ERROR = Object.freeze("1000");
  // static LOAD_FAILED = Object.freeze("1001");
  // static REGISTER_FAILED = Object.freeze("1002");
  // static EXECUTE_FUNCTION_FAILED = Object.freeze("1003");
  static INVALID_VARIABLE_TYPE = Object.freeze("1004");

  static messages = {
    [ClientError.UNKNOWN_ERROR]: "Unknow error",
    [ClientError.INVALID_VARIABLE_TYPE]: "The variable entered is invalid.",
  };

  static labels = {
    [ClientError.UNKNOWN_ERROR]: "UNKNOWN_ERROR",
    [ClientError.INVALID_VARIABLE_TYPE]: "INVALID_VARIABLE_TYPE",
  };

  /**
   * @param {{code: string, content?: string | undefined, stack?: string}} options
   */
  constructor({ stack = undefined, content, code }) {
    super();
    this.content = content;
    this.code = code || ClientError.defaultCodes.UNKNOWN_ERROR;
    this.throwedStack = stack;
  }

  /**
   *
   * @param {boolean} getStack - If true, create message with stack (Include default message). If empty, the default is true.
   * @returns {string}
   */
  getFullMessage(getStack = true) {
    return `${ClientError.labels[this.code]} ${ClientError.messages[this.code]}. ${this.content ? this.content : ""}\n
      ${getStack ? `${this.throwedStack}\n${this.stack}\n` : "\n"}`;
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
  static EXECUTE_AUTOCOMPLETE_FAILED = Object.freeze("CM_1106");
  static BUILDER_NOT_FOUND = Object.freeze("CM_1107");
  static EMPTY_COMMAND_OPTION = Object.freeze("CM_1108");
  static EXECUTOR_IS_UNDEFINED = Object.freeze("CM_1109");
  static COMMAND_OPTION_NOT_FOUND = Object.freeze("CM_1110");

  // Folder
  static MODULES_FOLDER_NOT_FOUND = Object.freeze("CM_1200");

  // Messages
  static labels = {
    ...ClientError.labels,

    [CommandError.INTERACTION_NOT_FOUND]: "",
    [CommandError.MESSSAGE_NOT_FOUND]: "",
    [CommandError.USER_NOT_FOUND]: "",

    [CommandError.LOAD_COMMAND_FAILED]: "LOAD_COMMAND_FAILED",
    [CommandError.REGISTER_COMMAND_FAILED]: "REGISTER_COMMAND_FAILED",
    [CommandError.DISABLE_COMMAND_FAILED]: "DISABLE_COMMAND_FAILED",
    [CommandError.ENABLE_COMMAND_FAILED]: "ENABLE_COMMAND_FAILED",
    [CommandError.REFRESH_COMMAND_FAILED]: "REFRESH_COMMAND_FAILED",
    [CommandError.EXECUTE_COMMAND_FAILED]: "EXECUTE_COMMAND_FAILED",
    [CommandError.EXECUTE_AUTOCOMPLETE_FAILED]: "EXECUTE_AUTOCOMPLETE_FAILED",
    [CommandError.BUILDER_NOT_FOUND]: "BUILDER_NOT_FOUND",
    [CommandError.EMPTY_COMMAND_OPTION]: "EMPTY_COMMAND_OPTION",
    [CommandError.EXECUTOR_IS_UNDEFINED]: "EXECUTOR_IS_UNDEFINED",
    [CommandError.COMMAND_OPTION_NOT_FOUND] : "COMMAND_OPTION_NOT_FOUND",

    [CommandError.MODULES_FOLDER_NOT_FOUND]: "MODULES_FOLDER_NOT_FOUND",
  };

  static messages = {
    ...ClientError.messages,

    [CommandError.INTERACTION_NOT_FOUND]: "Interaction is not found or expired",
    [CommandError.MESSSAGE_NOT_FOUND]: "Message is not found",
    [CommandError.USER_NOT_FOUND]: "User is not found",

    [CommandError.LOAD_COMMAND_FAILED]: "Load command failed",
    [CommandError.REGISTER_COMMAND_FAILED]: "Register command failed",
    [CommandError.DISABLE_COMMAND_FAILED]: "Disable command failed",
    [CommandError.ENABLE_COMMAND_FAILED]: "Enable command failed",
    [CommandError.REFRESH_COMMAND_FAILED]: "Refresh command failed",
    [CommandError.EXECUTE_COMMAND_FAILED]: "Execute command failed",
    [CommandError.EXECUTE_AUTOCOMPLETE_FAILED]: "Execute autocompleted failed",
    [CommandError.BUILDER_NOT_FOUND]: "Builder not found",
    [CommandError.EMPTY_COMMAND_OPTION]: "Command option is empty",
    [CommandError.EXECUTOR_IS_UNDEFINED]: "Executor is undefined, somethings has wrong.",
    [CommandError.COMMAND_OPTION_NOT_FOUND] : "Command option is not found",

    // Folder
    [CommandError.MODULES_FOLDER_NOT_FOUND]: "Modules folder not found",
  };

  /**
   *
   * @param {boolean} getStack - If true, create message with stack (Include default message). If empty, the default is true.
   * @returns {string}
   */
  getFullMessage(getStack = true) {
    this.message = CommandError.messages[this.code];
    return `${CommandError.labels[this.code]} ${this.message}. ${this.content ? this.content : ""}
      ${getStack ? `${this.throwedStack}\n${this.stack}\n` : "\n"}`;
  }
}

class EventError extends ClientError {
  static LOAD_EVENT_FAILED = Object.freeze("EV_1100");
  static REGISTER_EVENT_FAILED = Object.freeze("EV_1101");
  static EXECUTE_EVENT_FAILED = Object.freeze("EV_1102");
  static INVALID_EVENT_NAME = Object.freeze("EV_1103");
  static INVALID_EVENT_EXECUTOR = Object.freeze("EV_1104");

  static labels = {
    ...CommandError.labels,

    [EventError.LOAD_EVENT_FAILED]: "LOAD_EVENT_FAILED",
    [EventError.REGISTER_EVENT_FAILED]: "REGISTER_EVENT_FAILED",
    [EventError.EXECUTE_EVENT_FAILED]: "EXECUTE_EVENT_FAILED",
    [EventError.INVALID_EVENT_NAME]: "INVALID_EVENT_NAME",
    [EventError.INVALID_EVENT_EXECUTOR]: "INVALID_EVENT_EXECUTOR",
  };

  static messages = {
    ...CommandError.messages,

    [EventError.LOAD_EVENT_FAILED]: "Event loading failed",
    [EventError.REGISTER_EVENT_FAILED]: "Event register failed",
    [EventError.EXECUTE_EVENT_FAILED]: "Event run executor failed",
    [EventError.INVALID_EVENT_NAME]: "Event name is invalid",
    [EventError.INVALID_EVENT_EXECUTOR]: "Event executor is not a function",
  };

  /**
   *
   * @param {boolean} getStack - If true, create message with stack (Include default message). If empty, the default is true.
   * @returns {string}
   */
  getFullMessage(getStack = true) {
    this.message = EventError.messages[this.code];
    return `${EventError.labels[this.code]} ${this.message} ${this.content ? this.content : ""}\n
      ${getStack ? `${this.throwedStack}\n${this.stack}\n` : "\n"}`;
  }
}

class DatabaseError extends ClientError {
  static codes = Object.freeze({});

  static defaultMessages = Object.freeze({});
}

module.exports = { ClientError, EventError, CommandError };
