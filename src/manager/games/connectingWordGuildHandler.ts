import { Collection } from "discord.js";
import SuwaClient from "../../bot";

class ConnectingWordGuildManager{
    private readonly client: SuwaClient;
    public channels: Collection<string, >

    constructor(client: SuwaClient) {
        this.client = client;
        this.channels = new Collection()
    }


}

export default {ConnectingWordGuildManager}