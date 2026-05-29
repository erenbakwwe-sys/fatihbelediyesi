const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:4173/#/admin/rewards', { waitUntil: 'networkidle0' });
  
  await new Promise(r => setTimeout(r, 2000));
  
  const html = await page.content();
  const rowCount = await page.evaluate(() => {
    return document.querySelectorAll('#rewards-table-body tr').length;
  });
  
  console.log("Admin Panel Rewards Row Count:", rowCount);
  console.log("Does it contain TEST?", html.includes('TEST'));
  
  await browser.close();
})();
