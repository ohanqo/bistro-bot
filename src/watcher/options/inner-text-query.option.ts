import { OptionType } from "@/core/discord/discord.constant"
import Option from "@/core/option/option"

export default class InnerTextQueryOption implements Option {
  name = "inner-text-query"
  description =
    "Chemin CSS permettant de récupérer le texte de l'élément de la liste."
  type = OptionType.STRING
  required = false
  choices = null
}
