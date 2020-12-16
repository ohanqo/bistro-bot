import { TYPES } from "@/App/AppTypes";
import ChannelManager from "@/Domain/Message/ChannelManager";
import State from "@/App/AppState";
import TargetAreInJailValidator from "@/Features/Validator/TargetsAreInJailValidator";
import TargetsAreNotAdminValidator from "@/Features/Validator/TargetsAreNotAdminValidator";
import { Message } from "discord.js";
import { inject, injectable } from "inversify";
import AbstractCommand from "../AbstractCommand";
import SenderHasEditRolePermissionValidator from "@/Features/Validator/SenderHasEditRolePermissionValidator";

@injectable()
export default class UnjailCommand extends AbstractCommand {
  public keyword = "unjail";

  constructor(
    @inject(TYPES.STATE)
    private state: State,
    @inject(TYPES.MESSAGE)
    private message: Message,
    @inject(TYPES.CHANNEL_MANAGER)
    private channelManager: ChannelManager,
    @inject(TYPES.TARGETS_NOT_ADMIN_VALIDATOR)
    targetsNonAdminValidator: TargetsAreNotAdminValidator,
    @inject(TYPES.TARGETS_IN_JAIL_VALIDATOR)
    targetsInJailValidator: TargetAreInJailValidator,
    @inject(TYPES.SENDER_HAS_EDIT_ROLE_VALIDATOR)
    senderHasEditRoleValidator: SenderHasEditRolePermissionValidator,
  ) {
    super();
    this.validators = [
      targetsNonAdminValidator,
      targetsInJailValidator,
      senderHasEditRoleValidator,
    ];
  }

  public async execute() {
    const mentions = this.message.mentions.members;
    if (!mentions) return;

    await Promise.all(
      mentions.map(async (member) => {
        const jailedMember = this.state.jailedMembers.find((jm) => jm.memberId === member.id);
        if (!jailedMember) return;

        await member.roles.set(jailedMember.originalRoleList);

        const channel = this.channelManager.findById(jailedMember.originalChannelId);
        if (channel) await this.channelManager.moveMemberToVoiceChannel(member, channel);

        this.state.jailedMembers = this.state.jailedMembers.filter(
          (jm) => jm.memberId !== jailedMember.memberId,
        );
      }),
    );
  }
}
