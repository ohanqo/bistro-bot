import { ContainerModule, interfaces } from "inversify"
import SenderIsAdminGuard from "./common/sender-is-admin.guard"

const guardModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(SenderIsAdminGuard).toSelf()
})

export { guardModule }
