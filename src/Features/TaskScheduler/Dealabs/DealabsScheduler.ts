import { TYPES } from "@/App/AppTypes";
import { Client, EmbedFieldData, MessageEmbed, TextChannel } from "discord.js";
import { inject, injectable } from "inversify";
import { Browser } from "puppeteer";
import Deal from "./Deal";
import * as cron from "node-cron";

@injectable()
export default class DealabsScheduler {
  constructor(
    @inject(TYPES.CLIENT) private client: Client,
    @inject(TYPES.BROWSER) private browser: Promise<Browser>,
  ) {}

  public async init() {
    cron.schedule("0 19 * * *", () => this.publishNewDeals());
  }

  private async publishNewDeals() {
    const deals = await this.fetchDeals();
    const dealsWithSpacing = this.addSpaceBetweenSection(deals);
    const fields: EmbedFieldData[] = dealsWithSpacing.map((deal) => {
      return {
        name: deal.title,
        value: deal.link,
      };
    });

    const color = Math.floor(Math.random() * 16777215).toString(16);

    const message = new MessageEmbed()
      .setColor(`#${color}`)
      .setTitle(`DEALS DU JOUR — ${this.getFormattedDate()}`)
      .setThumbnail("https://pbs.twimg.com/profile_images/479251986391379968/gNJPLQNb_400x400.png")
      .addFields(fields)
      .setTimestamp();

    // Refacto
    const name = "deals";
    await Promise.all(
      this.client.guilds.cache.map(async (guild) => {
        const potentialChannel = guild.channels.cache.find((channel) => channel.name === name);
        const channel = potentialChannel ?? (await guild.channels.create(name, { type: "text" }));
        await (channel as TextChannel).send(message);
      }),
    );
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
    const navigator = await this.browser;
    const pages = await navigator.pages();
    const page = pages[0];

    await page.goto("https://www.dealabs.com/", { waitUntil: "networkidle0" });

    return await page.evaluate(() => {
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
  }
}
