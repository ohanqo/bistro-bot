import { domainModule } from "@/Domain/DomainModule";
import { memberAddedModule } from "@/Features/MemberAdded/MemberAddedModule";
import { GuildMember } from "discord.js";
import { Container, injectable } from "inversify";
import { TYPES } from "../AppTypes";

@injectable()
export default class MemberAddScopeBuilder {
  public buildScope(member: GuildMember): Container {
    const scopedContainer = new Container({ defaultScope: "Singleton" });
    scopedContainer.load(domainModule, memberAddedModule);

    scopedContainer.bind(TYPES.MEMBER).toConstantValue(member);
    scopedContainer.bind(TYPES.GUILD).toConstantValue(member.guild);

    return scopedContainer;
  }
}
