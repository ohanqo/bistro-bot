import Bree from "bree/types"
import { inject, injectable } from "inversify"
import DiscordClient from "../discord/discord.client"
import { TYPES } from "./app.types"

@injectable()
export default class App {
  constructor(private discordClient: DiscordClient) {}

  public async startDiscord(token: string | undefined) {
    this.discordClient.registerHandlers()
    await this.discordClient.login(token)
    await this.discordClient.refreshCommands(token)
  }
}
