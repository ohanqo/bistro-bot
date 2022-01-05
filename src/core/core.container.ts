import { REST } from "@discordjs/rest"
import { Client, Intents } from "discord.js"
import { Container } from "inversify"
import App from "./app/app"
import { TYPES } from "./app/app.types"
import { commandModule } from "./command/command.module"
import { discordModule } from "./discord/discord.module"
import { guardModule } from "./guard/guard.module"
import Logger from "./logger/logger"
import { youtubeModule } from "./youtube/youtube.module"

const coreContainer = new Container()

coreContainer.bind(TYPES.LOGGER).to(Logger).inSingletonScope()
coreContainer.bind(TYPES.CLIENT).toConstantValue(
  new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_VOICE_STATES,
      Intents.FLAGS.GUILD_PRESENCES
    ]
  })
)
coreContainer.bind(TYPES.REST).toConstantValue(new REST({ version: "9" }))
coreContainer.bind(App).toSelf().inSingletonScope()
coreContainer.load(discordModule, commandModule, youtubeModule, guardModule)

export { coreContainer }
