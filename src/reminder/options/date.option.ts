import { OptionType } from "@/core/discord/discord.constant"
import Option from "@/core/option/option"

export default class DateOption implements Option {
  name = "date"
  description = "Date à laquelle ton message doit t'être rappelé. Exemples: `La semaine prochaine`, `11/11/2021`"
  type = OptionType.STRING
  required = true
  choices = null
}
