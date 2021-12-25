import { OptionType } from "@/core/discord/discord.constant"
import Option from "@/core/option/option"

export default class DurationOption implements Option {
  name = "durée"
  description = "Durée en prison avant d'être automatiquement redéplacé. (3min par défaut)"
  type = OptionType.INTEGER
  required = false
  choices = [
    { name: "1 minute", value: 1 },
    { name: "5 minutes", value: 5 },
    { name: "10 minutes", value: 10 },
    { name: "15 minutes", value: 15 }
  ]
}
