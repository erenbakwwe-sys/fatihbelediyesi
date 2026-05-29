// ─── Menu Page ─── Fatih Akıllı Sofra
// Category filters, search, food cards grid, add-to-cart

import { store } from '../store.js';
import { formatPrice, showToast } from '../utils.js';

export function render() {
  const categories = store.categories || [];
  const menu = (store.menu || []).filter(item => item.active !== false);
  const hasTable = !!store.currentTable;

  return `
    <div class="menu-page" style="padding-bottom: 3rem;">

      <!-- ═══ HEADER ═══ -->
      <div style="
        text-align: center; padding: 2rem 1.5rem 1rem;
        background: linear-gradient(135deg, #1A1A2E 0%, #2a2a4e 100%);
        color: #fff; margin: -1rem -1rem 0;
      ">
        <h1 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 0.3rem;">
          <span class="material-icons-round" style="vertical-align: middle; margin-right: 0.4rem; font-size: 1.6rem;">restaurant_menu</span>
          Dijital Menü
        </h1>
        <p style="color: rgba(255,255,255,0.65); font-size: 0.92rem;">
          Fatih Belediyesi Akıllı Sofra Sistemi
        </p>
      </div>

      <!-- ═══ QR WARNING ═══ -->
      ${!hasTable ? `
        <div id="qr-warning" style="
          margin: 1.5rem 1rem 0; padding: 1rem 1.2rem;
          background: linear-gradient(135deg, #fff3cd, #ffeeba);
          border: 1px solid #ffc107; border-radius: 12px;
          display: flex; align-items: flex-start; gap: 0.8rem;
        ">
          <span class="material-icons-round" style="color: #e6a200; font-size: 1.5rem; flex-shrink: 0; margin-top: 2px;">warning</span>
          <div>
            <strong style="color: #856404; font-size: 0.95rem;">QR Kod Okutulmadı</strong>
            <p style="color: #856404; font-size: 0.85rem; margin-top: 0.3rem; line-height: 1.5;">
              Sipariş verebilmek ve garson çağırabilmek için lütfen masanızdaki QR kodu telefonunuzun kamerasıyla okutun.
            </p>
          </div>
        </div>
      ` : ''}

      <!-- ═══ SEARCH BAR ═══ -->
      <div style="padding: 1.2rem 1rem 0;">
        <div style="
          position: relative; max-width: 500px; margin: 0 auto;
        ">
          <span class="material-icons-round" style="
            position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
            color: #999; font-size: 1.3rem;
          ">search</span>
          <input type="text" id="menu-search" placeholder="Yemek ara..."
                 class="form-input"
                 style="
            width: 100%; padding: 0.8rem 1rem 0.8rem 2.8rem;
            border-radius: 50px; border: 2px solid #e8e8e8;
            font-size: 0.95rem; background: #f8f9fa;
            transition: border-color 0.3s, box-shadow 0.3s;
            box-sizing: border-box;
          " />
        </div>
      </div>

      <!-- ═══ CATEGORY TABS ═══ -->
      <div style="padding: 1rem 1rem 0; overflow-x: auto; -webkit-overflow-scrolling: touch;">
        <div id="category-tabs" style="
          display: flex; gap: 0.5rem; padding-bottom: 0.5rem;
          min-width: max-content;
        ">
          <button class="menu-cat-btn active" data-category="all" style="
            padding: 0.55rem 1.2rem; border-radius: 50px; border: 2px solid #C8102E;
            background: #C8102E; color: #fff; font-size: 0.85rem; font-weight: 600;
            cursor: pointer; white-space: nowrap; transition: all 0.3s;
          ">Tümü</button>
          ${categories.map(cat => `
            <button class="menu-cat-btn" data-category="${cat.id}" style="
              padding: 0.55rem 1.2rem; border-radius: 50px; border: 2px solid #e0e0e0;
              background: #fff; color: #555; font-size: 0.85rem; font-weight: 600;
              cursor: pointer; white-space: nowrap; transition: all 0.3s;
            ">${cat.name}</button>
          `).join('')}
        </div>
      </div>

      <!-- ═══ FOOD CARDS GRID ═══ -->
      <div id="menu-grid" style="
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1.2rem;
        padding: 1.2rem 1rem;
      ">
        ${menu.map(item => renderMenuCard(item)).join('')}
      </div>

      <!-- Empty state -->
      <div id="menu-empty" style="
        display: none; text-align: center; padding: 3rem 1rem;
      ">
        <span class="material-icons-round" style="font-size: 3.5rem; color: #ddd;">search_off</span>
        <p style="color: #999; margin-top: 0.8rem; font-size: 1rem;">Aradığınız ürün bulunamadı</p>
      </div>
    </div>

    <style>
      .menu-cat-btn:hover {
        border-color: #C8102E !important;
        color: #C8102E !important;
      }
      .menu-cat-btn.active {
        background: #C8102E !important;
        color: #fff !important;
        border-color: #C8102E !important;
      }
      .menu-card {
        background: #fff;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 2px 12px rgba(0,0,0,0.07);
        transition: transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s;
        display: flex;
        flex-direction: column;
      }
      .menu-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 28px rgba(0,0,0,0.12);
      }
      .menu-card__img-wrap {
        position: relative;
        height: 180px;
        overflow: hidden;
        background: #f3f3f3;
      }
      .menu-card__img-wrap img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s;
      }
      .menu-card:hover .menu-card__img-wrap img {
        transform: scale(1.05);
      }
      .menu-card__price {
        position: absolute;
        bottom: 10px; right: 10px;
        background: #C8102E; color: #fff;
        padding: 0.35rem 0.85rem; border-radius: 50px;
        font-size: 0.92rem; font-weight: 700;
        box-shadow: 0 2px 8px rgba(200,16,46,0.3);
      }
      .menu-card__body {
        padding: 1rem 1.2rem 1.2rem;
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      .menu-card__title {
        font-size: 1.05rem;
        font-weight: 700;
        color: #1A1A2E;
        margin-bottom: 0.3rem;
      }
      .menu-card__desc {
        font-size: 0.83rem;
        color: #888;
        line-height: 1.45;
        flex: 1;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        margin-bottom: 1rem;
      }
      .menu-add-btn {
        width: 100%;
        padding: 0.7rem;
        border: none;
        border-radius: 12px;
        background: linear-gradient(135deg, #C8102E, #e8334e);
        color: #fff;
        font-size: 0.9rem;
        font-weight: 700;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        transition: all 0.3s;
        box-shadow: 0 3px 12px rgba(200,16,46,0.2);
      }
      .menu-add-btn:hover {
        box-shadow: 0 6px 20px rgba(200,16,46,0.35);
        transform: translateY(-1px);
      }
      .menu-add-btn:active {
        transform: scale(0.97);
      }
      .menu-add-btn.added {
        background: linear-gradient(135deg, #16a34a, #22c55e);
      }
      #menu-search:focus {
        border-color: #C8102E;
        box-shadow: 0 0 0 3px rgba(200,16,46,0.12);
        outline: none;
        background: #fff;
      }
      @media (max-width: 640px) {
        #menu-grid {
          grid-template-columns: 1fr !important;
        }
      }
      @media (min-width: 641px) and (max-width: 960px) {
        #menu-grid {
          grid-template-columns: repeat(2, 1fr) !important;
        }
      }
    </style>
  `;
}

function renderMenuCard(item) {
  const imgPath = item.image 
    ? (item.image.startsWith('/') || item.image.startsWith('http') ? item.image : `/images/${item.image}`) 
    : '/images/hero-bg.png';
  return `
    <div class="menu-card" data-category="${item.category || ''}" data-name="${(item.name || '').toLowerCase()}">
      <div class="menu-card__img-wrap">
        <img src="${imgPath}" alt="${item.name}" loading="lazy" />
        <div class="menu-card__price">${formatPrice(item.price)}</div>
      </div>
      <div class="menu-card__body">
        <div class="menu-card__title">${item.name}</div>
        <div class="menu-card__desc">${item.description || ''}</div>
        <button class="menu-add-btn" data-id="${item.id}">
          <span class="material-icons-round" style="font-size: 1.15rem;">add_shopping_cart</span>
          Sepete Ekle
        </button>
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
    if (overlay) {
      overlay.remove();
    }

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
          <h3 style="margin:0; font-weight:700; color:var(--color-primary); display:flex; align-items:center; gap:8px;">
            <span class="material-icons-round">check_circle</span>
            Sepete Eklendi
          </h3>
          <button class="btn btn-ghost btn-sm" id="btn-close-upsell" style="padding:5px;">
            <span class="material-icons-round">close</span>
          </button>
        </div>
        
        <p style="color:var(--color-text-muted); font-size:14px; margin-bottom:0;">
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

    // Trigger animation
    requestAnimationFrame(() => {
      overlay.classList.add('active');
    });

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
      btn.addEventListener('click', (e) => {
        const id = btn.closest('.upsell-card').getAttribute('data-id');
        const item = store.state.menu.find(m => m.id === id);
        if (item) {
          store.addToCart(item, 1, false); // Not silent, show toast
          closePopup();
        }
      });
    });
  }

  const grid = document.getElementById('menu-grid');
  const emptyState = document.getElementById('menu-empty');
  const searchInput = document.getElementById('menu-search');
  const tabsContainer = document.getElementById('category-tabs');

  function filterCards() {
    if (!grid) return;
    const cards = grid.querySelectorAll('.menu-card');
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
      const btn = e.target.closest('.menu-add-btn');
      if (!btn) return;

      const itemId = btn.dataset.id;
      const menuItem = (store.menu || []).find(m => m.id === itemId);
      if (!menuItem) return;

      store.addToCart(menuItem, 1, true); // Silent add, we'll show popup
      showUpsellPopup(menuItem);

      // Visual feedback
      btn.classList.add('added');
      const originalHTML = btn.innerHTML;
      btn.innerHTML = `
        <span class="material-icons-round" style="font-size: 1.15rem;">check</span>
        Eklendi!
      `;

      setTimeout(() => {
        btn.classList.remove('added');
        btn.innerHTML = originalHTML;
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
        .map(item => renderMenuCard(item)).join('');
        
      if (grid && grid.innerHTML !== newGridContent) {
        grid.innerHTML = newGridContent;
        filterCards();
      }
    });
  }
}
