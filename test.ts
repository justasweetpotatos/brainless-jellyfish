import DBConnector from "./src/database/connector";
import { ConnectingWordGameChannelConfigRepository } from "./src/database/repositories/ConnectingWordGameChannelConfigRepository";

const connector = new DBConnector();

connector.createPromisePool();

(async () => {
  try {
    const repo = new ConnectingWordGameChannelConfigRepository();

    repo.usePool(connector.pool);
    console.log(await repo.getAll());
    connector.pool?.escape(0);

    console.log(await repo.get("1198978446999691315"));

    process.exit(0);
  } catch (error) {
    console.log(error as Error);
    process.exit(0);
  }
})();
