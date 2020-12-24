import { TYPES } from "@/App/AppTypes";
import Validator from "@/Features/Validator/Validator";
import { Message, MessageEmbed } from "discord.js";
import { inject, injectable } from "inversify";
import "@/App/AppCustomProperty";

@injectable()
export default class WebsiteWatcherArgumentValidator implements Validator {
  constructor(
    @inject(TYPES.PREFIX) private prefix: string,
    @inject(TYPES.MESSAGE) private message: Message,
    @inject(TYPES.MESSAGE_CONTENT_LOWERED) private content: string,
  ) {}

  public async validate() {
    const isValid = this.validateURL() && this.validateQuerySelector();

    if (!isValid) {
      await this.sendErrorMessage();
    }

    return isValid;
  }

  private validateURL(): boolean {
    const splittedContent = this.content.split(" ");
    return splittedContent.length > 1;
  }

  private validateQuerySelector(): boolean {
    const querySelector = this.content.inQuoteContent();
    return !!querySelector;
  }

  private async sendErrorMessage() {
    const message = new MessageEmbed()
      .setColor("#EF4444")
      .setTitle("Erreur de commande")
      .setDescription("La formulation de la commande n'est pas correcte…")
      .addField("#", `${this.prefix}watch <URL> "<QuerySelector>"`)
      .addField("URL", "URL de la page sur laquelle on souhaite être notifié des changements.")
      .addField(
        "QuerySelector",
        "Ensemble des classes ou id d'une partie HTML du site permettant de faire les comparaisons. C'est cette partie de la page qui devra subir des changements pour pouvoir être notifié. On peut obtenir ce dernier en faisant un clic droit et `Inspecter l'élément` sur la page.",
      )
      .addField(
        "Example",
        `${this.prefix}watch https://github.com/ohanqo/bistro-bot/blob/master/docs/CHANGELOG.md "#readme"`,
      )
      .setImage(
        "https://i.octopus.com/blog/2018-10/selenium/6-finding-elements-by-xpaths-and-css-selectors/image2.png",
      )
      .setFooter("Comment trouver le QuerySelector de l'élément survolé");

    await this.message.reply(message);
  }
}
