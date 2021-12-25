declare global {
  interface String {
    inQuoteContent(): String | undefined
    isYoutubeURL(): boolean
  }

  interface Number {
    toMinutes(): number
  }

  interface Date {
    isInPast(): boolean
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

Number.prototype.toMinutes = function (this: number) {
  return this * 1_000 * 60
}

Date.prototype.isInPast = function isInPast() {
  return this < new Date()
}

global.delay = function (timeInMs: number): Promise<void> {
  return new Promise(function (resolve) {
    setTimeout(resolve, timeInMs)
  })
}

export {}
