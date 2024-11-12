import {
  ConnectingWordChannelConfigJSON,
  WordList,
} from "../../structure/interface/ConnectingWordGameDataStructure";

export class ConnectingWordChannelConfig {
  public readonly channelId: string;
  public readonly guildId: string;

  // rules
  private _repeated: boolean = false;
  private _duplicate: boolean = false;
  private _limit: number = 100;
  private _counter: number = 0;

  // data
  private _lastUserId: string | undefined;
  private _lastWord: string | undefined;
  private _usedWordList: WordList = {};

  // message
  private _notificationMessageTimeAlive: number = 5000; // milliseconds
  private _repeatedMessage: string | undefined;
  private _wrongStartCharMessage: string | undefined;
  private _isLastUserMessage: string | undefined;
  private _incorrectWordMessage: string | undefined;

  private cachingCounter: number = 0;
  private cachingLimit: number = 10;

  public requireDatabaseSync: boolean = false;

  constructor(channelId: string, guildId: string) {
    this.channelId = channelId;
    this.guildId = guildId;
  }

  // Helper method to increase the cachingCounter
  private incrementCachingCounter() {
    this.cachingCounter++;
    if (this.cachingCounter === this.cachingLimit) {
      this.requireDatabaseSync = true;
    }
  }

  // Getters and Setters for each property
  get repeated() {
    return this._repeated;
  }

  set repeated(value: boolean) {
    if (this._repeated !== value) {
      this._repeated = value;
      this.incrementCachingCounter();
    }
  }

  get duplicate() {
    return this._duplicate;
  }

  set duplicate(value: boolean) {
    if (this._duplicate !== value) {
      this._duplicate = value;
      this.incrementCachingCounter();
    }
  }

  get limit() {
    return this._limit;
  }

  set limit(value: number) {
    if (this._limit !== value) {
      this._limit = value;
      this.incrementCachingCounter();
    }
  }

  get counter() {
    return this._counter;
  }

  set counter(value: number) {
    if (this._counter !== value) {
      this._counter = value;
      this.incrementCachingCounter();
    }
  }

  get lastUserId() {
    return this._lastUserId;
  }

  set lastUserId(value: string | undefined) {
    if (this._lastUserId !== value) {
      this._lastUserId = value;
      this.incrementCachingCounter();
    }
  }

  get lastWord() {
    return this._lastWord;
  }

  set lastWord(value: string | undefined) {
    if (this._lastWord !== value) {
      this._lastWord = value;
      this.incrementCachingCounter();
    }
  }

  get usedWordList() {
    return this._usedWordList;
  }

  set usedWordList(value: WordList | undefined) {
    if (value && JSON.stringify(this._usedWordList) !== JSON.stringify(value)) {
      this._usedWordList = value;
      this.incrementCachingCounter();
    }
  }

  get notificationMessageTimeAlive() {
    return this._notificationMessageTimeAlive;
  }

  set notificationMessageTimeAlive(value: number) {
    if (this._notificationMessageTimeAlive === value) return;
    this._notificationMessageTimeAlive = value;
    this.incrementCachingCounter();
  }

  get repeatedMessage() {
    return this._repeatedMessage;
  }

  set repeatedMessage(value: string | undefined) {
    if (this._repeatedMessage !== value) {
      this._repeatedMessage = value;
      this.incrementCachingCounter();
    }
  }

  get wrongStartCharMessage() {
    return this._wrongStartCharMessage;
  }

  set wrongStartCharMessage(value: string | undefined) {
    if (this._wrongStartCharMessage !== value) {
      this._wrongStartCharMessage = value;
      this.incrementCachingCounter();
    }
  }

  get isLastUserMessage() {
    return this._isLastUserMessage;
  }

  set isLastUserMessage(value: string | undefined) {
    if (this._isLastUserMessage !== value) {
      this._isLastUserMessage = value;
      this.incrementCachingCounter();
    }
  }

  get incorrectWordMessage() {
    return this._incorrectWordMessage;
  }

  set incorrectWordMessage(value: string | undefined) {
    if (this._incorrectWordMessage !== value) {
      this._incorrectWordMessage = value;
      this.incrementCachingCounter();
    }
  }

  resetCachingCounter() {
    this.cachingCounter = 0;
  }

  // Method to sync properties from JSON (No need to manually increment cachingCounter here)
  sync(data: ConnectingWordChannelConfigJSON) {
    this._repeated = data.repeated;
    this._duplicate = data.duplicate;
    this._limit = data.limit;
    this._lastUserId = data.last_user_id;
    this._lastWord = data.last_word;
    this._usedWordList = data.word_used_list ? data.word_used_list as WordList : {};
    this._repeatedMessage = data.repeated_message;
    this._wrongStartCharMessage = data.wrong_start_char_message;
    this._isLastUserMessage = data.is_last_user_message;
    this._incorrectWordMessage = data.incorrect_word_message;
    return this;
  }

  toJSON(): ConnectingWordChannelConfigJSON {
    return {
      channel_id: this.channelId,
      guild_id: this.guildId,
      // Rules
      repeated: this._repeated,
      duplicate: this._duplicate,
      limit: this._limit,
      counter: this._counter,

      // data
      last_user_id: this._lastUserId,
      last_word: this._lastWord,
      word_used_list: JSON.stringify(this._usedWordList),

      // message
      notification_message_time_alive: this._notificationMessageTimeAlive,
      repeated_message: this._repeatedMessage,
      wrong_start_char_message: this._wrongStartCharMessage,
      is_last_user_message: this._isLastUserMessage,
      incorrect_word_message: this._incorrectWordMessage,
    };
  }
}
