import { ErrorCode, ErrorMessage } from "./ClientErrorCode";

class ClientError extends Error {
  public readonly code: string;
  public readonly baseMessage: string;
  public readonly cause?: Error;

  constructor(message: string, code: ErrorCode, cause?: Error) {
    super(message);
    this.code = code;
    this.cause = cause;
    this.baseMessage = ErrorMessage[code];

    // Set the prototype explicitly
    Object.setPrototypeOf(this, ClientError.prototype);
  }

  createMessage(getStack: boolean = true): string {
    const stackInfo = `${this.stack}${this.cause ? `\n${this.cause.stack}` : ""}`;
    return `${this.code}: ${this.baseMessage} ${this.message ? `- ${this.message}` : ""}: ${
      getStack ? `\n${stackInfo}` : ""
    }`;
  }
}

export default ClientError;
