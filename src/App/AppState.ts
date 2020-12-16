import JailedMember from "@/Domain/JailedMember";
import { GuildMember } from "discord.js";
import { injectable } from "inversify";

@injectable()
export default class AppState {
  public jailedMembers: JailedMember[] = [];

  public pushMembersToJail(members: GuildMember[]) {
    this.jailedMembers.push(
      ...members.map(
        (member) =>
          new JailedMember(
            member.id,
            member.voice.channel?.id,
            member.roles.cache.map((role) => role),
          ),
      ),
    );
  }
}
