import { OptionType } from "@/core/discord/discord.constant"
import Option from "@/core/option/option"

export default class TitleOption implements Option {
  name = "titre"
  description = "Mots clés ou URL"
  type = OptionType.STRING
  required = true
  choices = null
}
