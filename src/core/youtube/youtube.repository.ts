import { injectable } from "inversify";
import { Result } from "./Result";
import SearchResponse from "./search.response";
import YoutubeService from "./youtube.service";

@injectable()
export default class YoutubeRepository {
  constructor(private service: YoutubeService) {}

  public async getFirstVideo(title: string): Promise<Result<SearchResponse>> {
    try {
      const response = await this.service.getFirstVideo(title);
      console.log("Response => " + JSON.stringify(response));
      return Result.ok(response);
    } catch (error: any) {
      if (error instanceof Error) {
        console.log("|YoutubeRepository| " + error.stack);
      }
      return Result.fail(error?.message ?? "Unable to fetch youtube data.");
    }
  }
}

