import { TYPES } from "@/App/AppTypes";
import Validator from "@/Features/Validator/Validator";
import { Message, MessageEmbed } from "discord.js";
import { inject, injectable } from "inversify";

@injectable()
export default class DeleteWatcherArgumentValidator implements Validator {
  constructor(
    @inject(TYPES.PREFIX) private prefix: string,
    @inject(TYPES.MESSAGE) private message: Message,
    @inject(TYPES.MESSAGE_CONTENT_LOWERED) private content: string,
  ) {}

  public async validate() {
    const argument = this.content.split(" ")[1];
    const isValid = this.validateArgument(argument);

    if (!isValid) {
      await this.sendErrorMessage();
    }

    return isValid;
  }

  private validateArgument(argument: any) {
    const isNumeric =
      (typeof argument === "number" || (typeof argument === "string" && argument.trim() !== "")) &&
      !isNaN(argument as number);

    return argument !== undefined && isNumeric;
  }

  private async sendErrorMessage() {
    const message = new MessageEmbed()
      .setColor("#EF4444")
      .setTitle("Erreur de commande")
      .setDescription("La formulation de la commande n'est pas correcte…")
      .addField("#", `${this.prefix}watch:delete <ID>`)
      .addField(
        "ID",
        `Correspond à l'identifiant d'un watcher. On peut les récupérer avec la commande: \`\`\`${this.prefix}watch:list\`\`\``,
      );

    await this.message.reply(message);
  }
}
