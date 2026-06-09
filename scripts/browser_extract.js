// OpenCode Evolution - Browser Extract
// Extrae texto de elementos de una pagina web
const { chromium } = require('playwright');
const url = process.argv[2];
const selector = process.argv[3] || 'body';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  const elements = await page.$$(selector);
  const results = [];
  for (const el of elements) {
    const text = await el.innerText();
    const html = await el.innerHTML();
    results.push({
      tag: await el.evaluate(el => el.tagName),
      text: text?.substring(0, 500),
      innerHTML: html?.substring(0, 300)
    });
  }
  console.log(JSON.stringify({ count: results.length, elements: results, url: page.url(), title: await page.title() }, null, 2));
  await browser.close();
})();
