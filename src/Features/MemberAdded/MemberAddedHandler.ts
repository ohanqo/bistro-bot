import { TYPES } from "@/App/AppTypes";
import Constant from "@/Domain/Constant";
import RoleManager from "@/Domain/Message/RoleManager";
import { GuildMember } from "discord.js";
import { inject, injectable } from "inversify";

@injectable()
export default class MemberAddedHandler {
  constructor(
    @inject(TYPES.MEMBER) private member: GuildMember,
    @inject(TYPES.ROLE_MANAGER) private roleManager: RoleManager,
    @inject(TYPES.CONSTANT) private constant: Constant,
  ) {}

  public async handle() {
    await this.assignDefaultRole();
  }

  private async assignDefaultRole() {
    const role = await this.roleManager.findOrCreate({
      name: this.constant.DEFAULT_ROLE_NAME,
      color: this.constant.DEFAULT_ROLE_COLOR,
    });
    await this.member.roles.add(role);
  }
}
