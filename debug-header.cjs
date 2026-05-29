const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 375, height: 812, isMobile: true });
  await page.goto('http://localhost:4173/?table=5', { waitUntil: 'networkidle0' });
  
  console.log("Checking if header-garson-cagir is visible...");
  const isVisible = await page.evaluate(() => {
    const el = document.getElementById('header-garson-cagir');
    if (!el) return false;
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
  });
  console.log("Is visible:", isVisible);
  
  // click it directly
  await page.click('#header-garson-cagir');
  await new Promise(r => setTimeout(r, 500));
  
  const html = await page.content();
  console.log("Modal exists:", html.includes('modal-overlay fade-in'));
  
  await browser.close();
})();
