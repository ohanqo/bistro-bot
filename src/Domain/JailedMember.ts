import { Role } from "discord.js";

export default class JailedMember {
  constructor(
    public memberId = "",
    public originalChannelId = "",
    public originalRoleList: Role[] = [],
  ) {}
}
