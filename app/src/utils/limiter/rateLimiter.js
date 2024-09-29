const { ChatInputCommandInteraction, Collection, RateLimitError, Message } = require("discord.js");

class UserRateLimiter {
  /**
   *
   * @param {string} userId Id of user
   * @param {number} maxRequests Maximum number of requests that can be processed
   * @param {number} interval The time in milisecond that the request was expired
   * @param {boolean} bypass If true, bypass the timeout. Default is false
   */
  constructor(userId, maxRequests, interval, bypass = false) {
    this.userId = userId;
    this.maxRequests = maxRequests;
    this.requests = new Collection();
    this.interval = interval;
    this.bypass = bypass;
  }
}

class UserCommandRateLimiter extends UserRateLimiter {
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @returns {boolean}
   */
  canProceed(interaction) {
    this.requests = this.requests.filter(
      (oldInteraction) => interaction.createdTimestamp - oldInteraction.createdTimestamp < this.interval
    );
    if (this.requests.size >= this.maxRequests) return false;
    else {
      this.requests.set(interaction.id, interaction);
      return true;
    }
  }
}

class UserPrefixCommandRateLimiter extends UserCommandRateLimiter {
  /**
   *
   * @param {Message} message
   * @returns {boolean}
   */
  canProceed(message) {
    if (this.bypass) return true;
    this.requests = this.requests.filter(
      (oldMessage) => message.createdTimestamp - oldMessage.createdTimestamp < this.interval
    );

    if (this.requests.size >= this.maxRequests) return false;
    else this.requests.set(message.id, message);
    return true;
  }
}

class Limiter {
  defaultRateLimiterTime = 5000;
  userRateLimiterCollection = new Collection();
  /**
   *
   * @param {number} interval The time in milisecond that the user request was expired. Default is 5 seconds.
   */
  constructor(interval) {
    this.interval = interval;
  }
}

/**
 * @extends {Limiter}
 */
class CommandRateLimiter extends Limiter {
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @returns {boolean}
   */
  canProceed(interaction) {
    const userCommandRateLimiter = this.userRateLimiterCollection.get(interaction.user.id);
    if (!userCommandRateLimiter) {
      const newUserCommandRateLimiter = new UserCommandRateLimiter(interaction.user.id, 5, this.defaultRateLimiterTime);
      newUserCommandRateLimiter.canProceed(interaction);

      this.userRateLimiterCollection.set(interaction.user.id, newUserCommandRateLimiter);
      return true;
    }

    const status = userCommandRateLimiter.canProceed(interaction);
    this.userRateLimiterCollection.set(interaction.user.id, userCommandRateLimiter);
    return status;
  }
}

/**
 * @extends {Limiter}
 */
class PrefixCommandRateLimiter extends Limiter {
  /**
   *
   * @param {Message} message
   * @returns {boolean}
   */
  canProceed(message) {
    const userRateLimiter = this.userRateLimiterCollection.get(message.author.id);
    if (!userRateLimiter) {
      const newUserRateLimiter = new UserPrefixCommandRateLimiter(message.author.id, 5, this.defaultRateLimiterTime);
      newUserRateLimiter.canProceed(message);

      this.userRateLimiterCollection.set(message.author.id, newUserRateLimiter);
      return true;
    }

    const status = userRateLimiter.canProceed(message);
    this.userRateLimiterCollection.set(message.author.id, userRateLimiter);
    return status;
  }
}

module.exports = { CommandRateLimiter, PrefixCommandRateLimiter };
