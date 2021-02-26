import AppState from "@/App/AppState";
import { TYPES } from "@/App/AppTypes";
import Constant from "@/Domain/Constant";
import ChannelManager from "@/Domain/Message/ChannelManager";
import RoleManager from "@/Domain/Message/RoleManager";
import SenderHasEditRolePermissionValidator from "@/Features/Validator/SenderHasEditRolePermissionValidator";
import TargetsAreNotAdminValidator from "@/Features/Validator/TargetsAreNotAdminValidator";
import { Channel, Message, Role } from "discord.js";
import { inject, injectable } from "inversify";
import { Repository } from "typeorm";
import AbstractCommand from "../AbstractCommand";
import JailChannelEntity from "./JailChannelEntity";

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
    @inject(TYPES.JAIL_CHANNEL_REPOSITORY)
    private jailChannelRepository: Repository<JailChannelEntity>,
    @inject(TYPES.TARGETS_NOT_ADMIN_VALIDATOR)
    targetsNonAdminValidator: TargetsAreNotAdminValidator,
    @inject(TYPES.SENDER_HAS_EDIT_ROLE_VALIDATOR)
    senderHasEditRoleValidator: SenderHasEditRolePermissionValidator,
  ) {
    super();
    this.validators = [targetsNonAdminValidator, senderHasEditRoleValidator];
  }

  public async execute() {
    const mentions = this.message.mentions.members!;

    const channelRecord = await this.jailChannelRepository.findOne({
      guildId: this.message.guild?.id,
    });
    const channel = await this.channelManager.findOrCreate(channelRecord?.channelId ?? "");
    if (channelRecord === undefined) await this.saveChannelRecordFromChannel(channel);
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

  private async saveChannelRecordFromChannel(channel: Channel) {
    try {
      const entity = new JailChannelEntity();
      entity.channelId = channel.id;
      entity.guildId = this.message.guild?.id ?? "";
      await this.jailChannelRepository.save(entity);
    } catch (error) {
      console.log(
        "[JAIL] — An error as occurred while saving channel record in the database…",
        error,
      );
    }
  }
}
