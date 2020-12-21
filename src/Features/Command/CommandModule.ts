import { TYPES } from "@/App/AppTypes";
import { ContainerModule, interfaces } from "inversify";
import AvatarCommand from "./Avatar/AvatarCommand";
import AvatarErrorHandler from "./Avatar/AvatarErrorHandler";
import CommandFactory from "./CommandFactory";
import CommandHandler from "./CommandHandler";
import JailCommand from "./Jail/JailCommand";
import UnjailCommand from "./Jail/UnjailCommand";
import WebsiteWatcherArgumentValidator from "./WebsiteWatcher/WebsiteWatcherArgumentValidator";
import WebsiteWatcherCommand from "./WebsiteWatcher/WebsiteWatcherCommand";
import WebsiteWatcherIntegrityCheck from "./WebsiteWatcher/WebsiteWatcherIntegrityCheck";

const commandModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(TYPES.COMMAND).to(JailCommand);
  bind(TYPES.COMMAND).to(UnjailCommand);
  bind(TYPES.COMMAND).to(AvatarCommand);
  bind(TYPES.COMMAND).to(WebsiteWatcherCommand);
  bind(TYPES.COMMAND_HANDLER).to(CommandHandler).inSingletonScope();
  bind(TYPES.COMMAND_FACTORY).to(CommandFactory).inSingletonScope();
  bind(TYPES.AVATAR_ERROR_HANDLER).to(AvatarErrorHandler).inSingletonScope();
  bind(TYPES.WATCHER_ARGS_VALIDATOR).to(WebsiteWatcherArgumentValidator).inSingletonScope();
  bind(TYPES.WATCHER_INTEGRITY_CHECK).to(WebsiteWatcherIntegrityCheck).inSingletonScope();
});

export { commandModule };
