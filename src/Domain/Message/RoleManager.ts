import { TYPES } from "@/App/AppTypes";
import { Collection, Guild, GuildMember, Role, RoleData } from "discord.js";
import { inject, injectable } from "inversify";

@injectable()
export default class RoleManager {
  constructor(@inject(TYPES.GUILD) private guild: Guild) {}

  async findOrCreate(data: RoleData): Promise<Role> {
    const potentialRole = this.guild.roles.cache.find((role) => role.name === data.name);
    return potentialRole ?? (await this.guild.roles.create({ data }));
  }

  async removeAllForMember(member: GuildMember) {
    return await Promise.all(
      member.roles.cache.map(async (role) => {
        if (role.name !== "@everyone") {
          await member.roles.remove(role.id);
        }
      }),
    );
  }

  async removeMembersRolesAndApplyOne(members: Collection<string, GuildMember>, roleToAdd: Role) {
    return await Promise.all(
      members.map(async (member) => {
        await this.removeAllForMember(member);
        await member.roles.add(roleToAdd);
      }),
    );
  }
}
