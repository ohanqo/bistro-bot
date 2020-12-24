import { domainModule } from "@/Domain/DomainModule";
import { schedulerModule } from "@/Features/TaskScheduler/TaskSchedulerModule";
import { databaseModule } from "@/Features/_shared/DatabaseModule";
import { Client } from "discord.js";
import { Container, injectable } from "inversify";
import { Browser } from "puppeteer";
import { AppContainer } from "../AppContainer";
import { TYPES } from "../AppTypes";

@injectable()
export default class TaskSchedulerScopeBuilder {
  public async buildScope(): Promise<Container> {
    const client = AppContainer.get<Client>(TYPES.CLIENT);
    const browser = AppContainer.get<Promise<Browser>>(TYPES.BROWSER);
    const scopedContainer = new Container({ defaultScope: "Singleton" });
    await scopedContainer.loadAsync(databaseModule);
    scopedContainer.load(domainModule, schedulerModule);
    scopedContainer.bind(TYPES.BROWSER).toConstantValue(browser);
    scopedContainer.bind(TYPES.CLIENT).toConstantValue(client);
    return scopedContainer;
  }
}
