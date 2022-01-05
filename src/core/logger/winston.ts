import winston, { format } from "winston"
const { printf, timestamp, combine } = format
import { dirname } from "path"

export const filename = "bistro-bot.log"

export default winston.createLogger({
  level: "info",
  format: combine(
    timestamp(),
    printf(({ level, message, timestamp }) => {
      if (message === "") {
        return ""
      }
      return `${timestamp} ${level.toUpperCase()} — ${message}`
    })
  ),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File({
      filename,
      dirname: dirname(require?.main?.filename ?? "")
    }),
    new winston.transports.Console()
  ]
})
