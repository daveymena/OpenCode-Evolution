// OpenCode Evolution - Browser Open
// Abre una URL en Chromium y muestra info de la pagina
const { chromium } = require('playwright');
const url = process.argv[2];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  const info = {
    url: page.url(),
    title: await page.title(),
    links: (await page.$$('a')).length,
    images: (await page.$$('img')).length,
    buttons: (await page.$$('button')).length,
    inputs: (await page.$$('input')).length,
    text: (await page.evaluate(() => document.body?.innerText || '')).substring(0, 2000)
  };
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})();
