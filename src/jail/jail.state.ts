import "@/core/discord/discord.extensions"
import { injectable } from "inversify"
import MemberInJail from "./member-in-jail.model"

@injectable()
export default class JailState {
  private memberInJailMap: Map<string, MemberInJail> = new Map()

  public pushMemberIntoJail(memberInJail: MemberInJail) {
    this.memberInJailMap.set(memberInJail.member.id, memberInJail)
    memberInJail.startTimeout()
  }

  public removeMemberFromJail(memberId: string) {
    const memberInJail = this.memberInJailMap.get(memberId)
    memberInJail?.stopTimeout()
    this.memberInJailMap.delete(memberId)
  }

  public removeAllMembers() {
    this.memberInJailMap.forEach((member) => {
      this.removeMemberFromJail(member.member.id)
      this.memberInJailMap.delete(member.member.id)
    })
  }
}
