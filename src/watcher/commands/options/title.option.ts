import { OptionType } from "@/core/discord/discord.constant"
import Option from "@/core/option/option"

export default class TitleOption implements Option {
  name = "titre"
  description = "Personnalise le titre du message que le bot enverra lors d'un déclenchement."
  type = OptionType.STRING
  required = false
  choices = null
}
