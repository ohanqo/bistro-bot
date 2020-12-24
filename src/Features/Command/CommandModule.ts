import { TYPES } from "@/App/AppTypes";
import { ContainerModule, interfaces } from "inversify";
import AvatarCommand from "./Avatar/AvatarCommand";
import AvatarErrorHandler from "./Avatar/AvatarErrorHandler";
import CommandFactory from "./CommandFactory";
import CommandHandler from "./CommandHandler";
import JailCommand from "./Jail/JailCommand";
import UnjailCommand from "./Jail/UnjailCommand";
import AddWatcherArgumentValidator from "./WebsiteWatcher/Add/AddWatcherArgumentValidator";
import AddWatcherCommand from "./WebsiteWatcher/Add/AddWatcherCommand";
import AddWatcherIntegrityCheck from "./WebsiteWatcher/Add/AddWatcherIntegrityCheck";
import ListWatcherCommand from "./WebsiteWatcher/List/ListWatcherCommand";

const commandModule = new ContainerModule(async (bind: interfaces.Bind) => {
  bind(TYPES.COMMAND).to(JailCommand);
  bind(TYPES.COMMAND).to(UnjailCommand);
  bind(TYPES.COMMAND).to(AvatarCommand);
  bind(TYPES.COMMAND).to(AddWatcherCommand);
  bind(TYPES.COMMAND).to(ListWatcherCommand);
  bind(TYPES.COMMAND_HANDLER).to(CommandHandler).inSingletonScope();
  bind(TYPES.COMMAND_FACTORY).to(CommandFactory).inSingletonScope();
  bind(TYPES.AVATAR_ERROR_HANDLER).to(AvatarErrorHandler).inSingletonScope();
  bind(TYPES.ADD_WATCHER_ARGS_VALIDATOR).to(AddWatcherArgumentValidator).inSingletonScope();
  bind(TYPES.ADD_WATCHER_INTEGRITY_CHECK).to(AddWatcherIntegrityCheck).inSingletonScope();
});

export { commandModule };
