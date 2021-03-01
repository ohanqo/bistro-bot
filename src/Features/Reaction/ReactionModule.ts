import { TYPES } from "@/App/AppTypes";
import { ContainerModule, interfaces } from "inversify";
import WatcherFailureReactionManager from "./Add/WatcherFailureReactionManager";
import ReactionManagerFactory from "./ReactionManagerFactory";
import ReactionHandler from "./ReactionHandler";

const reactionModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(TYPES.REACTION_MANAGER).to(WatcherFailureReactionManager);
  bind(TYPES.REACTION_MANAGER_FACTORY).to(ReactionManagerFactory).inSingletonScope();
  bind(TYPES.REACTION_HANDLER).to(ReactionHandler).inSingletonScope();
});

export { reactionModule };
