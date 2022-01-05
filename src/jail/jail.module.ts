import { TYPES } from "@/core/app/app.types"
import { ContainerModule, interfaces } from "inversify"
import OptionChannelIsVoiceGuard from "./guards/option-channel-is-voice.guard"
import SenderCanManageRolesGuard from "./guards/sender-can-manage-roles.guard"
import SenderIsAdminGuard from "../core/guard/common/sender-is-admin.guard"
import TargetIsInJailGuard from "./guards/target-is-in-jail.guard"
import TargetIsValidGuard from "./guards/target-is-non-admin.guard"
import TargetIsNotInJailGuard from "./guards/target-is-not-in-jail.guard"
import JailCommand from "./jail.command"
import JailManager from "./jail.manager"
import JailState from "./jail.state"
import SetJailChannelCommand from "./set-jail-channel.command"
import UnjailCommand from "./unjail.command"

const jailModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(TargetIsValidGuard).toSelf()
  bind(SenderCanManageRolesGuard).toSelf()
  bind(OptionChannelIsVoiceGuard).toSelf()
  bind(TargetIsNotInJailGuard).toSelf()
  bind(TargetIsInJailGuard).toSelf()
  bind(TYPES.COMMAND).to(JailCommand)
  bind(TYPES.COMMAND).to(UnjailCommand)
  bind(TYPES.COMMAND).to(SetJailChannelCommand)
  bind(TYPES.JAIL_MANAGER).to(JailManager)
  bind(TYPES.JAIL_STATE).to(JailState).inSingletonScope()
})

export { jailModule }
