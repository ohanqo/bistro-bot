import { TYPES } from "@/App/AppTypes";
import { AsyncContainerModule, interfaces } from "inversify";
import { createConnection, getConnection, getConnectionManager } from "typeorm";
import WebsiteWatcherEntity from "../Command/WebsiteWatcher/WebsiteWatcherEntity";

const databaseModule = new AsyncContainerModule(async (bind: interfaces.Bind) => {
  const manager = getConnectionManager();
  const connection = manager.has("default") ? getConnection() : await createConnection();
  const websiteWatcherRepository = connection.getRepository(WebsiteWatcherEntity);

  bind(TYPES.CONNECTION).toConstantValue(connection);
  bind(TYPES.WEBSITE_WATCHER_REPOSITORY).toConstantValue(websiteWatcherRepository);
});

export { databaseModule };
