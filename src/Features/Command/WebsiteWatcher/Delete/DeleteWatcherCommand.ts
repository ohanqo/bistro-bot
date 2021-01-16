import { TYPES } from "@/App/AppTypes";
import { Message } from "discord.js";
import { inject, injectable } from "inversify";
import { Repository } from "typeorm";
import AbstractCommand from "../../AbstractCommand";
import WebsiteWatcherEntity from "../WebsiteWatcherEntity";
import DeleteWatcherArgumentValidator from "./DeleteWatcherArgumentValidator";

@injectable()
export default class DeleteWatcherCommand extends AbstractCommand {
  public keyword = "watch:delete";

  constructor(
    @inject(TYPES.MESSAGE)
    private message: Message,
    @inject(TYPES.DELETE_WATCHER_ARGS_VALIDATOR)
    argsValidator: DeleteWatcherArgumentValidator,
    @inject(TYPES.WEBSITE_WATCHER_REPOSITORY)
    private websiteWatcherRepository: Repository<WebsiteWatcherEntity>,
  ) {
    super();
    this.validators = [argsValidator];
  }

  public async execute() {
    try {
      const id = this.message.content.split(" ")[1];
      await this.deleteWatcher(id);
    } catch (error) {
      console.error("[DELETE-WATCHER] — An error as occurred while deleting specified watcher…", error);
      await this.message.react("❌");
      await this.message.reply("une erreur est survenue lors de la tentative de suppression…");
    }
  }

  private async deleteWatcher(id: string) {
    const potentialEntity = await this.websiteWatcherRepository.findOne(id);

    if (potentialEntity) {
      await this.websiteWatcherRepository.remove(potentialEntity);
      await this.message.react("✅");
      await this.message.reply("watcher supprimé");
    } else {
      await this.message.react("❌");
      await this.message.reply(`aucun watcher correspond à l'ID ${id}`);
    }
  }
}
