import { TYPES } from "@/App/AppTypes";
import { ContainerModule, interfaces } from "inversify";
import Constant from "./Constant";
import ChannelManager from "./Message/ChannelManager";
import RoleManager from "./Message/RoleManager";

const domainModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(TYPES.CONSTANT).to(Constant).inSingletonScope();
  bind(TYPES.ROLE_MANAGER).to(RoleManager).inSingletonScope();
  bind(TYPES.CHANNEL_MANAGER).to(ChannelManager).inSingletonScope();
});

export { domainModule };
