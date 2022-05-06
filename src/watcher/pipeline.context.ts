import { TYPES } from "@/core/app/app.types"
import Logger from "@/core/logger/logger"
import { inject, injectable } from "inversify"

@injectable()
export default class PipelineContext {
  constructor(@inject(TYPES.LOGGER) public logger: Logger) {}

  public textContent: string | null = null
  /**
   * using html as we need to manipulate data
   * differently according to differents scenarios
   * 
   * in one case, we just need to query the text content
   * in another case, we should query the title and a description
   */
  public outerHtmlList: string[] | null = null
  public hasContentChanged: boolean | null = null
}
