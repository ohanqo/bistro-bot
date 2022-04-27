import { OptionType } from "@/core/discord/discord.constant"
import Option from "@/core/option/option"

export default class ColorOption implements Option {
  name = "couleur"
  description = "Couleur du bandeau du message (format hexa: #FF0000)."
  type = OptionType.STRING
  required = false
  choices = null
}
