import { OptionType } from "@/core/discord/discord.constant"
import Option from "@/core/option/option"

export default class ScreenshotOption implements Option {
  name = "screenshot"
  description = "Screenshot l'élement via son QuerySelector, le screenshot sera attaché au message."
  type = OptionType.STRING
  required = false
  choices = null
}
