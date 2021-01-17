import { TYPES } from "@/App/AppTypes";
import { ContainerModule, interfaces } from "inversify";
import AvatarCommand from "./Avatar/AvatarCommand";
import CommandFactory from "./CommandFactory";
import CommandHandler from "./CommandHandler";
import JailCommand from "./Jail/JailCommand";
import UnjailCommand from "./Jail/UnjailCommand";
import PurgeArgumentValidator from "./Purge/PurgeArgumentValidator";
import PurgeCommand from "./Purge/PurgeCommand";
import AddWatcherArgumentValidator from "./WebsiteWatcher/Add/AddWatcherArgumentValidator";
import AddWatcherCommand from "./WebsiteWatcher/Add/AddWatcherCommand";
import AddWatcherIntegrityCheck from "./WebsiteWatcher/Add/AddWatcherIntegrityCheck";
import DeleteWatcherArgumentValidator from "./WebsiteWatcher/Delete/DeleteWatcherArgumentValidator";
import DeleteWatcherCommand from "./WebsiteWatcher/Delete/DeleteWatcherCommand";
import ListWatcherCommand from "./WebsiteWatcher/List/ListWatcherCommand";

const commandModule = new ContainerModule(async (bind: interfaces.Bind) => {
  bind(TYPES.COMMAND).to(JailCommand);
  bind(TYPES.COMMAND).to(UnjailCommand);
  bind(TYPES.COMMAND).to(AvatarCommand);
  bind(TYPES.COMMAND).to(AddWatcherCommand);
  bind(TYPES.COMMAND).to(ListWatcherCommand);
  bind(TYPES.COMMAND).to(DeleteWatcherCommand);
  bind(TYPES.COMMAND).to(PurgeCommand);
  bind(TYPES.COMMAND_HANDLER).to(CommandHandler).inSingletonScope();
  bind(TYPES.COMMAND_FACTORY).to(CommandFactory).inSingletonScope();
  bind(TYPES.ADD_WATCHER_ARGS_VALIDATOR).to(AddWatcherArgumentValidator).inSingletonScope();
  bind(TYPES.ADD_WATCHER_INTEGRITY_CHECK).to(AddWatcherIntegrityCheck).inSingletonScope();
  bind(TYPES.DELETE_WATCHER_ARGS_VALIDATOR).to(DeleteWatcherArgumentValidator).inSingletonScope();
  bind(TYPES.PURGE_ARGS_VALIDATOR).to(PurgeArgumentValidator).inSingletonScope();
});

export { commandModule };
