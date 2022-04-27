import "@/core/app/app.extensions"

describe("App Extensions", () => {
  it("should return if it is a url or not", () => {
    const validUrls = ["https://google.com", "http://google.com"]
    const unvalidUrls = ["https:/google.com", "httpss://google.com", "^https://google.com"]
    validUrls.forEach((url) => expect(url.isURL()).toBe(true))
    unvalidUrls.forEach((url) => expect(url.isURL()).toBe(false))
  })

  it("should convert minutes to milliseconds", () => {
    const test: number = 3
    expect(test.toMilliseconds()).toBe(180_000)
  })

  it("should return if the date is in the past or not", () => {
    const futurDate = new Date()
    const pastDate = new Date()
    futurDate.setFullYear(2099)
    pastDate.setFullYear(1990)
    expect(futurDate.isInPast()).toBe(false)
    expect(pastDate.isInPast()).toBe(true)
  })

  it("should extract cookies", () => {
    const cookie = "cf_clearance=value123; ygg_=value321"
    const extractedCookies = cookie.extractCookies()
    expect(extractedCookies.length).toEqual(2)
    expect(extractedCookies[0]).toEqual({ name: "cf_clearance", value: "value123" })
    expect(extractedCookies[1]).toEqual({ name: "ygg_", value: "value321" })
  })
})
