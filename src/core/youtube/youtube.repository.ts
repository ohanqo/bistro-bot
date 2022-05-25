import { inject, injectable } from "inversify"
import { TYPES } from "../app/app.types"
import Logger from "../logger/logger"
import { Result } from "./result"
import SearchResponse from "./search.response"
import YoutubeService from "./youtube.service"

@injectable()
export default class YoutubeRepository {
  constructor(private service: YoutubeService, @inject(TYPES.LOGGER) private logger: Logger) {}

  public async getFirstVideo(title: string): Promise<Result<SearchResponse>> {
    try {
      const response = await this.service.getFirstVideo(title)
      return Result.ok(response)
    } catch (error: any) {
      if (error instanceof Error) {
        this.logger.error("[YoutubeRepository] " + error.stack)
      }
      return Result.fail(error?.message ?? "Unable to fetch youtube data.")
    }
  }
}
