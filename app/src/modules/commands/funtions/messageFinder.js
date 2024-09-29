const { User, Message, Collection, TextBasedChannel } = require("discord.js");

module.exports = {
  /**
   *
   * @param {{
   *    channel: TextBasedChannel,
   *    quantity: number,
   *    isBot: boolean,
   *    target: User,
   *    seachString: string,
   *    timeLocation: {startMsgId: string, endMsgId: string}
   * }} options
   * @returns {Promise<{
   *    collection1: Collection<string, Message>,
   *    colleciton2: Collection<string, Message>,
   *    userData: Collection<string, Array<Message>>
   * }>}
   */
  async findMessage(options) {
    let counter = 0;
    const bulkDeletableMessageCollection = new Collection();
    const nonBulkDeletableMessageCollection = new Collection();
    const userData = new Collection();

    let continueFetching = true;

    if (options.timeLocation) options.timeLocation.startMsgId = String(Number(options.timeLocation.startMsgId) + 1);

    let initSeachMessage = options.timeLocation
      ? (await options.channel.messages.fetch({ limit: 1, before: options.timeLocation.startMsgId })).at(0)
      : options.channel.lastMessage;

    while (continueFetching) {
      const rawMessages = await options.channel.messages.fetch({ limit: 100, before: initSeachMessage.id });

      if (rawMessages.size < 100) continueFetching = false;

      rawMessages.every((message) => {
        if (counter == options.quantity) {
          continueFetching = false;
          return false;
        }

        if (!options.timeLocation || message.id === options.timeLocation.endMsgId)
          if (!options.target || options.target.id === message.author.id)
            if (!options.isBot || message.author.bot)
              if (!options.seachString || message.content.includes(options.seachString)) {
                message.bulkDeletable
                  ? bulkDeletableMessageCollection.set(message.id, message)
                  : nonBulkDeletableMessageCollection.set(message.id, message);
                userData.get(message.author.id)
                  ? userData.get(message.author.id).push(message)
                  : userData.set(message.author.id, [message]);
              }

        counter += 1;
        return true;
      });

      initSeachMessage = rawMessages.last();
    }

    return {
      collection1: bulkDeletableMessageCollection,
      colleciton2: nonBulkDeletableMessageCollection,
      userData: userData,
    };
  },
};
