import { TYPES } from "@/App/AppTypes";
import { ContainerModule, interfaces } from "inversify";
import DealabsScheduler from "./DealabsScheduler";

const dealabsModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(TYPES.DEALABS_SCHEDULER).to(DealabsScheduler);
});

export { dealabsModule };
