import { injectable } from "inversify";

@injectable()
export default class Constant {
  public BOT_ACTIVITY = "soulever brochette";
  public JAIL_CHANNEL_NAME = "Pour les casses couilles";
  public JAIL_ROLE_NAME = "JAILED";
  public JAIL_ROLE_COLOR = "#FF7400";

  public DEFAULT_ROLE_NAME = "Sous-merdes";
  public DEFAULT_ROLE_COLOR = "#d9c0f3";

  public USER_AGENT =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36";
}
