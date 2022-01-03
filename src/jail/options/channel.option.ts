import { OptionType } from "@/core/discord/discord.constant"
import Option from "@/core/option/option"

export default class ChannelOption implements Option {
  name = "channel"
  description = "Channel"
  type = OptionType.CHANNEL
  required = true
  choices = null
}
