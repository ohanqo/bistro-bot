import { TYPES } from "@/core/app/app.types"
import Command from "@/core/command/command"
import { command } from "@/core/command/command.decorator"
import SenderIsAdminGuard from "@/core/guard/common/sender-is-admin.guard"
import { guards } from "@/core/guard/guard.decorator"
import Logger from "@/core/logger/logger"
import { filename } from "@/core/logger/winston"
import { CommandInteraction } from "discord.js"
import fs from "fs"
import { inject } from "inversify"
import { dirname } from "path"

@command("logs", "ADMIN | Affiche les logs du bot.")
@guards(SenderIsAdminGuard)
export default class LoggerCommand extends Command {
  constructor(
    @inject(TYPES.INTERACTION)
    private interaction: CommandInteraction,
    @inject(TYPES.LOGGER)
    private logger: Logger
  ) {
    super()
  }

  async execute(): Promise<void> {
    try {
      const logFilePath = `${dirname(require?.main?.filename ?? "")}/${filename}`
      const data = fs.readFileSync(logFilePath, "utf-8")
      const logs = data.slice(-1000)
      await this.interaction.reply({ ephemeral: true, content: `\`\`\`${logs}\`\`\`` })
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error.message)
      }

      await this.interaction.reply({
        ephemeral: true,
        content: "Une erreur est survenue lors de la lecture du fichier de log…"
      })
    }
  }
}
