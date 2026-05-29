const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));
  
  await page.setViewport({ width: 375, height: 812, isMobile: true });
  await page.goto('http://localhost:4173/?table=5', { waitUntil: 'networkidle0' });
  
  // click toggle
  await page.click('#navbar-toggle-btn');
  await new Promise(r => setTimeout(r, 500));
  
  // click garson
  await page.click('#nav-garson-cagir');
  await new Promise(r => setTimeout(r, 500));
  
  // get html
  const html = await page.content();
  console.log("Modal exists:", html.includes('modal-overlay fade-in'));
  console.log("Errors:", errors);

  // click garson submit
  const btn = await page.$('.btn-call-type[data-type="garson"]');
  if (btn) {
    try {
      await btn.click();
      await new Promise(r => setTimeout(r, 1000));
      const html2 = await page.content();
      console.log("Toast exists:", html2.includes('Garson'));
      console.log("Errors after submit:", errors);
    } catch(e) {
      console.log("Button click failed:", e.message);
    }
  } else {
    console.log("Button not found!");
  }

  await browser.close();
})();
