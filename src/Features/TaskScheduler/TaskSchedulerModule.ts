import { TYPES } from "@/App/AppTypes";
import { ContainerModule, interfaces } from "inversify";
import DealabsChannelManager from "./Dealabs/DealabsChannelManager";
import DealabsScheduler from "./Dealabs/DealabsScheduler";
import WebsiteWatcherContentResolver from "./WebsiteWatcher/WebsiteWatcherContentResolver";
import WebsiteWatcherUpdateChecker from "./WebsiteWatcher/WebsiteWatcherUpdateChecker";
import WebsiteWatcherScheduler from "./WebsiteWatcher/WebsiteWatcherScheduler";
import WebsiteWatcherScreenshotResolver from "./WebsiteWatcher/WebsiteWatcherScreenshotResolver";
import WebsiteWatcherUpdateHandler from "./WebsiteWatcher/WebsiteWatcherUpdateHandler";
import WebsiteWatcherMessageBuilder from "./WebsiteWatcher/WebsiteWatcherMessageBuilder";

const schedulerModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(TYPES.DEALABS_SCHEDULER).to(DealabsScheduler);
  bind(TYPES.DEALABS_CHANNEL_MANAGER).to(DealabsChannelManager);
  bind(TYPES.WEBSITE_WATCHER_SCHEDULER).to(WebsiteWatcherScheduler);
  bind(TYPES.WEBSITE_WATCHER_UPDATE_CHECKER).to(WebsiteWatcherUpdateChecker);
  bind(TYPES.WEBSITE_WATCHER_UPDATE_HANDLER).to(WebsiteWatcherUpdateHandler);
  bind(TYPES.WEBSITE_WATCHER_CONTENT_RESOLVER).to(WebsiteWatcherContentResolver);
  bind(TYPES.WEBSITE_WATCHER_SCREENSHOT_RESOLVER).to(WebsiteWatcherScreenshotResolver);
  bind(TYPES.WEBSITE_WATCHER_MESSAGE_BUILDER).to(WebsiteWatcherMessageBuilder);
});

export { schedulerModule };
