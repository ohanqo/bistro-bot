import { TYPES } from "@/App/AppTypes";
import { ContainerModule, interfaces } from "inversify";
import DealabsScheduler from "./Dealabs/DealabsScheduler";
import WebsiteWatcherScheduler from "./WebsiteWatcher/WebsiteWatcherScheduler";

const schedulerModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(TYPES.DEALABS_SCHEDULER).to(DealabsScheduler);
  bind(TYPES.WEBSITE_WATCHER_SCHEDULER).to(WebsiteWatcherScheduler);
});

export { schedulerModule };
