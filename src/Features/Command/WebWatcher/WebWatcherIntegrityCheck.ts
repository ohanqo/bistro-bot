import { TYPES } from "@/App/AppTypes";
import { inject, injectable } from "inversify";
import { Browser } from "puppeteer";
import "@/App/AppCustomProperty";
import { Message } from "discord.js";

@injectable()
export default class WebWatcherIntegrityCheck {
  constructor(
    @inject(TYPES.MESSAGE) private message: Message,
    @inject(TYPES.BROWSER) private browser: Promise<Browser>,
  ) {}

  public async check() {
    const content = this.message.content;
    const url = content.split(" ")[1];
    const querySelector = content.inQuoteContent()?.toString() ?? "";
    const browser = await this.browser;
    const page = await browser.newPage();

    try {
      await page.goto(url, { waitUntil: "networkidle0" });
      const numberOfElements = await page.evaluate((qs) => {
        return document.querySelectorAll(qs).length;
      }, querySelector);

      if (numberOfElements <= 0) {
        this.message.reply("Aucun élément trouvé sur la page…");
        return false;
      } else if (numberOfElements > 1) {
        this.message.reply(
          "Il y a trop d'éléments correspondant au queryselector envoyé… Il faut qu'il y ait seulement un seul élément qui soit trouvé.",
        );
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error(error);
      this.message.reply("Une erreur est survenue.");
      return false;
    } finally {
      await page.close();
    }
  }
}
