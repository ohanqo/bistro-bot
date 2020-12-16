import { domainModule } from "@/Domain/DomainModule";
import { commandModule } from "@/Features/Command/CommandModule";
import { validatorModule } from "@/Features/Validator/ValidatorModule";
import { Client, Message } from "discord.js";
import { Container, injectable } from "inversify";
import { AppContainer } from "../AppContainer";
import AppState from "../AppState";
import { TYPES } from "../AppTypes";

@injectable()
export default class MessageScopeBuilder {
  public buildScope(message: Message): Container {
    const state = AppContainer.get<AppState>(TYPES.STATE);
    const client = AppContainer.get<Client>(TYPES.CLIENT);
    const scopedContainer = new Container({ defaultScope: "Singleton" });

    scopedContainer.load(domainModule, commandModule, validatorModule);
    scopedContainer.bind(TYPES.PREFIX).toConstantValue(process.env.COMMAND_PREFIX);
    scopedContainer.bind(TYPES.KEYWORD).toConstantValue(this.extractKeyword(message.content));
    scopedContainer.bind(TYPES.MESSAGE).toConstantValue(message);
    scopedContainer
      .bind(TYPES.MESSAGE_CONTENT_LOWERED)
      .toConstantValue(message.content.toLocaleLowerCase());
    scopedContainer.bind(TYPES.GUILD).toConstantValue(message.guild);
    scopedContainer.bind(TYPES.STATE).toConstantValue(state);
    scopedContainer.bind(TYPES.CLIENT).toConstantValue(client);

    return scopedContainer;
  }

  public extractKeyword(content: string): string {
    return content.split(" ")[0].slice(1, content.length - 1);
  }
}
