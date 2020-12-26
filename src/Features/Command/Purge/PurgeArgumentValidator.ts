import { TYPES } from "@/App/AppTypes";
import Validator from "@/Features/Validator/Validator";
import { Message, MessageEmbed } from "discord.js";
import { inject, injectable } from "inversify";

@injectable()
export default class PurgeArgumentValidator implements Validator {
  constructor(
    @inject(TYPES.PREFIX) private prefix: string,
    @inject(TYPES.MESSAGE) private message: Message,
  ) {}

  public async validate() {
    try {
      const argument = this.message.content.split(" ")[1];
      const number = Number(argument);
      const isValid = !isNaN(number) && number > 0 && number <= 99;

      if (!isValid) await this.sendErrorMessage();

      return isValid;
    } catch (error) {
      return false;
    }
  }

  private async sendErrorMessage() {
    const message = new MessageEmbed()
      .setColor("#EF4444")
      .setTitle("Erreur de commande")
      .setDescription("La formulation de la commande n'est pas correcte…")
      .addField("#", `${this.prefix}purge <number>`)
      .addField(
        "number",
        "Nombre de messages à supprimer. Ce nombre doit être compris entre 1 et 99.",
      );

    await this.message.reply(message);
  }
}
