const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') console.log('PAGE ERROR:', msg.text());
  });
  
  page.on('pageerror', err => {
    console.log('UNCAUGHT EXCEPTION:', err.toString());
  });

  try {
    await page.goto('https://fatihbelediyesi.vercel.app/?table=5', { waitUntil: 'networkidle0', timeout: 30000 });
    console.log("Page loaded.");
    
    // Check if Garson button exists
    const btn = await page.$('#header-garson-cagir');
    console.log("Header Garson Button exists:", !!btn);
    
    if (btn) {
      console.log("Clicking Garson button...");
      await btn.click();
      await new Promise(r => setTimeout(r, 1000));
      
      const modalText = await page.evaluate(() => document.body.innerHTML);
      console.log("Did modal open?", modalText.includes('Yardım mı lazım?'));
    }
  } catch (e) {
    console.error("Test failed:", e);
  } finally {
    await browser.close();
  }
})();
