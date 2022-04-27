import { TYPES } from "@/core/app/app.types"
import Logger from "@/core/logger/logger"
import { inject, injectable } from "inversify"

@injectable()
export default class PipelineContext {
  constructor(@inject(TYPES.LOGGER) public logger: Logger) {}

  public textContent: string | null = null
  public hasContentChanged: boolean | null = null
}
