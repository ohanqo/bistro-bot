import { ContainerModule, interfaces } from "inversify"
import { TYPES } from "../app/app.types"
import DiscordClient from "./discord.client"
import OnInteractionCreateHandler from "./on-interaction-create.handler"

const discordModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(TYPES.DISCORD_HANDLER).to(OnInteractionCreateHandler).inSingletonScope()
  bind(TYPES.INTERACTION).toConstantValue({})
  bind(DiscordClient).toSelf().inSingletonScope()
})

export { discordModule }
