import AppState from "@/App/AppState";
import { TYPES } from "@/App/AppTypes";
import Constant from "@/Domain/Constant";
import ChannelManager from "@/Domain/Message/ChannelManager";
import RoleManager from "@/Domain/Message/RoleManager";
import SenderHasEditRolePermissionValidator from "@/Features/Validator/SenderHasEditRolePermissionValidator";
import TargetsAreNotAdminValidator from "@/Features/Validator/TargetsAreNotAdminValidator";
import { Message, Role } from "discord.js";
import { inject, injectable } from "inversify";
import AbstractCommand from "../AbstractCommand";

@injectable()
export default class JailCommand extends AbstractCommand {
  public keyword = "jail";

  constructor(
    @inject(TYPES.STATE)
    private state: AppState,
    @inject(TYPES.MESSAGE)
    private message: Message,
    @inject(TYPES.CHANNEL_MANAGER)
    private channelManager: ChannelManager,
    @inject(TYPES.ROLE_MANAGER)
    private roleManager: RoleManager,
    @inject(TYPES.CONSTANT)
    private constants: Constant,
    @inject(TYPES.TARGETS_NOT_ADMIN_VALIDATOR)
    targetsNonAdminValidator: TargetsAreNotAdminValidator,
    @inject(TYPES.SENDER_HAS_EDIT_ROLE_VALIDATOR)
    senderHasEditRoleValidator: SenderHasEditRolePermissionValidator,
  ) {
    super();
    this.validators = [targetsNonAdminValidator, senderHasEditRoleValidator];
  }

  public async execute() {
    const { JAIL_CHANNEL_NAME } = this.constants;
    const mentions = this.message.mentions.members!;

    const channel = await this.channelManager.findOrCreate(JAIL_CHANNEL_NAME);
    const jailRole = await this.getJailRole();

    this.state.pushMembersToJail(mentions.map((m) => m));
    await this.roleManager.removeMembersRolesAndApplyOne(mentions, jailRole);
    await this.channelManager.moveMemberListToVoiceChannel(mentions, channel);
  }

  private async getJailRole(): Promise<Role> {
    const { JAIL_ROLE_NAME, JAIL_ROLE_COLOR } = this.constants;

    const role = await this.roleManager.findOrCreate({
      name: JAIL_ROLE_NAME,
      color: JAIL_ROLE_COLOR,
    });

    role.permissions.remove(
      "SEND_MESSAGES",
      "SPEAK",
      "CONNECT",
      "STREAM",
      "ADD_REACTIONS",
      "SEND_TTS_MESSAGES",
    );

    return role;
  }
}
