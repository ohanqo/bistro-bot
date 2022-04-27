import { OptionType } from "@/core/discord/discord.constant"
import Option from "@/core/option/option"

export default class PrivateOption implements Option {
  name = "privée"
  description = "Est-ce que le bot te notifiera en privé ? (par défaut public)"
  type = OptionType.BOOLEAN
  required = false
  choices = null
}
