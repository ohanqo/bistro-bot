import { OptionType } from "@/core/discord/discord.constant"
import Option from "@/core/option/option"

export default class TypeOption implements Option {
  name = "type"
  description = "Type d'activité."
  type = OptionType.INTEGER
  required = false
  choices = [
    { name: "PLAYING", value: 0 },
    { name: "STREAMING", value: 1 },
    { name: "LISTENING", value: 2 },
    { name: "WATCHING", value: 3 },
    { name: "COMPETING", value: 5 }
  ]
}
