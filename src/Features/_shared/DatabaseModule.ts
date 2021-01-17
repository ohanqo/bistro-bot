import { TYPES } from "@/App/AppTypes";
import { AsyncContainerModule, interfaces } from "inversify";
import { createConnection, getConnection, getConnectionManager } from "typeorm";
import WebsiteWatcherEntity from "../Command/WebsiteWatcher/WebsiteWatcherEntity";
import DealabsChannelEntity from "../TaskScheduler/Dealabs/DealabsChannelEntity";

const databaseModule = new AsyncContainerModule(async (bind: interfaces.Bind) => {
  const manager = getConnectionManager();
  const connection = manager.has("default")
    ? getConnection()
    : await createConnection({
        type: "postgres",
        url: process.env.DATABASE_URL,
        synchronize: false,
        entities: ["dist/**/*Entity.js"],
        migrations: ["dist/App/Migration/*.js"],
        migrationsRun: true,
      });
  const websiteWatcherRepository = connection.getRepository(WebsiteWatcherEntity);
  const dealabsChannelRepository = connection.getRepository(DealabsChannelEntity);

  bind(TYPES.CONNECTION).toConstantValue(connection);
  bind(TYPES.WEBSITE_WATCHER_REPOSITORY).toConstantValue(websiteWatcherRepository);
  bind(TYPES.DEALABS_CHANNEL_REPOSITORY).toConstantValue(dealabsChannelRepository);
});

export { databaseModule };
