import DiscordEntity from "@/core/discord/discord.entity"
import { Entity } from "typeorm"

@Entity({ name: "jails" })
export default class JailEntity extends DiscordEntity {}
