import { Container } from "inversify"
import { coreContainer } from "../core.container"
import App from "./app"

export default class AppFactory {
  static async create(containerBuilder: Promise<Container>): Promise<App> {
    const appContainer = await containerBuilder
    coreContainer.parent = appContainer
    return coreContainer.get<App>(App)
  }
}
