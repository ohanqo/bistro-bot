import { AxiosInstance } from "axios";
import { inject, injectable } from "inversify";
import { TYPES } from "../app/app.types";
import SearchResponse from "./search.response";

@injectable()
export default class YoutubeService {
  constructor(@inject(TYPES.YT_HTTP) private http: AxiosInstance) {}

  public async getFirstVideo(title: string): Promise<SearchResponse> {
    const response = await this.http.get("search", {
      params: {
        part: "snippet",
        q: title,
        maxResults: 1,
      },
    });

    return response.data;
  }
}
