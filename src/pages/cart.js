// ─── Cart Page ─── Fatih Akıllı Sofra
// Shopping cart with quantity controls, order notes, summary

import { store } from '../store.js';
import { formatPrice, showToast } from '../utils.js';

export function render() {
  const cart = store.cart || [];
  const total = store.getCartTotal ? store.getCartTotal() : 0;

  if (cart.length === 0) {
    return renderEmptyCart();
  }

  return `
    <div class="cart-page" style="padding-bottom: 3rem; max-width: 700px; margin: 0 auto;">

      <!-- ═══ HEADER ═══ -->
      <div style="text-align: center; padding: 1.5rem 1rem 1rem;">
        <h1 style="font-size: 1.6rem; font-weight: 800; color: #1A1A2E; margin-bottom: 0.3rem;">
          <span class="material-icons-round" style="vertical-align: middle; margin-right: 0.3rem; color: #C8102E;">shopping_cart</span>
          Sepetim
        </h1>
        <p class="text-muted" style="font-size: 0.88rem;">${cart.length} ürün</p>
      </div>

      <!-- ═══ CART ITEMS ═══ -->
      <div id="cart-items" style="padding: 0 1rem;">
        ${cart.map((entry, index) => renderCartItem(entry, index)).join('')}
      </div>

      <!-- ═══ ORDER NOTE ═══ -->
      <div style="padding: 1.2rem 1rem 0;">
        <div class="form-group">
          <label class="form-label" style="font-weight: 600; color: #1A1A2E; font-size: 0.92rem;">
            <span class="material-icons-round" style="font-size: 1.1rem; vertical-align: middle; margin-right: 0.3rem;">edit_note</span>
            Sipariş Notu
          </label>
          <textarea id="order-note" class="form-textarea" rows="3"
                    placeholder="Ekstra isteklerinizi buraya yazabilirsiniz... (ör: Az acılı, yanında sos olsun)"
                    style="
            width: 100%; border-radius: 12px; border: 2px solid #e8e8e8;
            padding: 0.8rem 1rem; font-size: 0.9rem; resize: vertical;
            transition: border-color 0.3s; box-sizing: border-box;
          "></textarea>
        </div>
      </div>

      <!-- ═══ CART SUMMARY ═══ -->
      <div style="padding: 1.2rem 1rem 0;">
        <div class="card" style="
          border-radius: 16px; padding: 1.5rem;
          background: linear-gradient(135deg, #fafafa, #fff);
          border: 2px solid #f0f0f0;
        ">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
            <span style="font-size: 0.95rem; color: #666;">Ara Toplam</span>
            <span id="cart-subtotal" style="font-size: 1rem; font-weight: 600; color: #1A1A2E;">${formatPrice(total)}</span>
          </div>
          <div style="height: 1px; background: #eee; margin-bottom: 0.8rem;"></div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem;">
            <span style="font-size: 1.1rem; font-weight: 700; color: #1A1A2E;">Toplam</span>
            <span id="cart-total" style="font-size: 1.3rem; font-weight: 800; color: #C8102E;">${formatPrice(total)}</span>
          </div>

          <button id="confirm-order-btn" class="btn btn-primary btn-lg" style="
            width: 100%; padding: 1rem; border-radius: 14px;
            font-size: 1.05rem; font-weight: 700;
            display: flex; align-items: center; justify-content: center; gap: 0.6rem;
            box-shadow: 0 6px 24px rgba(200,16,46,0.3);
          ">
            <span class="material-icons-round">check_circle</span>
            Siparişi Onayla
          </button>
        </div>
      </div>

      <!-- ═══ FOOTER NOTE ═══ -->
      <div style="text-align: center; padding: 2rem 1rem 0;">
        <p style="
          font-size: 0.82rem; color: #999;
          display: flex; align-items: center; justify-content: center; gap: 0.4rem;
        ">
          <span class="material-icons-round" style="font-size: 1rem; color: #C8102E;">verified</span>
          Fatih Belediyesi olarak hizmetinizdeyiz
        </p>
      </div>
    </div>

    <style>
      .cart-item {
        background: #fff;
        border-radius: 14px;
        padding: 1rem;
        margin-bottom: 0.8rem;
        display: flex;
        gap: 1rem;
        align-items: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        transition: all 0.4s cubic-bezier(0.22,1,0.36,1);
        overflow: hidden;
      }
      .cart-item.removing {
        opacity: 0;
        transform: translateX(100px);
        max-height: 0;
        padding-top: 0;
        padding-bottom: 0;
        margin-bottom: 0;
      }
      .cart-item__img {
        width: 70px; height: 70px;
        border-radius: 12px;
        object-fit: cover;
        flex-shrink: 0;
      }
      .cart-item__info {
        flex: 1; min-width: 0;
      }
      .cart-item__name {
        font-size: 0.95rem;
        font-weight: 700;
        color: #1A1A2E;
        margin-bottom: 0.2rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .cart-item__price {
        font-size: 0.88rem;
        color: #C8102E;
        font-weight: 600;
      }
      .cart-qty-controls {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .cart-qty-btn {
        width: 34px; height: 34px;
        border-radius: 50%;
        border: 2px solid #e0e0e0;
        background: #fff;
        color: #555;
        font-size: 1.2rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
      }
      .cart-qty-btn:hover {
        border-color: #C8102E;
        color: #C8102E;
      }
      .cart-qty-btn.danger:hover {
        border-color: #ef4444;
        color: #ef4444;
        background: #fef2f2;
      }
      .cart-qty-value {
        font-size: 1rem;
        font-weight: 700;
        color: #1A1A2E;
        min-width: 28px;
        text-align: center;
        transition: transform 0.2s;
      }
      .cart-qty-value.bump {
        transform: scale(1.3);
      }
      .cart-remove-btn {
        background: none;
        border: none;
        color: #ccc;
        cursor: pointer;
        padding: 0.3rem;
        border-radius: 8px;
        transition: all 0.2s;
      }
      .cart-remove-btn:hover {
        color: #ef4444;
        background: #fef2f2;
      }
      #order-note:focus {
        border-color: #C8102E;
        outline: none;
        box-shadow: 0 0 0 3px rgba(200,16,46,0.1);
      }
    </style>
  `;
}

function renderCartItem(entry, index) {
  const item = entry;
  const imgPath = item.image 
    ? (item.image.startsWith('/') || item.image.startsWith('http') ? item.image : `/images/${item.image}`) 
    : '/images/hero-bg.png';
  const lineTotal = item.price * item.quantity;

  return `
    <div class="cart-item" data-id="${item.id}" data-index="${index}">
      <img class="cart-item__img" src="${imgPath}" alt="${item.name}" />
      <div class="cart-item__info">
        <div class="cart-item__name">${item.name}</div>
        <div class="cart-item__price">${formatPrice(lineTotal)}</div>
      </div>
      <div class="cart-qty-controls">
        <button class="cart-qty-btn ${entry.quantity <= 1 ? 'danger' : ''}" data-action="decrease" data-id="${item.id}">
          <span class="material-icons-round" style="font-size: 1rem;">${entry.quantity <= 1 ? 'delete' : 'remove'}</span>
        </button>
        <span class="cart-qty-value">${entry.quantity}</span>
        <button class="cart-qty-btn" data-action="increase" data-id="${item.id}">
          <span class="material-icons-round" style="font-size: 1rem;">add</span>
        </button>
      </div>
      <button class="cart-remove-btn" data-action="remove" data-id="${item.id}" title="Kaldır">
        <span class="material-icons-round" style="font-size: 1.2rem;">close</span>
      </button>
    </div>
  `;
}

function renderEmptyCart() {
  return `
    <div style="
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      min-height: 60vh; padding: 2rem; text-align: center;
    ">
      <div style="
        width: 100px; height: 100px; border-radius: 50%;
        background: #f8f9fa; display: flex; align-items: center; justify-content: center;
        margin-bottom: 1.5rem;
      ">
        <span class="material-icons-round" style="font-size: 3rem; color: #ddd;">shopping_bag</span>
      </div>
      <h2 style="font-size: 1.4rem; font-weight: 700; color: #1A1A2E; margin-bottom: 0.5rem;">Sepetiniz boş</h2>
      <p class="text-muted" style="font-size: 0.92rem; margin-bottom: 1.5rem; max-width: 300px;">
        Menümüzden lezzetli yemekler ekleyerek siparişinize başlayın
      </p>
      <a href="#/menu" class="btn btn-primary" style="
        padding: 0.8rem 2rem; border-radius: 50px; font-size: 0.95rem;
        display: flex; align-items: center; justify-content: center; gap: 0.5rem; text-decoration: none;
      ">
        <span class="material-icons-round">restaurant_menu</span>
        Menüye Git
      </a>
    </div>
  `;
}

export function init() {
  const cartItems = document.getElementById('cart-items');
  if (!cartItems) return; // empty cart state

  // Helper to re-render the page
  function refreshPage() {
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = render();
      init();
    }
  }

  // Event delegation for cart controls
  cartItems.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const itemId = btn.dataset.id;

    if (action === 'increase') {
      const entry = (store.cart || []).find(c => c.id === itemId);
      if (entry) {
        store.updateQuantity(itemId, entry.quantity + 1);
        // Animate qty value
        const qtyEl = btn.parentElement.querySelector('.cart-qty-value');
        if (qtyEl) {
          qtyEl.classList.add('bump');
          setTimeout(() => qtyEl.classList.remove('bump'), 200);
        }
        refreshPage();
      }
    } else if (action === 'decrease') {
      const entry = (store.cart || []).find(c => c.id === itemId);
      if (entry) {
        if (entry.quantity <= 1) {
          // Remove with animation
          const cardEl = btn.closest('.cart-item');
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
    } else if (action === 'remove') {
      const cardEl = btn.closest('.cart-item');
      if (cardEl) {
        cardEl.classList.add('removing');
        setTimeout(() => {
          store.removeFromCart(itemId);
          showToast('Ürün sepetten kaldırıldı', 'info');
          refreshPage();
        }, 400);
      }
    }
  });

  // Confirm order
  const confirmBtn = document.getElementById('confirm-order-btn');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      const note = document.getElementById('order-note')?.value || '';
      sessionStorage.setItem('fatih_order_note', note);
      window.location.hash = '#/payment';
    });
  }
}
