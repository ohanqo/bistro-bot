import { OptionType } from "@/core/discord/discord.constant"
import Option from "@/core/option/option"

export default class InnerTitleQueryOption implements Option {
  name = "inner-title-query"
  description =
    "Chemin CSS permettant de récupérer le titre de l'élément de la liste."
  type = OptionType.STRING
  required = false
  choices = null
}
