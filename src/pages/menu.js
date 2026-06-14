// ─── Menu Page ─── Fatih Akıllı Sofra
// Coffy-inspired 2-column compact cards, pill categories, mobile-first

import { store } from '../store.js';
import { formatPrice, showToast } from '../utils.js';

export function render() {
  const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const urlFacility = urlParams.get('facility');
  const urlTable = urlParams.get('table');
  
  if (urlFacility && store.state.currentFacility !== urlFacility) {
    store.setFacility(urlFacility);
  } else if (urlTable && store.state.currentTable !== parseInt(urlTable, 10)) {
    store.setTable(parseInt(urlTable, 10));
  }

  const categories = store.categories || [];
  const menu = (store.menu || []).filter(item => item.active !== false);
  const hasTable = !!store.state.currentTable;
  const hasFacility = !!store.state.currentFacility;
  
  let facilityName = '';
  if (hasFacility) {
    const facilitiesMap = {
      'catladikapi': 'Çatladıkapı Sosyal Tesisleri',
      'topkapi': 'Topkapı Sosyal Tesisleri',
      'ayvansaray': 'Ayvansaray Sosyal Tesisleri',
      'yedikule': 'Yedikule Hisarı Tesisleri',
      'sultanahmet': 'Sultanahmet Meydan Kafe',
      'karagumruk': 'Karagümrük Sosyal Tesisi'
    };
    facilityName = facilitiesMap[store.state.currentFacility] || 'Sosyal Tesis';
  }

  return `
    <div class="menu-page" style="padding-bottom: 140px; background: #fff; min-height: 100vh;">

      <!-- ═══ QR WARNING / FACILITY INFO ═══ -->
      ${hasFacility ? `
        <div id="facility-info" style="
          margin: 0 16px 8px; padding: 10px 14px;
          background: #d1e7dd; border: 1px solid #a3cfbb;
          border-radius: 10px; display: flex; align-items: center; gap: 8px;
          font-size: 13px; color: #0f5132;
        ">
          <span class="material-icons-round" style="font-size: 18px; flex-shrink: 0;">storefront</span>
          <span><b>Gel-Al:</b> ${facilityName}</span>
        </div>
      ` : (!hasTable ? `
        <div id="qr-warning" style="
          margin: 0 16px 8px; padding: 10px 14px;
          background: #fff3cd; border: 1px solid #ffecb5;
          border-radius: 10px; display: flex; align-items: center; gap: 8px;
          font-size: 13px; color: #856404;
        ">
          <span class="material-icons-round" style="font-size: 18px; flex-shrink: 0;">warning</span>
          <span>Sipariş için masanızdaki <b>QR kodu</b> okutun veya tesis seçin.</span>
        </div>
      ` : '')}

      <!-- ═══ SEARCH BAR ═══ -->
      <div style="padding: 8px 16px 0;">
        <div style="position: relative;">
          <span class="material-icons-round" style="
            position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
            color: #999; font-size: 20px;
          ">search</span>
          <input type="text" id="menu-search" placeholder="Yemek ara..."
                 style="
            width: 100%; height: 44px; padding: 0 16px 0 42px;
            border-radius: 25px; border: none;
            font-size: 14px; background: #f5f6f8;
            box-sizing: border-box; outline: none;
            transition: box-shadow 0.2s;
          " />
        </div>
      </div>

      <!-- ═══ CATEGORY TABS ═══ -->
      <div style="padding: 12px 16px 4px; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none;">
        <div id="category-tabs" style="
          display: flex; gap: 8px;
          min-width: max-content;
        ">
          <button class="menu-cat-btn active" data-category="all">
            <span class="material-icons-round" style="font-size: 14px;">restaurant</span>
            Tümü
          </button>
          ${categories.filter(c => c.id !== 'all').map(cat => `
            <button class="menu-cat-btn" data-category="${cat.id}">
              ${cat.icon ? `<span class="material-icons-round" style="font-size: 14px;">${cat.icon}</span>` : ''}
              ${cat.name}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- ═══ SECTION TITLE ═══ -->
      <div style="padding: 8px 16px 4px;">
        <h3 id="menu-section-title" style="font-size: 16px; font-weight: 700; color: #1A1A2E; margin: 0;">Öne Çıkanlar</h3>
      </div>

      <!-- ═══ FOOD CARDS GRID (2-column) ═══ -->
      <div id="menu-grid" style="
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        padding: 8px 16px;
      ">
        ${menu.map((item, index) => renderMenuCard(item, index)).join('')}
      </div>

      <!-- Empty state -->
      <div id="menu-empty" style="
        display: none; text-align: center; padding: 3rem 1rem;
      ">
        <span class="material-icons-round" style="font-size: 48px; color: #ddd;">search_off</span>
        <p style="color: #999; margin-top: 8px; font-size: 14px;">Aradığınız ürün bulunamadı</p>
      </div>
    </div>

    <style>
      .menu-cat-btn {
        padding: 8px 16px;
        border-radius: 25px;
        border: 1px solid #eee;
        background: #f5f6f8;
        color: #555;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        white-space: nowrap;
        transition: all 0.2s;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-family: inherit;
      }
      .menu-cat-btn.active {
        background: #C8102E !important;
        color: #fff !important;
        border-color: #C8102E !important;
      }
      .menu-cat-btn:not(.active):hover {
        border-color: #C8102E;
        color: #C8102E;
      }
      
      /* Hide scrollbar for category tabs */
      #category-tabs::-webkit-scrollbar { display: none; }

      .menu-card-v2 {
        background: #fff;
        border-radius: 16px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        overflow: hidden;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      .menu-card-v2:active {
        transform: scale(0.97);
      }
      .menu-card-v2__img-area {
        height: 140px;
        background: #f5f6f8;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
      }
      .menu-card-v2__img-area img {
        max-width: 85%;
        max-height: 85%;
        object-fit: contain;
      }
      .menu-card-v2__badge {
        position: absolute;
        top: 8px;
        right: 8px;
        background: #C8102E;
        color: #fff;
        padding: 3px 10px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.5px;
      }
      .menu-card-v2__body {
        padding: 10px 12px 12px;
      }
      .menu-card-v2__title {
        font-size: 14px;
        font-weight: 700;
        color: #1A1A2E;
        line-height: 1.3;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        margin-bottom: 6px;
        min-height: 36px;
      }
      .menu-card-v2__bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .menu-card-v2__price {
        font-size: 14px;
        font-weight: 700;
        color: #1A1A2E;
      }
      .menu-add-btn-v2 {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #1A1A2E;
        color: #fff;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        flex-shrink: 0;
      }
      .menu-add-btn-v2:hover {
        background: #C8102E;
        transform: scale(1.1);
      }
      .menu-add-btn-v2:active {
        transform: scale(0.9);
      }
      .menu-add-btn-v2.added {
        background: #16a34a !important;
        transform: scale(1.15) rotate(360deg) !important;
      }

      #menu-search:focus {
        box-shadow: 0 0 0 2px rgba(200,16,46,0.15);
        background: #fff;
      }

      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }
    </style>
  `;
}

function renderMenuCard(item, index = 0) {
  const imgPath = item.image 
    ? (item.image.startsWith('/') || item.image.startsWith('http') ? item.image : `/images/${item.image}`) 
    : '/images/hero-bg.png';
  
  const priceText = `${item.price} TL`;
  const delay = `${index * 0.04}s`;
  
  return `
    <div class="menu-card-v2 slide-up-in" data-category="${item.category || ''}" data-name="${(item.name || '').toLowerCase()}" style="animation-delay: ${delay}; opacity: 0;">
      <div class="menu-card-v2__img-area">
        <img src="${imgPath}" alt="${item.name}" loading="lazy" />
        ${item.featured ? '<div class="menu-card-v2__badge">YENİ</div>' : ''}
      </div>
      <div class="menu-card-v2__body">
        <div class="menu-card-v2__title">${item.name}</div>
        <div class="menu-card-v2__bottom">
          <span class="menu-card-v2__price">${priceText}</span>
          <button class="menu-add-btn-v2" data-id="${item.id}" aria-label="Sepete ekle">
            <span class="material-icons-round" style="font-size: 18px;">add</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

export function init() {
  const tableNo = store.state.currentTable;
  if (tableNo) {
    const pendingOrder = store.getPendingSplitOrder(tableNo);
    if (pendingOrder) {
      window.location.hash = '#/join-payment';
      return;
    }
  }

  let activeCategory = 'all';
  let searchQuery = '';

  // ── Upsell Logic ───────────────────────────────────────
  function showUpsellPopup(addedItem) {
    const recommendations = store.getRecommendations(addedItem);
    if (!recommendations || recommendations.length === 0) return;

    let overlay = document.querySelector('.bottom-popup-overlay');
    if (overlay) overlay.remove();

    overlay = document.createElement('div');
    overlay.className = 'bottom-popup-overlay';
    
    let upsellCardsHTML = recommendations.map(item => `
      <div class="upsell-card" data-id="${item.id}">
        <div class="upsell-img-wrap">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="upsell-title">${item.name}</div>
        <div class="upsell-price">₺${item.price}</div>
        <button class="btn btn-sm btn-outline btn-upsell-add" style="width:100%;">Ekle</button>
      </div>
    `).join('');

    overlay.innerHTML = `
      <div class="bottom-popup">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
          <h3 style="margin:0; font-weight:700; color:#C8102E; display:flex; align-items:center; gap:8px;">
            <span class="material-icons-round">check_circle</span>
            Sepete Eklendi
          </h3>
          <button class="btn btn-ghost btn-sm" id="btn-close-upsell" style="padding:5px;">
            <span class="material-icons-round">close</span>
          </button>
        </div>
        
        <p style="color:#999; font-size:14px; margin-bottom:0;">
          <strong>${addedItem.name}</strong> başarıyla sepetinize eklendi.
        </p>

        <div class="upsell-section">
          <p style="font-size:14px; font-weight:600; margin-bottom:12px;">Bunun yanına iyi gider:</p>
          <div class="upsell-grid">
            ${upsellCardsHTML}
          </div>
        </div>
        
        <div style="margin-top:20px; display:flex; gap:10px;">
          <button class="btn btn-secondary" id="btn-continue-shopping" style="flex:1;">Alışverişe Devam</button>
          <button class="btn btn-primary" id="btn-go-to-cart" style="flex:1;">Sepete Git</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('active'));

    const closePopup = () => {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 400);
    };

    overlay.querySelector('#btn-close-upsell').addEventListener('click', closePopup);
    overlay.querySelector('#btn-continue-shopping').addEventListener('click', closePopup);
    overlay.querySelector('#btn-go-to-cart').addEventListener('click', () => {
      closePopup();
      window.location.hash = '#/cart';
    });

    overlay.querySelectorAll('.btn-upsell-add').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.closest('.upsell-card').getAttribute('data-id');
        const item = store.state.menu.find(m => m.id === id);
        if (item) {
          store.addToCart(item, 1, false);
          closePopup();
        }
      });
    });
  }

  const grid = document.getElementById('menu-grid');
  const emptyState = document.getElementById('menu-empty');
  const searchInput = document.getElementById('menu-search');
  const tabsContainer = document.getElementById('category-tabs');
  const sectionTitle = document.getElementById('menu-section-title');

  function filterCards() {
    if (!grid) return;
    const cards = grid.querySelectorAll('.menu-card-v2');
    let visibleCount = 0;

    cards.forEach(card => {
      const cat = card.dataset.category;
      const name = card.dataset.name || '';
      const matchesCat = activeCategory === 'all' || cat === activeCategory;
      const matchesSearch = !searchQuery || name.includes(searchQuery.toLowerCase());

      if (matchesCat && matchesSearch) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  // Category tab clicks
  if (tabsContainer) {
    tabsContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.menu-cat-btn');
      if (!btn) return;

      tabsContainer.querySelectorAll('.menu-cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.category;
      
      // Update section title
      if (sectionTitle) {
        if (activeCategory === 'all') {
          sectionTitle.textContent = 'Öne Çıkanlar';
        } else {
          sectionTitle.textContent = btn.textContent.trim();
        }
      }
      
      filterCards();
    });
  }

  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      filterCards();
    });
  }

  // Add to cart buttons
  if (grid) {
    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('.menu-add-btn-v2');
      if (!btn) return;

      const itemId = btn.dataset.id;
      const menuItem = (store.menu || []).find(m => m.id === itemId);
      if (!menuItem) return;

      if (!store.state.currentTable && !store.state.currentFacility) {
        showToast('Lütfen önce QR kodu okutun veya haritadan tesis seçin!', 'error');
        const qrWarning = document.getElementById('qr-warning');
        if (qrWarning) {
          qrWarning.style.animation = 'none';
          setTimeout(() => { qrWarning.style.animation = 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both'; }, 10);
        }
        return;
      }

      store.addToCart(menuItem, 1, true);
      showUpsellPopup(menuItem);

      // Visual feedback on button
      btn.classList.add('added');
      const icon = btn.querySelector('.material-icons-round');
      if (icon) icon.textContent = 'check';

      setTimeout(() => {
        btn.classList.remove('added');
        if (icon) icon.textContent = 'add';
      }, 1200);
    });
  }

  if (store.subscribe) {
    const unsubscribe = store.subscribe(() => {
      const page = document.querySelector('.menu-page');
      if (!page) {
        if (typeof unsubscribe === 'function') unsubscribe();
        return;
      }
      
      const tableNo = store.state.currentTable;
      if (tableNo) {
        const pendingOrder = store.getPendingSplitOrder(tableNo);
        if (pendingOrder) {
          window.location.hash = '#/join-payment';
          return;
        }
      }

      const newGridContent = (store.menu || [])
        .filter(item => item.active !== false)
        .map((item, index) => renderMenuCard(item, index)).join('');
        
      if (grid && grid.innerHTML !== newGridContent) {
        grid.innerHTML = newGridContent;
        filterCards();
      }
    });
  }
}
