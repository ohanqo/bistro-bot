import { TYPES } from "@/core/app/app.types"
import Command from "@/core/command/command"
import { command } from "@/core/command/command.decorator"
import "@/core/discord/discord.extensions"
import { guards } from "@/core/guard/guard.decorator"
import { options } from "@/core/option/option.decorator"
import { CommandInteraction, GuildMember, Role, VoiceChannel } from "discord.js"
import { inject, injectable } from "inversify"
import SenderCanManageRolesGuard from "./guards/sender-can-manage-roles.guard"
import TargetIsNonAdminGuard from "./guards/target-is-non-admin.guard"
import TargetIsNotInJailGuard from "./guards/target-is-not-in-jail.guard"
import JailManager from "./jail.manager"
import JailState from "./jail.state"
import MemberInJail from "./member-in-jail.model"
import DurationOption from "./options/duration.option"
import MemberOption from "./options/member.option"

@command("jail", "Déplace un membre en prison, l'empêchant de communiquer.")
@options(MemberOption, DurationOption)
@guards(TargetIsNonAdminGuard, TargetIsNotInJailGuard, SenderCanManageRolesGuard)
export default class JailCommand extends Command {
  constructor(
    @inject(TYPES.INTERACTION)
    private interaction: CommandInteraction,
    @inject(TYPES.JAIL_MANAGER)
    private jailManager: JailManager,
    @inject(TYPES.JAIL_STATE)
    private jailState: JailState
  ) {
    super()
  }

  async execute() {
    const jail = await this.jailManager.findOrCreateJail()
    const role = await this.jailManager.findOrCreateRole()
    const member = this.interaction.options.getMember("membre") as GuildMember | null
    const duration = this.interaction.options.getInteger("durée") ?? 3

    if (member && jail && role) {
      const memberInJail = new MemberInJail(
        member,
        member.voice.channel as VoiceChannel | null,
        member.getRoles(),
        duration
      )
      await member.replaceRoles(role)
      await member.moveToChannel(jail)
      this.jailState.pushMemberIntoJail(memberInJail)
      await this.handleSuccessReply(member, jail, duration, role)
    } else {
      await this.handleErrorReply()
    }
  }

  private async handleSuccessReply(
    member: GuildMember,
    jail: VoiceChannel,
    duration: Number,
    role: Role
  ) {
    let message: string

    if (member.isInVoiceChannel()) {
      message = `${member.displayName} a été déplacé dans le salon ${jail.name} pendant ${duration} minute(s).`
    } else {
      message = `${member.displayName} a été assigné au rôle: ${role.name}.`
    }

    await this.interaction.reply({ ephemeral: true, content: message })
  }

  private async handleErrorReply() {
    const message =
      "Une erreur est survenue, impossible de récupèrer les informations nécessaires pour déplacer le membre…"
    await this.interaction.reply({ ephemeral: true, content: message })
  }
}
