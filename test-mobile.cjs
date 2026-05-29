const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  // Mobile viewport
  await page.setViewport({ width: 375, height: 812, isMobile: true });

  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0' });

  // Open the mobile drawer
  await page.click('#navbar-toggle-btn');
  await new Promise(r => setTimeout(r, 500));

  // Click the garson button in the drawer
  await page.click('#nav-garson-cagir');
  await new Promise(r => setTimeout(r, 500));

  const state = await page.evaluate(() => {
    const drawer = document.querySelector('.navbar-nav.open');
    const modal = document.querySelector('.modal-overlay');
    
    return {
      drawerExists: !!drawer,
      modalExists: !!modal,
      drawerZIndex: drawer ? window.getComputedStyle(drawer).zIndex : null,
      modalZIndex: modal ? window.getComputedStyle(modal).zIndex : null,
      isModalBehindDrawer: drawer && modal && (parseInt(window.getComputedStyle(drawer).zIndex) > parseInt(window.getComputedStyle(modal).zIndex))
    };
  });

  console.log(JSON.stringify(state, null, 2));
  
  await browser.close();
})();
