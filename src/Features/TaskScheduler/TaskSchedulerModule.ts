import { TYPES } from "@/App/AppTypes";
import { ContainerModule, interfaces } from "inversify";
import DealabsChannelManager from "./Dealabs/DealabsChannelManager";
import DealabsScheduler from "./Dealabs/DealabsScheduler";
import WebsiteWatcherUpdateChecker from "./WebsiteWatcher/WebsiteWatcherUpdateChecker";
import WebsiteWatcherScheduler from "./WebsiteWatcher/WebsiteWatcherScheduler";
import WebsiteWatcherUpdateHandler from "./WebsiteWatcher/WebsiteWatcherUpdateHandler";
import WebsiteWatcherSuccessMessageBuilder from "./WebsiteWatcher/MessageBuilder/WebsiteWatcherSuccessMessageBuilder";
import WebsiteWatcherFailureMessageBuilder from "./WebsiteWatcher/MessageBuilder/WebsiteWatcherFailureMessageBuilder";
import WebsiteWatcherFailureHandler from "./WebsiteWatcher/WebsiteWatcherFailureHandler";

const schedulerModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(TYPES.DEALABS_SCHEDULER).to(DealabsScheduler);
  bind(TYPES.DEALABS_CHANNEL_MANAGER).to(DealabsChannelManager);
  bind(TYPES.WEBSITE_WATCHER_SCHEDULER).to(WebsiteWatcherScheduler);
  bind(TYPES.WEBSITE_WATCHER_UPDATE_CHECKER).to(WebsiteWatcherUpdateChecker);
  bind(TYPES.WEBSITE_WATCHER_UPDATE_HANDLER).to(WebsiteWatcherUpdateHandler);
  bind(TYPES.WEBSITE_WATCHER_FAILURE_HANDLER).to(WebsiteWatcherFailureHandler);
  bind(TYPES.WEBSITE_WATCHER_SUCCESS_MESSAGE_BUILDER).to(WebsiteWatcherSuccessMessageBuilder);
  bind(TYPES.WEBSITE_WATCHER_FAILURE_MESSAGE_BUILDER).to(WebsiteWatcherFailureMessageBuilder);
});

export { schedulerModule };
