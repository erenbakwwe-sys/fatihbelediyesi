// ─── Cart Page ─── Fatih Akıllı Sofra
// Coffy-inspired: empty state with suggestions, sticky bottom bar, compact design

import { store } from '../store.js';
import { formatPrice, showToast } from '../utils.js';

function getSuggestionItems() {
  const menu = (store.menu || store.state.menu || []).filter(item => item.active !== false);
  const cart = store.cart || [];
  const cartIds = cart.map(c => c.id);
  const available = menu.filter(m => !cartIds.includes(m.id));
  // Shuffle and pick 4
  const shuffled = available.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 4);
}

function renderSuggestionCard(item) {
  const imgPath = item.image 
    ? (item.image.startsWith('/') || item.image.startsWith('http') ? item.image : `/images/${item.image}`) 
    : '/images/hero-bg.png';
  return `
    <div class="suggest-card" data-id="${item.id}" style="
      background: #fff; border-radius: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      overflow: hidden;
    ">
      <div style="
        height: 120px; background: #f5f6f8;
        display: flex; align-items: center; justify-content: center;
        position: relative;
      ">
        <img src="${imgPath}" alt="${item.name}" style="max-width: 80%; max-height: 80%; object-fit: contain;" loading="lazy" />
        ${item.featured ? '<div style="position:absolute;top:8px;right:8px;background:#C8102E;color:#fff;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;">YENİ</div>' : ''}
      </div>
      <div style="padding: 8px 10px 10px;">
        <div style="font-size: 13px; font-weight: 700; color: #1A1A2E; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 34px; margin-bottom: 4px;">${item.name}</div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 13px; font-weight: 700; color: #1A1A2E;">${item.price} TL</span>
          <button class="suggest-add-btn" data-id="${item.id}" style="
            width: 28px; height: 28px; border-radius: 50%;
            background: #1A1A2E; color: #fff; border: none; cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            transition: all 0.2s;
          ">
            <span class="material-icons-round" style="font-size: 16px;">add</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

export function render() {
  const cart = store.cart || [];
  const total = store.getCartTotal ? store.getCartTotal() : 0;
  const suggestions = getSuggestionItems();

  return `
    <div class="cart-page-v2" style="padding-bottom: 200px; background: #fff; min-height: 100vh;">

      ${cart.length === 0 ? renderEmptyCart(suggestions, total) : renderFullCart(cart, total, suggestions)}

    </div>

    <!-- ═══ STICKY BOTTOM BAR ═══ -->
    <div id="cart-sticky-bar" style="
      position: fixed; bottom: 60px; left: 0; right: 0;
      background: #fff; padding: 12px 16px;
      border-top: 1px solid #eee;
      display: flex; align-items: center; justify-content: space-between;
      z-index: 100;
      box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
    ">
      <span id="cart-bar-total" style="font-size: 20px; font-weight: 800; color: #1A1A2E;">${total > 0 ? formatPrice(total) : '0 TL'}</span>
      <button id="cart-bar-continue" style="
        padding: 12px 32px; border-radius: 25px; border: none;
        font-size: 15px; font-weight: 700; cursor: pointer;
        transition: all 0.2s; font-family: inherit;
        ${cart.length > 0 
          ? 'background: #C8102E; color: #fff; box-shadow: 0 4px 12px rgba(200,16,46,0.3);' 
          : 'background: #e0e0e0; color: #999; cursor: default;'}
      ">${cart.length > 0 ? 'Devam Et' : 'Devam Et'}</button>
    </div>

    <style>
      .cart-item-v2 {
        background: #fff;
        border-radius: 14px;
        padding: 12px;
        margin-bottom: 8px;
        display: flex;
        gap: 12px;
        align-items: center;
        box-shadow: 0 1px 4px rgba(0,0,0,0.05);
        transition: all 0.4s cubic-bezier(0.22,1,0.36,1);
        overflow: hidden;
      }
      .cart-item-v2.removing {
        opacity: 0;
        transform: translateX(100px);
        max-height: 0;
        padding-top: 0;
        padding-bottom: 0;
        margin-bottom: 0;
      }
      .cart-qty-controls-v2 {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .cart-qty-btn-v2 {
        width: 30px; height: 30px;
        border-radius: 50%;
        border: 1.5px solid #e0e0e0;
        background: #fff;
        color: #555;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        font-size: 0;
      }
      .cart-qty-btn-v2:hover {
        border-color: #C8102E;
        color: #C8102E;
      }
      .cart-qty-btn-v2.danger:hover {
        border-color: #ef4444;
        color: #ef4444;
        background: #fef2f2;
      }
      .suggest-add-btn:hover {
        background: #C8102E !important;
        transform: scale(1.1);
      }
    </style>
  `;
}

function renderEmptyCart(suggestions, total) {
  return `
    <!-- ═══ EMPTY STATE ═══ -->
    <div style="
      display: flex; flex-direction: column; align-items: center;
      padding: 40px 24px 20px; text-align: center;
      background: #f5f6f8; margin: 0 16px; border-radius: 20px;
      margin-top: 16px;
    ">
      <div style="
        width: 120px; height: 120px; border-radius: 50%;
        background: #e8e9ec;
        display: flex; align-items: center; justify-content: center;
        margin-bottom: 20px;
      ">
        <span class="material-icons-round" style="font-size: 52px; color: #bbb;">shopping_cart</span>
      </div>
      <h2 style="font-size: 18px; font-weight: 700; color: #1A1A2E; margin-bottom: 8px;">
        Sepetinde Ürün Bulunmamaktadır!
      </h2>
      <a href="#/menu" style="
        display: inline-block; margin-top: 16px;
        padding: 12px 36px; border-radius: 50px;
        background: #1A1A2E; color: #fff;
        font-size: 15px; font-weight: 700;
        text-decoration: none; transition: all 0.2s;
      ">Alışverişe Başla</a>
    </div>

    <!-- ═══ SUGGESTIONS ═══ -->
    ${suggestions.length > 0 ? `
      <div style="padding: 20px 16px 0;">
        <h3 style="font-size: 16px; font-weight: 700; color: #1A1A2E; margin-bottom: 12px;">Sana Eşlik Etsin</h3>
        <div id="suggestion-grid" style="
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;
        ">
          ${suggestions.map(item => renderSuggestionCard(item)).join('')}
        </div>
      </div>
    ` : ''}
  `;
}

function renderFullCart(cart, total, suggestions) {
  return `
    <!-- ═══ CART ITEMS ═══ -->
    <div id="cart-items" style="padding: 8px 16px;">
      ${cart.map((entry, index) => renderCartItem(entry, index)).join('')}
    </div>

    <!-- ═══ ORDER NOTE ═══ -->
    <div style="padding: 12px 16px 0;">
      <label style="font-size: 13px; font-weight: 600; color: #1A1A2E; display: flex; align-items: center; gap: 4px; margin-bottom: 6px;">
        <span class="material-icons-round" style="font-size: 16px;">edit_note</span>
        Sipariş Notu
      </label>
      <textarea id="order-note" rows="2"
                placeholder="Ekstra isteklerinizi yazın... (ör: Az acılı)"
                style="
        width: 100%; border-radius: 12px; border: 1.5px solid #eee;
        padding: 10px 12px; font-size: 14px; resize: none;
        font-family: inherit; box-sizing: border-box;
        outline: none; transition: border-color 0.2s;
        background: #f5f6f8;
      "></textarea>
    </div>

    <!-- ═══ CART SUMMARY ═══ -->
    <div style="padding: 16px;">
      <div style="
        border-radius: 14px; padding: 16px;
        background: #f5f6f8; border: 1px solid #eee;
      ">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-size: 14px; color: #999;">Ara Toplam</span>
          <span style="font-size: 14px; font-weight: 600; color: #1A1A2E;">${formatPrice(total)}</span>
        </div>
        <div style="height: 1px; background: #e0e0e0; margin-bottom: 8px;"></div>
        <div style="display: flex; justify-content: space-between;">
          <span style="font-size: 16px; font-weight: 700; color: #1A1A2E;">Toplam</span>
          <span style="font-size: 18px; font-weight: 800; color: #C8102E;">${formatPrice(total)}</span>
        </div>
      </div>
    </div>

    <!-- ═══ SUGGESTIONS ═══ -->
    ${suggestions.length > 0 ? `
      <div style="padding: 0 16px 16px;">
        <h3 style="font-size: 16px; font-weight: 700; color: #1A1A2E; margin-bottom: 12px;">Sana Eşlik Etsin</h3>
        <div id="suggestion-grid" style="
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;
        ">
          ${suggestions.map(item => renderSuggestionCard(item)).join('')}
        </div>
      </div>
    ` : ''}
  `;
}

function renderCartItem(entry, index) {
  const item = entry;
  const imgPath = item.image 
    ? (item.image.startsWith('/') || item.image.startsWith('http') ? item.image : `/images/${item.image}`) 
    : '/images/hero-bg.png';
  const lineTotal = item.price * item.quantity;

  return `
    <div class="cart-item-v2" data-id="${item.id}" data-index="${index}">
      <img src="${imgPath}" alt="${item.name}" style="
        width: 60px; height: 60px; border-radius: 12px;
        object-fit: cover; flex-shrink: 0; background: #f5f6f8;
      " />
      <div style="flex: 1; min-width: 0;">
        <div style="font-size: 14px; font-weight: 700; color: #1A1A2E; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px;">${item.name}</div>
        <div style="font-size: 13px; color: #C8102E; font-weight: 600;">${formatPrice(lineTotal)}</div>
      </div>
      <div class="cart-qty-controls-v2">
        <button class="cart-qty-btn-v2 ${entry.quantity <= 1 ? 'danger' : ''}" data-action="decrease" data-id="${item.id}">
          <span class="material-icons-round" style="font-size: 16px;">${entry.quantity <= 1 ? 'delete' : 'remove'}</span>
        </button>
        <span style="font-size: 15px; font-weight: 700; color: #1A1A2E; min-width: 24px; text-align: center;">${entry.quantity}</span>
        <button class="cart-qty-btn-v2" data-action="increase" data-id="${item.id}">
          <span class="material-icons-round" style="font-size: 16px;">add</span>
        </button>
      </div>
    </div>
  `;
}

export function init() {
  const cartItems = document.getElementById('cart-items');
  
  function refreshPage() {
    // Re-render just the page content
    const pageContent = document.getElementById('page-content');
    if (pageContent) {
      pageContent.innerHTML = render();
      init();
    }
  }

  // Cart item controls (quantity, remove)
  if (cartItems) {
    cartItems.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;

      const action = btn.dataset.action;
      const itemId = btn.dataset.id;

      if (action === 'increase') {
        const entry = (store.cart || []).find(c => c.id === itemId);
        if (entry) {
          store.updateQuantity(itemId, entry.quantity + 1);
          refreshPage();
        }
      } else if (action === 'decrease') {
        const entry = (store.cart || []).find(c => c.id === itemId);
        if (entry) {
          if (entry.quantity <= 1) {
            const cardEl = btn.closest('.cart-item-v2');
            if (cardEl) {
              cardEl.classList.add('removing');
              setTimeout(() => {
                store.removeFromCart(itemId);
                refreshPage();
              }, 400);
            }
          } else {
            store.updateQuantity(itemId, entry.quantity - 1);
            refreshPage();
          }
        }
      }
    });
  }

  // Suggestion add buttons
  const suggestionGrid = document.getElementById('suggestion-grid');
  if (suggestionGrid) {
    suggestionGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.suggest-add-btn');
      if (!btn) return;

      const itemId = btn.dataset.id;
      const menuItem = (store.menu || []).find(m => m.id === itemId);
      if (!menuItem) return;

      if (!store.state.currentTable && !store.state.currentFacility) {
        showToast('Lütfen önce QR kodu okutun!', 'error');
        return;
      }

      store.addToCart(menuItem, 1, false);
      showToast(`${menuItem.name} sepete eklendi!`, 'success');
      
      // Visual feedback
      const icon = btn.querySelector('.material-icons-round');
      if (icon) {
        icon.textContent = 'check';
        btn.style.background = '#16a34a';
        setTimeout(() => {
          icon.textContent = 'add';
          btn.style.background = '#1A1A2E';
          refreshPage();
        }, 800);
      }
    });
  }

  // Sticky bar continue button
  const continueBtn = document.getElementById('cart-bar-continue');
  if (continueBtn) {
    continueBtn.addEventListener('click', () => {
      const cart = store.cart || [];
      if (cart.length === 0) return;
      
      if (!store.state.currentTable && !store.state.currentFacility) {
        showToast('Lütfen önce QR kodu okutun veya haritadan tesis seçin!', 'error');
        return;
      }
      const note = document.getElementById('order-note')?.value || '';
      sessionStorage.setItem('fatih_order_note', note);
      window.location.hash = '#/payment';
    });
  }

  // Order note focus style
  const orderNote = document.getElementById('order-note');
  if (orderNote) {
    orderNote.addEventListener('focus', () => {
      orderNote.style.borderColor = '#C8102E';
      orderNote.style.background = '#fff';
    });
    orderNote.addEventListener('blur', () => {
      orderNote.style.borderColor = '#eee';
      orderNote.style.background = '#f5f6f8';
    });
  }
}
