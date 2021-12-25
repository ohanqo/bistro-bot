import winston, { format } from "winston";
const { printf, timestamp, combine } = format;

export default winston.createLogger({
  level: "info",
  format: combine(
    timestamp(),
    printf(({ level, message, timestamp }) => {
      if (message === "") {
        return "";
      }
      return `${timestamp} ${level.toUpperCase()} — ${message}`;
    }),
  ),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File({ filename: "bistro-bot.log" }),
    new winston.transports.Console(),
  ],
});
