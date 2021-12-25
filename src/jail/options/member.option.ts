import { OptionType } from "@/core/discord/discord.constant"
import Option from "@/core/option/option"

export default class MemberOption implements Option {
  name = "membre"
  description = "Membre à mettre en prison"
  type = OptionType.USER
  required = true
  choices = null
}
