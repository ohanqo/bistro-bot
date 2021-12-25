import { GuildMember, Role, VoiceChannel } from "discord.js"
import { clearInterval } from "timers"

export default class MemberInJail {
  constructor(
    public member: GuildMember,
    public originalChannel: VoiceChannel | null,
    public originalRoleList: Role[] = [],
    public duration = 3
  ) {}

  private timeout: NodeJS.Timeout | undefined

  public startTimeout() {
    this.timeout = setTimeout(() => this.resetMemberStatus(), this.duration.toMinutes())
  }

  public stopTimeout() {
    if (this.timeout) clearInterval(this.timeout)
    this.resetMemberStatus()
  }

  private async resetMemberStatus() {
    try {
      await this.member.replaceRoles(...this.originalRoleList)
      if (this.originalChannel && this.member.isInVoiceChannel())
        await this.member.moveToChannel(this.originalChannel)
    } catch (error) {
      console.log(
        "[JAIL] An error occurred while trying to reset member status after jail time…",
        `\nRoles: ${this.originalRoleList.map((o) => o.name)}`,
        error
      )
    }
  }
}
