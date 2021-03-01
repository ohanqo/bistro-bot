import { TYPES } from "@/App/AppTypes";
import { inject, injectable } from "inversify";
import { Browser, Page } from "puppeteer";
import "@/App/AppCustomProperty";
import { Message, MessageEmbed } from "discord.js";
import Constant from "@/Domain/Constant";

@injectable()
export default class AddWatcherIntegrityCheck {
  constructor(
    @inject(TYPES.MESSAGE) private message: Message,
    @inject(TYPES.CONSTANT) private constant: Constant,
    @inject(TYPES.BROWSER) private browser: Browser,
  ) {}

  public async check() {
    const content = this.message.content;
    const url = content.split(" ")[1];
    const querySelector = content.inQuoteContent()?.toString() ?? "";
    const page = await this.browser.newPage();

    try {
      await page.goto(url, { waitUntil: "networkidle0" });
      await page.waitForSelector(querySelector, { timeout: 10_000 });
      const numberOfElements = await page.evaluate((qs) => {
        return document.querySelectorAll(qs).length;
      }, querySelector);

      if (numberOfElements > 1) {
        await this.message.reply(
          "il y a trop d'éléments correspondant au queryselector envoyé… Il faut qu'il y ait seulement un seul élément qui soit trouvé.",
        );
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error("[INTEGRITY-CHECK] — An error as occurred while checking provided website configuration…", error);
      await this.sendErrorMessage(page);
      return false;
    } finally {
      await page.close();
    }
  }

  private async sendErrorMessage(page: Page) {
    try {
      const screenshot = await page.screenshot();

      const embedded = new MessageEmbed()
        .setColor("#EF4444")
        .setTitle("Une erreur est survenue")
        .setDescription("Le queryselector n'est peut-être pas correct…");
      if (screenshot !== undefined && screenshot !== "") {
        embedded
          .attachFiles([{ name: "image.png", attachment: screenshot! }])
          .setImage("attachment://image.png");
      }

      await this.message.channel.send(embedded);
    } catch (error) {
      await this.message.reply("Une erreur est survenue…");
    }
  }
}
