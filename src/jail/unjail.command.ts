import { TYPES } from "@/core/app/app.types"
import Command from "@/core/command/command"
import { command } from "@/core/command/command.decorator"
import { guards } from "@/core/guard/guard.decorator"
import { options } from "@/core/option/option.decorator"
import { CommandInteraction, GuildMember } from "discord.js"
import { inject, injectable } from "inversify"
import SenderCanManageRolesGuard from "./guards/sender-can-manage-roles.guard"
import TargetIsInJailGuard from "./guards/target-is-in-jail.guard"
import JailState from "./jail.state"
import MemberOptionalOption from "./options/member-optional.option"

@command("unjail", "Reset les membres en prison.")
@options(MemberOptionalOption)
@guards(TargetIsInJailGuard, SenderCanManageRolesGuard)
export default class UnjailCommand extends Command {
  constructor(
    @inject(TYPES.INTERACTION)
    private interaction: CommandInteraction,
    @inject(TYPES.JAIL_STATE)
    private jailState: JailState
  ) {
    super()
  }

  async execute() {
    const key = new MemberOptionalOption().name
    const potentialMember = this.interaction.options.getMember(key)

    if (potentialMember === null) {
      const message = "Tous les membres ont été sortis de prison."
      this.jailState.removeAllMembers()
      await this.interaction.reply({ ephemeral: true, content: message })
    } else {
      const member = potentialMember as GuildMember
      const message = `${member.displayName} n'est plus en prison.`
      this.jailState.removeMemberFromJail(member.id)
      await this.interaction.reply({ ephemeral: true, content: message })
    }
  }
}
