import { ContainerModule, interfaces } from "inversify";
import { TYPES } from "../app/app.types";
import { YoutubeHttp } from "./youtube.http";
import YoutubeRepository from "./youtube.repository";
import YoutubeService from "./youtube.service";

const youtubeModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(TYPES.YT_HTTP).toConstantValue(YoutubeHttp);
  bind(YoutubeService).toSelf();
  bind(YoutubeRepository).toSelf();
});

export { youtubeModule };
