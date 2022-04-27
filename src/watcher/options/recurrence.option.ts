import { OptionType } from "@/core/discord/discord.constant"
import Option from "@/core/option/option"

export default class RecurrenceOption implements Option {
  name = "récurrence"
  description = "Récurrence à laquelle le bot doit vérifier si l'élément a changé (ex: 0 19 * * *)"
  type = OptionType.STRING
  required = false
  choices = null
}

/**
 * screenshot, title, description
 */

/**
 * Liste: forcément différent
 * -> Se base sur une récurrence pour s'afficher
 * -> Commande différente (pas besoin de screenshot, title, description)
 */
