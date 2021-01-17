import { TYPES } from "@/App/AppTypes";
import { ContainerModule, interfaces } from "inversify";
import DealabsChannelManager from "./Dealabs/DealabsChannelManager";
import DealabsScheduler from "./Dealabs/DealabsScheduler";
import WebsiteWatcherScheduler from "./WebsiteWatcher/WebsiteWatcherScheduler";

const schedulerModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(TYPES.DEALABS_SCHEDULER).to(DealabsScheduler);
  bind(TYPES.DEALABS_CHANNEL_MANAGER).to(DealabsChannelManager);
  bind(TYPES.WEBSITE_WATCHER_SCHEDULER).to(WebsiteWatcherScheduler);
});

export { schedulerModule };
