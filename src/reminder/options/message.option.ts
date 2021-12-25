import { OptionType } from "@/core/discord/discord.constant"
import Option from "@/core/option/option"

export default class MessageOption implements Option {
  name = "message"
  description = "Message qui doit t'être rappellé."
  type = OptionType.STRING
  required = true
  choices = null
}
