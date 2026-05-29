const puppeteer = require('puppeteer');

(async () => {
  console.log('🚀 Starting E2E Test...');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  // Collect ALL console errors
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));

  try {
    // ═══ TEST 1: Scratch card page loads and is VISIBLE ═══
    console.log('\n═══ TEST 1: Scratch Card Visibility ═══');
    await page.goto('http://localhost:4173/#/scratch', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1500));

    const scratchVisible = await page.evaluate(() => {
      const section = document.querySelector('.scratch-card-section');
      if (!section) return { found: false };
      const style = window.getComputedStyle(section);
      return {
        found: true,
        opacity: style.opacity,
        visibility: style.visibility,
        display: style.display,
        hasGiftBox: !!document.getElementById('gift-box'),
        title: document.querySelector('.scratch-title')?.textContent || 'NOT FOUND'
      };
    });
    console.log('Scratch section:', JSON.stringify(scratchVisible));

    if (scratchVisible.found && scratchVisible.opacity === '1') {
      console.log('✅ TEST 1 PASSED: Scratch card is VISIBLE!');
    } else {
      console.error('❌ TEST 1 FAILED: Scratch card not visible!');
    }

    // ═══ TEST 2: Gift box click works ═══
    console.log('\n═══ TEST 2: Gift Box Interaction ═══');
    const giftBox = await page.$('#gift-box-container');
    if (giftBox) {
      await giftBox.click();
      await new Promise(r => setTimeout(r, 2000));
      
      const afterClick = await page.evaluate(() => {
        const gbc = document.getElementById('gift-box-container');
        const result = document.getElementById('gift-result-container');
        const form = document.getElementById('scratch-lead-form-wrap');
        const fail = document.getElementById('scratch-failure-wrap');
        return {
          giftBoxHidden: gbc?.style.display === 'none',
          resultVisible: result?.style.display === 'block',
          formVisible: form?.style.display === 'block',
          failVisible: fail?.style.display === 'block'
        };
      });
      console.log('After click:', JSON.stringify(afterClick));

      if (afterClick.giftBoxHidden && (afterClick.formVisible || afterClick.failVisible)) {
        console.log('✅ TEST 2 PASSED: Gift box interaction works!');
      } else {
        console.error('❌ TEST 2 FAILED: Gift box interaction broken');
      }
    } else {
      console.error('❌ TEST 2 FAILED: Gift box not found');
    }

    // ═══ TEST 3: Garson Çağır modal visibility ═══
    console.log('\n═══ TEST 3: Garson Çağır Modal ═══');
    await page.goto('http://localhost:4173/#/menu', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    // Click garson button
    const garsonBtn = await page.$('#header-garson-cagir');
    if (garsonBtn) {
      await garsonBtn.click();
      await new Promise(r => setTimeout(r, 500));

      const modalState = await page.evaluate(() => {
        const overlay = document.querySelector('.modal-overlay.fade-in');
        if (!overlay) return { found: false };
        const style = window.getComputedStyle(overlay);
        const buttons = overlay.querySelectorAll('.btn-call-type');
        return {
          found: true,
          opacity: style.opacity,
          visibility: style.visibility,
          display: style.display,
          zIndex: style.zIndex,
          buttonCount: buttons.length,
          text: overlay.textContent.substring(0, 100)
        };
      });
      console.log('Modal state:', JSON.stringify(modalState));

      if (modalState.found && modalState.opacity === '1' && modalState.visibility === 'visible') {
        console.log('✅ TEST 3 PASSED: Garson modal is VISIBLE!');
      } else if (modalState.found) {
        console.error('❌ TEST 3 FAILED: Modal found but not visible (opacity: ' + modalState.opacity + ', visibility: ' + modalState.visibility + ')');
      } else {
        console.error('❌ TEST 3 FAILED: Modal overlay not found in DOM');
      }
    } else {
      console.error('❌ TEST 3 FAILED: Garson button not found');
    }

    // ═══ TEST 4: Payment → Scratch Redirect ═══
    console.log('\n═══ TEST 4: Payment → Scratch Redirect ═══');
    // First add item to cart
    await page.goto('http://localhost:4173/#/menu', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    
    const addBtn = await page.$('.menu-add-btn');
    if (addBtn) {
      await page.evaluate(() => document.querySelector('.menu-add-btn').click());
      console.log('  Item added to cart');
    }

    // Go to payment
    await page.goto('http://localhost:4173/#/payment', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 500));

    // Select cash and confirm
    const cashCard = await page.$('.payment-method-card[data-method="cash"]');
    if (cashCard) {
      await cashCard.click();
      await new Promise(r => setTimeout(r, 500));
      
      const cashBtn = await page.$('#cash-confirm-btn');
      if (cashBtn) {
        await cashBtn.click();
        console.log('  Cash payment confirmed');
        
        // Wait for redirect to scratch
        await new Promise(r => setTimeout(r, 3000));
        
        const hash = await page.evaluate(() => window.location.hash);
        console.log('  Current hash:', hash);
        
        if (hash === '#/scratch') {
          // Check if scratch page is visible
          const scratchOk = await page.evaluate(() => {
            const section = document.querySelector('.scratch-card-section');
            if (!section) return false;
            return window.getComputedStyle(section).opacity === '1';
          });
          
          if (scratchOk) {
            console.log('✅ TEST 4 PASSED: Payment → Scratch redirect works and page is visible!');
          } else {
            console.log('⚠️ TEST 4 PARTIAL: Redirected but scratch card not visible');
          }
        } else {
          console.error('❌ TEST 4 FAILED: Not redirected to #/scratch, got:', hash);
        }
      }
    }

    // Print any console errors
    if (errors.length > 0) {
      console.log('\n⚠️ Browser console errors:', errors.length);
      errors.forEach(e => console.log('  ERROR:', e));
    }

    console.log('\n🏁 All tests complete!');
  } catch (error) {
    console.error('❌ CRASH:', error.message);
  } finally {
    await browser.close();
    process.exit(0);
  }
})();
