import { domainModule } from "@/Domain/DomainModule";
import { dealabsModule } from "@/Features/Dealabs/DealabsModule";
import { Client } from "discord.js";
import { Container, injectable } from "inversify";
import { Browser } from "puppeteer";
import { AppContainer } from "../AppContainer";
import { TYPES } from "../AppTypes";

@injectable()
export default class DealabsScopeBuilder {
  public buildScope(): Container {
    const client = AppContainer.get<Client>(TYPES.CLIENT);
    const browser = AppContainer.get<Promise<Browser>>(TYPES.BROWSER);
    const scopedContainer = new Container({ defaultScope: "Singleton" });
    scopedContainer.load(domainModule, dealabsModule);
    scopedContainer.bind(TYPES.BROWSER).toConstantValue(browser);
    scopedContainer.bind(TYPES.CLIENT).toConstantValue(client);
    return scopedContainer;
  }
}
