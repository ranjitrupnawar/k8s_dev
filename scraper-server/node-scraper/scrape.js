const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const url = process.env.SCRAPE_URL;

  if (!url) {
    console.error('❌ Error: SCRAPE_URL environment variable not set.');
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: '/usr/bin/chromium-browser'
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  const data = await page.evaluate(() => {
    return {
      title: document.title,
      heading: document.querySelector('h1')?.innerText || 'No <h1> found'
    };
  });

  fs.writeFileSync('scraped_data.json', JSON.stringify(data, null, 2));
  console.log('✅ Data scraped and saved to scraped_data.json');

  await browser.close();
})();
