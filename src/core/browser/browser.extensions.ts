import { Page } from "puppeteer"

/**
 * Cannot use extension function on Page class…
 *
 * @param page
 * @param url
 * @param querySelector
 * @returns
 */
const resolveTextContentByQuery = async function (page: Page, url: string, querySelector: string) {
  await page.goto(url, { waitUntil: "networkidle0" })
  await page.waitForSelector(querySelector, { timeout: 10_000 })
  return (await page.evaluate((qs) => {
    return document.querySelector(qs)?.textContent ?? ""
  }, querySelector)) as Promise<string>
}

const takeScreenshot = async function (
  page: Page,
  querySelector: string
): Promise<string | void | Buffer | undefined> {
  const element = await page.$(querySelector)

  // scroll to element (used to load image / lazy loading)
  await page.evaluate(
    (selector) => document.querySelector(selector).scrollIntoView({ block: "center" }),
    querySelector
  )
  await delay(3000)

  return await element?.screenshot()
}

export { resolveTextContentByQuery, takeScreenshot }
