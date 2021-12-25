export default interface DiscordHandler {
  handle(...params: any): Promise<void>;
}
