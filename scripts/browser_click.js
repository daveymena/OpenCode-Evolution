// OpenCode Evolution - Browser Click
// Hace click en un selector de una pagina web
const { chromium } = require('playwright');
const url = process.argv[2];
const selector = process.argv[3];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  const el = await page.$(selector);
  if (el) {
    const box = await el.boundingBox();
    await el.click();
    console.log(JSON.stringify({ status: 'clicked', selector, x: box.x, y: box.y }));
  } else {
    console.log(JSON.stringify({ status: 'error', message: `Selector no encontrado: ${selector}` }));
  }
  await browser.close();
})();
