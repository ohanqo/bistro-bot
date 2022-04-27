import { OptionType } from "@/core/discord/discord.constant"
import Option from "@/core/option/option"

export default class UrlOption implements Option {
  name = "url"
  description = "URL du site web"
  type = OptionType.STRING
  required = true
  choices = null
}
