import { AudioPlayerStatus, createAudioPlayer, createAudioResource } from "@discordjs/voice"
import { injectable } from "inversify"
import { raw as ytdl } from "youtube-dl-exec"

/**
 * Supprimer les dépendances inutiles ?
 */
@injectable()
export default class Player {
  private queueIndex = -1
  private queue: string[] = [] // url list
  private player = createAudioPlayer({ debug: true })

  constructor() {
    this.player.on(AudioPlayerStatus.Idle, () => {
      this.next()
    })
  }

  public addToQueue(url: string) {
    console.log("URL -> " + url)
    this.queue.push(url)
  }

  public getPlayer() {
    return this.player
  }

  public async next(): Promise<boolean> {
    if (this.queueIndex === this.queue.length - 1) return false

    this.queueIndex++
    const url = this.queue[this.queueIndex]
    const stream = ytdl(
      url,
      {
        o: "-",
        q: "",
        f: "bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio",
        r: "100K"
      },
      { stdio: ["ignore", "pipe", "ignore"] }
    )

    if (stream.stdout == null) return false
    const resource = createAudioResource(stream.stdout)
    this.player.play(resource)
    return true
  }

  public isIdling() {
    return this.player.state.status == AudioPlayerStatus.Idle
  }

  public pause() {
    this.player.pause()
  }

  public resume() {
    this.player.unpause()
  }

  public stop() {
    this.queue = []
    this.queueIndex = -1
    this.player.stop()
  }

  public getFormattedQueue(): string {
    if (this.queue.length === 0) {
      return "Il n'y aucune musique dans la file d'attente."
    } else {
      const message = this.isIdling()
        ? `Aucune musique n'est en cours de lecture !`
        : this.queue
            .slice(this.queueIndex)
            .map((url, index) => `${index + 1}: ${url}`)
            .join("\n")

      return message
    }
  }
}
