import args from 'args'
import puppeteer from 'puppeteer'
;(async () => {
  let browser
  try {
    browser = await puppeteer.launch({ headless: 'new' })
    const page = await browser.newPage()

    args
      .option('html', 'The absolute path of the HTML file (input)')
      .option('url', 'The URL of the web page (input)')
      .option('pdf', 'The absolute path of the PDF file (output)')

    const flags = args.parse(process.argv)

    await page.emulateMediaType('screen')
    await page.goto(flags.url || `file://${flags.html}`, {
      waitUntil: 'networkidle2',
    })

    const height = await page.evaluate(
      () => document.documentElement.scrollHeight
    )

    await page.pdf({
      path: flags.pdf,
      width: '1280px',
      height: height - 100 + 'px',
      printBackground: true,
    })

    await browser.close()
  } catch (err) {
    if (err) console.error(err)
    browser && (await browser.close())
  }
})()
