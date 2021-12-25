import { OptionType } from "@/core/discord/discord.constant"
import Option from "@/core/option/option"

export default class MemberOptionalOption implements Option {
  name = "membre"
  description = "Membre à sortir de prison"
  type = OptionType.USER
  required = false
  choices = null
}
