const puppeteer = require('puppeteer');
const width = 1920;
const height = 1080;
const options = {
  headless: false,
  args: [
    '--enable-usermedia-screen-capturing',
    '--allow-http-screen-capture',
    '--auto-select-desktop-capture-source=puppetcam',
    `--load-extension=${__dirname}`,
    `--disable-extensions-except=${__dirname}`,
    '--disable-infobars',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    `--window-size=${width},${height}`,
  ],
}

async function entry () {
  const url = process.argv[2] || 'http://www.bugs.cc/temp/webpage2webm/'
  const browser = await puppeteer.launch(options)
  const pages = await browser.pages()
  const page = pages[0]
  await page._client.send('Emulation.clearDeviceMetricsOverride')
  await page.goto(url)
  await page.setBypassCSP(true)

  await page.waitForSelector('html.downloadComplete', {timeout: 0})
  await browser.close()
}

entry()