import { ConnectingWordGameGuildConfig } from "../models/ConnectingWordGameGuildConfig";
import { DefautRepository } from "./DefaulRepository";

export class ConnectingWordGameGuildConfigRepository extends DefautRepository {
  private readonly tableName = "`suwa_client`.`connecting_word_guild_config`";
  async update(id: string): Promise<boolean> {
    const query = `INSERT INTO ${this.tableName} (\`guild_id\`) VALUES (?);`;
    await this.executeQuery(query, [id]);
    return true;
  }

  async get(id: string): Promise<ConnectingWordGameGuildConfig | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE \`id\`='?';`;
    const values = [id];
    const rows = await this.executeQuery(query, values);
    if (rows.length == 0) return null;
    else return new ConnectingWordGameGuildConfig(rows[0].guild_id);
  }

  async delete(): Promise<void> {
    return;
  }

  async getAll(): Promise<Array<ConnectingWordGameGuildConfig>> {
    const query = `SELECT * FROM ${this.tableName};`;
    const rows = await this.executeQuery(query, []);
    return rows.map((data) => new ConnectingWordGameGuildConfig(data.guild_id).sync(data));
  }
}
