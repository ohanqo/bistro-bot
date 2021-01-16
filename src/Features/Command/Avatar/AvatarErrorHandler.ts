import { TYPES } from "@/App/AppTypes";
import { Message } from "discord.js";
import { inject, injectable } from "inversify";

@injectable()
export default class AvatarErrorHandler {
  private DEFAULT_CHANGE_AVATAR_TEXT = "il y a problème avec l'image que tu as envoyée…";
  private ERROR_MAPPINGS = { 50035: "tu changes trop vite d'avatar chacal, réesaye plus tard" };

  constructor(@inject(TYPES.MESSAGE) private message: Message) {}

  public async handle(error: any) {
    console.error("[AVATAR] — An error as occurred while changing bot avatar…", error);
    const message = this.retrieveErrorMessage(error?.code ?? 0);
    await this.message.reply(message);
  }

  private retrieveErrorMessage(code: number) {
    const error = Object.entries(this.ERROR_MAPPINGS).find((item) => item[0] === code.toString());
    return error ? error[1] : this.DEFAULT_CHANGE_AVATAR_TEXT;
  }
}
