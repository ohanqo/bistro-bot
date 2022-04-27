import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/rest/v9"
import { Client } from "discord.js"
import { inject, injectable, multiInject } from "inversify"
import { TYPES } from "../app/app.types"
import Command from "../command/command"
import DiscordHandler from "./discord.handler"

@injectable()
export default class DiscordClient {
  constructor(
    @inject(TYPES.REST) private rest: REST,
    @inject(TYPES.CLIENT) private client: Client,
    @multiInject(TYPES.COMMAND) private commands: Command[],
    @multiInject(TYPES.DISCORD_HANDLER) private handlers: DiscordHandler[]
  ) {}

  public registerHandlers() {
    this.handlers.forEach((handler) =>
      this.client.on((handler as any).event, (...params: any) => handler.handle(...params))
    )
  }

  public async login(token: string | undefined) {
    if (token) await this.client.login(token)
  }

  public async refreshCommands(token: string | undefined) {
    try {
      if (!token) return

      const clientId = this.client.application?.id ?? ""
      const commands = this.commands.map((command) => {
        return {
          name: command.keyword,
          description: command.description,
          options: command.options
        }
      })

      console.log("commands: " + JSON.stringify(commands))

      // await this.rest.setToken(token).put(Routes.applicationCommands(clientId), {
      //   body: [],
      //   headers: { "Authorization": `Bot ${process.env.DISCORD_CLIENT_ID}` }
      // })

      // Discord client id
      await this.rest
        .setToken(token)
        .put(Routes.applicationGuildCommands(clientId, "288767835763638273"), {
          body: commands,
          headers: { "Authorization": `Bot ${process.env.DISCORD_CLIENT_ID}` }
        })
    } catch (error) {
      console.log("error =>", error)
    }
  }
}
