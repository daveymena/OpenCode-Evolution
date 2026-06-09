// OpenCode Evolution - Browser Fill
// Llena un campo de formulario en una pagina web
const { chromium } = require('playwright');
const url = process.argv[2];
const selector = process.argv[3];
const text = process.argv[4] || '';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.fill(selector, text);
  console.log(JSON.stringify({ status: 'filled', selector, text_length: text.length }));
  await browser.close();
})();
