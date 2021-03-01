import { TYPES } from "@/App/AppTypes";
import { ContainerModule, interfaces } from "inversify";
import ContentResolver from "./Browser/ContentResolver";
import ScreenshotResolver from "./Browser/ScreenshotResolver";
import Constant from "./Constant";
import ChannelManager from "./Message/ChannelManager";
import RoleManager from "./Message/RoleManager";

const domainModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(TYPES.CONSTANT).to(Constant).inSingletonScope();
  bind(TYPES.ROLE_MANAGER).to(RoleManager).inSingletonScope();
  bind(TYPES.CHANNEL_MANAGER).to(ChannelManager).inSingletonScope();
  bind(TYPES.CONTENT_RESOLVER).to(ContentResolver).inSingletonScope();
  bind(TYPES.SCREENSHOT_RESOLVER).to(ScreenshotResolver).inSingletonScope();
});

export { domainModule };
