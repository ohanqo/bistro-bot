import { injectable } from "inversify"
import winston from "winston"
import winstonImpl from "./winston"

@injectable()
export default class Logger {
  // TODO: Implement level of debug

  private loggerImpl: winston.Logger

  constructor() {
    this.loggerImpl = winstonImpl
  }

  public info(message: string) {
    this.loggerImpl.info(message)
  }

  public error(message: string) {
    this.loggerImpl.error(message)
  }
}
