// OpenCode Evolution - Browser Screenshot
// Captura pantalla de una URL
const { chromium } = require('playwright');
const url = process.argv[2];
const output = process.argv[3] || '/workspace/browser-shot.png';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.screenshot({ path: output, fullPage: false });
  console.log(JSON.stringify({ status: 'ok', file: output, size: require('fs').statSync(output).size }));
  await browser.close();
})();
