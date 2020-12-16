import { TYPES } from "@/App/AppTypes";
import { ContainerModule, interfaces } from "inversify";
import MemberAddedHandler from "./MemberAddedHandler";

const memberAddedModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(TYPES.MEMBER_ADDED_HANDLER).to(MemberAddedHandler);
});

export { memberAddedModule };
