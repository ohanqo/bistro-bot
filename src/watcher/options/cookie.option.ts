import { OptionType } from "@/core/discord/discord.constant"
import Option from "@/core/option/option"

export default class CookieOption implements Option {
  name = "cookie"
  description =
    "Cookie à appliquer au chargement de la page (ex: pour passer des filtres sur Dealabs)"
  type = OptionType.STRING
  required = false
  choices = null
}
