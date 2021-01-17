import { TYPES } from "@/App/AppTypes";
import { EmbedFieldData, MessageEmbed } from "discord.js";
import { inject, injectable } from "inversify";
import { Browser } from "puppeteer";
import Deal from "./Deal";
import * as cron from "node-cron";
import DealabsChannelManager from "./DealabsChannelManager";

@injectable()
export default class DealabsScheduler {
  constructor(
    @inject(TYPES.BROWSER) private browser: Browser,
    @inject(TYPES.DEALABS_CHANNEL_MANAGER) private channelManager: DealabsChannelManager,
  ) {}

  public async init() {
    cron.schedule("0 19 * * *", () => this.publishNewDeals());
  }

  private async publishNewDeals() {
    const deals = await this.fetchDeals();
    const dealsWithSpacing = this.addSpaceBetweenSection(deals);
    const fields = this.convertDealsToFieldList(dealsWithSpacing);
    const message = this.generateEmbeddedMessage(fields);
    const channels = await this.channelManager.findOrCreateDealChannels();

    for (let channel of channels) {
      try {
        await channel.send(message);
      } catch (error) {
        console.error("[DEALABS] — An error as occurred while sending deals message…", error);
      }
    }
  }

  private convertDealsToFieldList(dealsWithSpacing: Deal[]): EmbedFieldData[] {
    return dealsWithSpacing.map((deal) => {
      return {
        name: deal.title,
        value: deal.link,
      };
    });
  }

  private generateEmbeddedMessage(fields: EmbedFieldData[]): MessageEmbed {
    const color = Math.floor(Math.random() * 16777215).toString(16);

    return new MessageEmbed()
      .setColor(`#${color}`)
      .setTitle(`DEALS DU JOUR — ${this.getFormattedDate()}`)
      .setThumbnail("https://pbs.twimg.com/profile_images/479251986391379968/gNJPLQNb_400x400.png")
      .addFields(fields)
      .setTimestamp();
  }

  private addSpaceBetweenSection(fields: Deal[]): Deal[] {
    const fieldsWithSpace = JSON.parse(JSON.stringify(fields));

    for (let i = 0; i < fields.length - 1; i++) {
      if (i !== 0 && i % 4 === 0) {
        const offset = fieldsWithSpace.length - fields.length;
        fieldsWithSpace.splice(i + offset, 0, { link: "\u200B", title: "\u200B" });
      }
    }

    return fieldsWithSpace;
  }

  private getFormattedDate() {
    let d = new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("/");
  }

  private async fetchDeals(): Promise<Deal[]> {
    const page = await this.browser.newPage();
    let deals: Deal[] = [];

    try {
      await page.goto("https://www.dealabs.com/", { waitUntil: "networkidle0" });

      deals = await page.evaluate(() => {
        const elements: Deal[] = [];

        document
          .querySelectorAll(".vue-portal-target .carousel-list .carousel-list-item a")
          .forEach((element) => {
            const title = element.textContent?.trim() ?? "";
            const href = element.getAttribute("href");
            const link = href ? `https://www.dealabs.com${href}` : "";
            elements.push({ title, link });
          });

        return elements;
      });
    } catch (error) {
      console.error("[DEALABS] — An error as occurred while retrieving deals…", error);
    } finally {
      await page.close();
      return deals;
    }
  }
}
