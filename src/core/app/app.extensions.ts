import { Protocol } from "puppeteer"

declare global {
  interface String {
    inQuoteContent(): String | undefined
    isYoutubeURL(): boolean
    isURL(): boolean
    extractCookies(): Protocol.Network.CookieParam[]
  }

  interface Number {
    toMilliseconds(): number
  }

  interface Date {
    isInPast(): boolean
  }

  interface Array<T> {
    chunk(size: number): Array<Array<T>>
  }

  function delay(timeInMs: number): Promise<void>
}

String.prototype.inQuoteContent = function inQuoteContent() {
  const matches = this.match(/"(.*?)"/)
  return matches ? matches[1] : undefined
}

String.prototype.isYoutubeURL = function isYoutubeURL() {
  return this.startsWith("https://www.youtube.com")
}

String.prototype.isURL = function isURL() {
  return /^(http|https):\/\//.test(this as string)
}

String.prototype.extractCookies = function extractCookies() {
  return this.replace(" ", "")
    .split(";")
    .map((keyValue) => {
      const cookie = keyValue.split("=")
      return {
        name: cookie[0],
        value: cookie[1],
        domain: "dealabs.com"
      } as Protocol.Network.CookieParam
    })
}

Number.prototype.toMilliseconds = function (this: number) {
  return this * 1_000 * 60
}

Date.prototype.isInPast = function isInPast() {
  return this < new Date()
}

Array.prototype.chunk = function chunck(size: number) {
  return Array.from({ length: Math.ceil(this.length / size) }, (v, i) =>
    this.slice(i * size, i * size + size)
  )
}

global.delay = function (timeInMs: number): Promise<void> {
  return new Promise(function (resolve) {
    setTimeout(resolve, timeInMs)
  })
}

export {}
