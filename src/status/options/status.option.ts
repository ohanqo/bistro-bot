import { OptionType } from "@/core/discord/discord.constant"
import Option from "@/core/option/option"

export default class StatusOption implements Option {
  name = "status"
  description = "Description/message à afficher en dessous du nom du bot."
  type = OptionType.STRING
  required = false
  choices = null
}
