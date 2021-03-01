import { domainModule } from "@/Domain/DomainModule";
import { reactionModule } from "@/Features/Reaction/ReactionModule";
import { databaseModule } from "@/Features/_shared/DatabaseModule";
import { Client, MessageReaction, PartialUser, User } from "discord.js";
import { Container, injectable } from "inversify";
import { AppContainer } from "../AppContainer";
import { TYPES } from "../AppTypes";

@injectable()
export default class ReactionScopeBuilder {
  public async buildScope(reaction: MessageReaction, user: User | PartialUser): Promise<Container> {
    const client = AppContainer.get<Client>(TYPES.CLIENT);
    const scopedContainer = new Container();
    await scopedContainer.loadAsync(databaseModule);

    scopedContainer.bind(TYPES.CLIENT).toConstantValue(client);
    scopedContainer.bind(TYPES.USER).toConstantValue(user);
    scopedContainer.bind(TYPES.REACTION).toConstantValue(reaction);

    scopedContainer.load(reactionModule);

    return scopedContainer;
  }
}
