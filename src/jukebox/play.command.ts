import "@/core/app/app.extensions"
import { TYPES } from "@/core/app/app.types"
import Command from "@/core/command/command"
import { command } from "@/core/command/command.decorator"
import { guards } from "@/core/guard/guard.decorator"
import { options } from "@/core/option/option.decorator"
import YoutubeRepository from "@/core/youtube/youtube.repository"
import { DiscordGatewayAdapterCreator, joinVoiceChannel } from "@discordjs/voice"
import { CommandInteraction, GuildMember } from "discord.js"
import { inject } from "inversify"
import SenderIsInChannelGuard from "./guards/sender-is-in-channel.guard"
import TitleOption from "./options/title.option"
import Player from "./player"

@command("play", "Ajoute un morceau à la file d'attente.")
@options(TitleOption)
@guards(SenderIsInChannelGuard)
export default class PlayCommand extends Command {
  constructor(
    @inject(YoutubeRepository) private repository: YoutubeRepository,
    @inject(TYPES.INTERACTION) private interaction: CommandInteraction,
    @inject(Player) private player: Player
  ) {
    super()
  }

  async execute() {
    const option = this.interaction.options.getString("titre")!

    let url = ""
    if (option.isYoutubeURL()) {
      url = option as string
    } else {
      const response = await this.repository.getFirstVideo(option)
      if (response.isSuccess) {
        const value = response.getValue()
        const videoId = value?.items[0].id.videoId
        url = `https://www.youtube.com/watch?v=${videoId}`
      } else {
        const error = response.error ?? "Impossible de trouver de video correspondante…"
        await this.interaction.reply({ ephemeral: true, content: error })
        return
      }
    }

    if (!this.interaction.guild?.me?.isInVoiceChannel()) {
      this.joinSenderChannel()
    }

    this.player.addToQueue(url)

    if (this.player.isIdling()) {
      await this.player.next()
    }

    await this.interaction.reply({
      ephemeral: true,
      content: "Musique ajouté à la file d'attente…"
    })
  }

  private joinSenderChannel() {
    const guildId = this.interaction.guild?.id ?? ""
    const adapterCreator = this.interaction.guild
      ?.voiceAdapterCreator! as DiscordGatewayAdapterCreator
    const channelId = (this.interaction.member as GuildMember).voice.channel?.id!
    const connection = joinVoiceChannel({ channelId, guildId, adapterCreator })
    connection.subscribe(this.player.getPlayer())
  }
}
