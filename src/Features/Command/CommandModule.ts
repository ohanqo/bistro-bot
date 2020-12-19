import { TYPES } from "@/App/AppTypes";
import { ContainerModule, interfaces } from "inversify";
import AvatarCommand from "./Avatar/AvatarCommand";
import AvatarErrorHandler from "./Avatar/AvatarErrorHandler";
import CommandFactory from "./CommandFactory";
import CommandHandler from "./CommandHandler";
import JailCommand from "./Jail/JailCommand";
import UnjailCommand from "./Jail/UnjailCommand";
import WebWatcherArgumentValidator from "./WebWatcher/WebWatcherArgumentValidator";
import WebWatcherCommand from "./WebWatcher/WebWatcherCommand";

const commandModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(TYPES.COMMAND).to(JailCommand);
  bind(TYPES.COMMAND).to(UnjailCommand);
  bind(TYPES.COMMAND).to(AvatarCommand);
  bind(TYPES.COMMAND).to(WebWatcherCommand);
  bind(TYPES.COMMAND_HANDLER).to(CommandHandler).inSingletonScope();
  bind(TYPES.COMMAND_FACTORY).to(CommandFactory).inSingletonScope();
  bind(TYPES.AVATAR_ERROR_HANDLER).to(AvatarErrorHandler).inSingletonScope();
  bind(TYPES.WATCHER_ARGS_VALIDATOR).to(WebWatcherArgumentValidator).inSingletonScope();
});

export { commandModule };
