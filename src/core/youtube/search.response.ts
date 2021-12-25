export default class SearchResponse {
  public items: SearchResponseItem[] = [];
}

export class SearchResponseItem {
  public kind = "";
  public id = new SearchResponseIds();
  public snippet = new SearchResponseSnippet();
}

export class SearchResponseIds {
  public kind = "";
  public videoId = "";
  public channelId = "";
  public playlistId = "";
}

export class SearchResponseSnippet {
  public publishedAt = new Date();
  public channelId = "";
  public title = "";
  public description = "";
  public thumbnails: SearchResponseThumbnails = {};
  public channelTitle = "";
  public liveBroadcastContent = "";
}

export interface SearchResponseThumbnails {
  [key: string]: SearchResponseThumbnail;
}

export class SearchResponseThumbnail {
  public url = "";
  public width = 0;
  public height = 0;
}
