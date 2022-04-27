import { AsyncContainerModule, interfaces } from "inversify"
import puppeteer from "puppeteer-extra"
import StealthPlugin from "puppeteer-extra-plugin-stealth"
import { TYPES } from "./app.types"

const browserModule = new AsyncContainerModule(async (bind: interfaces.Bind) => {
  puppeteer.use(StealthPlugin())
  const browser = await puppeteer.launch({
    defaultViewport: { width: 1920, height: 1080 },
    args: ["--no-sandbox"],
    headless: true
  })

  bind(TYPES.BROWSER).toConstantValue(browser)
})

export { browserModule }
