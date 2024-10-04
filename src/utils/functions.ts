import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
import { RestOrArray } from "discord.js";

export = {
  craftActionRowButtonComponents(components: RestOrArray<ButtonBuilder>): ActionRowBuilder<ButtonBuilder> {
    return new ActionRowBuilder<ButtonBuilder>().setComponents(...components);
  },
};
