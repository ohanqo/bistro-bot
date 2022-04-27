import Command from "@/core/command/command"
import { command } from "@/core/command/command.decorator"
import PrivateOption from "@/core/option/common/private.option"
import { options } from "@/core/option/option.decorator"
import CookieOption from "./options/cookie.option"
import ElementOption from "./options/element-query.option"
import RecurrenceOption from "./options/recurrence.option"
import UrlOption from "./options/url.option"

@command(
  "watcher/create-list",
  "Création d'un watcher, affiche une liste d'éléments de façon récurrente (ne réagit pas aux changements)."
)
@options(UrlOption, ElementOption, PrivateOption, RecurrenceOption, CookieOption)
export default class CreateWatcherListCommand extends Command {
  execute(): Promise<void> {
    throw new Error("Method not implemented.")
  }
}
