import { OptionType } from "@/core/discord/discord.constant"
import Option from "@/core/option/option"

export default class WatcherIdOption implements Option {
  name = "id"
  description = "Tu peux utiliser la commande `watcher-list` pour connaître les ids."
  type = OptionType.INTEGER
  required = true
  choices = null
}
