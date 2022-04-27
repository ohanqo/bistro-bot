import { OptionType } from "@/core/discord/discord.constant"
import Option from "@/core/option/option"

export default class DescriptionOption implements Option {
  name = "description"
  description = "Personnalise la description du message que le bot enverra lors d'un déclenchement"
  type = OptionType.STRING
  required = false
  choices = null
}
