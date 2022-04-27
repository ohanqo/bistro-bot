import { OptionType } from "@/core/discord/discord.constant"
import Option from "@/core/option/option"

export default class ElementQuerySelectorOption implements Option {
  name = "element-query"
  description =
    "Indique l'élément de la page qui doit être surveillé par le bot. (QuerySelector, ex: `div > h1`)"
  type = OptionType.STRING
  required = true
  choices = null
}
