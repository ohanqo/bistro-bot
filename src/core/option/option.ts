import { OptionType } from "../discord/discord.constant"
import OptionChoice from "./option-choice"

export default interface Option {
  name: string
  description: string
  type: OptionType
  required: Boolean
  choices: OptionChoice[] | null
}
