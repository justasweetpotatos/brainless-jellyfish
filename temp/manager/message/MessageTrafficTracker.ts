import { Collection, Guild, Message } from "discord.js";

export default class MessageTrafficTracker {
  private guild: Guild;
  public isActive: boolean;

  public trafficMap: Collection<number, number> = new Collection<number, number>();

  constructor(guild: Guild, isActive: boolean = false) {
    this.guild = guild;
    this.isActive = isActive;
  }

  onMessage(message: Message) {
    let lastTrack = this.trafficMap.lastKey();
    let value = this.trafficMap.last();
    if (!value) value = 0;

    if (!lastTrack) {
      lastTrack = Math.floor(message.createdTimestamp);
      this.trafficMap.set(lastTrack, 1);
      return;
    }

    if (lastTrack && Math.floor(lastTrack / 1000) > Math.floor(message.createdTimestamp / 1000)) {
      this.trafficMap.set(Math.floor(message.createdTimestamp / 1000), 1);
    } else {
      this.trafficMap.set(lastTrack, value + 1);
    }
  }
}
