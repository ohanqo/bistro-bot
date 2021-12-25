import { injectable } from "inversify"
import { coreContainer } from "../core.container"
import Guard from "../guard/guard"
import Option from "../option/option"

@injectable()
export default abstract class Command {
  keyword: string = "undefined"
  description: string = "undefined"
  options: Option[] = []
  guards: (new () => Guard)[] = []

  abstract execute(): Promise<void>

  public async runGuards(): Promise<boolean> {
    for (let guardType of this.guards) {
      const guard = coreContainer.get<Guard>(guardType)
      const isValid = await guard.performValidation()

      if (!isValid) {
        await guard.sendValidationFailureMessage()
        return false
      }
    }

    return true
  }
}
