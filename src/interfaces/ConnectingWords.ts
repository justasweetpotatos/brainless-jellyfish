export interface ConnectingWordMessage {
  content: string;
  authorId: string;
}

export interface ConnectingWordChannelConfig {
  registered: boolean | false;
  lastWord?: string;
  lastUserId?: string;

  repeatedList: Array<string>;

  // gamerule
  allowRepeat: boolean;
  limitToReset: number;

  // Message on action
  wrongMessage: ConnectingWordMessage;
  wrongStartCharMessage: ConnectingWordMessage;
  isLastUserMessage: ConnectingWordMessage;
  isRepeatedMessage: ConnectingWordMessage;
}
