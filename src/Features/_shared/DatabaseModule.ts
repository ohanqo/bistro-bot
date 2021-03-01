import { TYPES } from "@/App/AppTypes";
import { AsyncContainerModule, interfaces } from "inversify";
import { createConnection, getConnection, getConnectionManager } from "typeorm";
import JailChannelEntity from "../Command/Jail/JailChannelEntity";
import WebsiteWatcherEntity from "../Command/WebsiteWatcher/WebsiteWatcherEntity";
import DealabsChannelEntity from "../TaskScheduler/Dealabs/DealabsChannelEntity";
import WatcherFailureEntity from "../TaskScheduler/WebsiteWatcher/WatcherFailureEntity";

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
  const jailChannelRepository = connection.getRepository(JailChannelEntity);
  const watcherFailureRepository = connection.getRepository(WatcherFailureEntity);

  bind(TYPES.CONNECTION).toConstantValue(connection);
  bind(TYPES.WEBSITE_WATCHER_REPOSITORY).toConstantValue(websiteWatcherRepository);
  bind(TYPES.DEALABS_CHANNEL_REPOSITORY).toConstantValue(dealabsChannelRepository);
  bind(TYPES.JAIL_CHANNEL_REPOSITORY).toConstantValue(jailChannelRepository);
  bind(TYPES.WATCHER_FAILURE_REPOSITORY).toConstantValue(watcherFailureRepository);
});

export { databaseModule };
