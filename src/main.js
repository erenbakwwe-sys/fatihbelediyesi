/* ============================================================
   FATIH AKILLI SOFRA — Main SPA Application Entry
   ============================================================ */

// Import Stylesheets
import './style.css';
import './admin.css';

// Import Core Core
import router from './router.js';
import store from './store.js';
import { showToast } from './utils.js';

// ── Route title mapping ─────────────────────────────────────
const ROUTE_TITLES = {
  '/': null, // Landing page shows logo instead of title
  '/menu': 'Menü',
  '/cart': 'Sepetim',
  '/orders': 'Siparişlerim',
  '/facilities': 'Tesisler',
  '/payment': 'Ödeme',
  '/join-payment': 'Ortak Ödeme',
  '/scratch': 'Kazı Kazan',
};

// ── App HTML Shell Template ─────────────────────────────────
const APP_SHELL = `
  <!-- Clean Top Header (Customer Side) -->
  <header class="app-top-header" id="app-top-header">
    <button class="top-header-back" id="top-header-back" onclick="history.back()" aria-label="Geri">
      <span class="material-icons-round">arrow_back</span>
    </button>
    <div class="top-header-center" id="top-header-center">
      <a href="#/" class="top-header-logo" id="top-header-logo">
        <img src="/images/fatih-belediyesi-logo.png" alt="Fatih Belediyesi" />
      </a>
      <span class="top-header-title" id="top-header-title"></span>
    </div>
    <a href="#/cart" class="top-header-cart" aria-label="Sepet">
      <span class="material-icons-round">shopping_bag</span>
      <span class="top-header-cart-badge" id="top-header-cart-badge">0</span>
    </a>
  </header>

  <!-- Dynamic Page Workspace -->
  <main id="page-content" class="page-content"></main>

  <!-- Footer (hidden element kept for router.js compatibility) -->
  <footer class="footer" style="display:none !important;"></footer>

  <!-- Bottom Tab Bar (Mobile App Style) -->
  <nav class="bottom-tab-bar" id="bottom-tab-bar">
    <a href="#/" class="bottom-tab-item" data-tab="/">
      <span class="material-icons-round">home</span>
      <span class="bottom-tab-label">Anasayfa</span>
    </a>
    <a href="#/menu" class="bottom-tab-item" data-tab="/menu">
      <span class="material-icons-round">restaurant_menu</span>
      <span class="bottom-tab-label">Menü</span>
    </a>
    <a href="#/cart" class="bottom-tab-item" data-tab="/cart">
      <span class="material-icons-round">shopping_bag</span>
      <span class="bottom-tab-label">Sepetim</span>
      <span class="bottom-tab-badge" id="bottom-tab-cart-badge">0</span>
    </a>
    <a href="#/orders" class="bottom-tab-item" data-tab="/orders">
      <span class="material-icons-round">receipt_long</span>
      <span class="bottom-tab-label">Siparişlerim</span>
    </a>
    <a href="#/admin" class="bottom-tab-item" data-tab="/admin">
      <span class="material-icons-round">admin_panel_settings</span>
      <span class="bottom-tab-label">Yönetim</span>
    </a>
  </nav>

  <!-- Garson Çağır Floating Action Button -->
  <button id="garson-fab" aria-label="Garson Çağır">
    <span class="material-icons-round fab-icon">notifications_active</span>
    <span class="fab-label">Garson Çağır</span>
    <div class="fab-countdown"></div>
  </button>
`;

// Initialize Application Layout
const appDiv = document.getElementById('app');
if (appDiv) {
  appDiv.innerHTML = APP_SHELL;
}

// Set dynamic rendering target for Router
const pageContent = document.getElementById('page-content');
router.setContainer(pageContent);

// ── Register SPA Routes ──────────────────────────────────────
router.addRoute('/', () => import('./pages/landing.js'));
router.addRoute('/menu', () => import('./pages/menu.js'));
router.addRoute('/facilities', () => import('./pages/facilities.js'));
router.addRoute('/cart', () => import('./pages/cart.js'));
router.addRoute('/payment', () => import('./pages/payment.js'));
router.addRoute('/join-payment', () => import('./pages/join-payment.js'));
router.addRoute('/scratch', () => import('./pages/scratch-card.js'));
router.addRoute('/orders', () => import('./pages/my-orders.js'));

router.addRoute('/admin', () => import('./pages/admin-dashboard.js'));
router.addRoute('/admin/orders', () => import('./pages/admin-orders.js'));
router.addRoute('/admin/menu', () => import('./pages/admin-menu.js'));
router.addRoute('/admin/tables', () => import('./pages/admin-tables.js'));
router.addRoute('/admin/calls', () => import('./pages/admin-calls.js'));
router.addRoute('/admin/history', () => import('./pages/admin-history.js'));
router.addRoute('/admin/finance', () => import('./pages/admin-finance.js'));
router.addRoute('/admin/rewards', () => import('./pages/admin-rewards.js'));

// ── Top Header & Bottom Tab Bar — Route-aware UI Updates ─────
function updateShellForRoute() {
  const hash = window.location.hash || '#/';
  const path = hash.slice(1).split('?')[0] || '/';
  const isAdmin = path.startsWith('/admin');

  const topHeader = document.getElementById('app-top-header');
  const bottomTabBar = document.getElementById('bottom-tab-bar');
  const garsonFab = document.getElementById('garson-fab');
  const backBtn = document.getElementById('top-header-back');
  const headerLogo = document.getElementById('top-header-logo');
  const headerTitle = document.getElementById('top-header-title');

  // ── Admin routes: hide customer chrome ──
  if (isAdmin) {
    if (topHeader) topHeader.style.display = 'none';
    if (bottomTabBar) bottomTabBar.style.display = 'none';
    if (garsonFab) garsonFab.style.display = 'none';
    return;
  }

  // ── Customer routes: show customer chrome ──
  if (topHeader) topHeader.style.display = '';
  if (bottomTabBar) bottomTabBar.style.display = '';

  // Back button: hidden on landing page
  if (backBtn) {
    backBtn.style.visibility = (path === '/') ? 'hidden' : 'visible';
  }

  // Header center: logo on landing, title on other pages
  const titleText = ROUTE_TITLES[path];
  if (path === '/') {
    if (headerLogo) headerLogo.style.display = '';
    if (headerTitle) headerTitle.style.display = 'none';
  } else {
    if (headerLogo) headerLogo.style.display = 'none';
    if (headerTitle) {
      headerTitle.style.display = '';
      headerTitle.textContent = titleText || 'Fatih Akıllı Sofra';
    }
  }

  // Active tab highlighting
  const tabs = document.querySelectorAll('.bottom-tab-item');
  tabs.forEach(tab => {
    const tabPath = tab.getAttribute('data-tab');
    if (tabPath === path) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  // FAB visibility (handled further in store subscription, but set baseline)
  if (garsonFab) {
    const state = store.state;
    if (state.currentFacility) {
      garsonFab.style.display = 'none';
    } else {
      garsonFab.style.display = 'flex';
    }
  }
}

// Listen for hash changes to keep shell UI in sync
window.addEventListener('hashchange', updateShellForRoute);
window.addEventListener('load', () => {
  // Delay slightly to ensure router has done initial render
  setTimeout(updateShellForRoute, 50);
});

// ── App Store Subscriptions ──────────────────────────────────
import { playNotificationSound } from './utils.js';

store.subscribe((state, event, payload) => {
  // Handle Global Notifications
  if (event === 'NEW_ORDER') {
    const currentPath = window.location.hash;
    if (currentPath.startsWith('#/admin')) {
      showToast(`🔔 YENİ SİPARİŞ: Masa ${payload.tableNo}`, 'info');
      playNotificationSound();
    }
  } else if (event === 'NEW_CALL') {
    const currentPath = window.location.hash;
    if (currentPath.startsWith('#/admin')) {
      const typeText = payload.type === 'garson' ? 'Garson' : 'Hesap';
      showToast(`🔔 ÇAĞRI: Masa ${payload.tableNo} - ${typeText}`, 'warning');
      playNotificationSound();
    }
  }

  const totalQty = (state.cart || []).reduce((sum, item) => sum + item.quantity, 0);

  // 1. Update Top Header Cart Badge
  const headerCartBadge = document.getElementById('top-header-cart-badge');
  if (headerCartBadge) {
    headerCartBadge.textContent = totalQty;
    headerCartBadge.style.display = totalQty > 0 ? 'flex' : 'none';
  }

  // 2. Update Bottom Tab Bar Cart Badge
  const bottomTabBadge = document.getElementById('bottom-tab-cart-badge');
  if (bottomTabBadge) {
    bottomTabBadge.textContent = totalQty;
    bottomTabBadge.style.display = totalQty > 0 ? 'flex' : 'none';
  }

  // 3. FAB visibility: hide on admin routes and Gel-Al mode
  const garsonFab = document.getElementById('garson-fab');
  if (garsonFab) {
    const currentHash = window.location.hash || '';
    if (currentHash.startsWith('#/admin')) {
      garsonFab.style.display = 'none';
    } else if (state.currentFacility) {
      garsonFab.style.display = 'none';
    } else {
      garsonFab.style.display = 'flex';
    }
  }
});

// ── Garson Çağır — FAB + Spam Protection ─────────────────────
let garsonCooldownActive = false;
const GARSON_COOLDOWN_SECONDS = 60;

const handleGarsonCagir = async (e) => {
  e.stopPropagation();

  // Block if cooldown active
  if (garsonCooldownActive) {
    showToast('Garson çağrınız iletildi, lütfen bekleyin.', 'info');
    return;
  }

  // Block if no QR scanned
  if (!store.state.currentTable) {
    showToast('Lütfen önce masanızdaki QR kodu okutun.', 'error');
    return;
  }
  
  // Show call type modal
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay fade-in';
  overlay.innerHTML = `
    <div class="modal scale-in text-center" style="max-width: 400px; padding: 30px;">
      <span class="material-icons-round text-primary" style="font-size: 54px; margin-bottom: 15px;">notifications_active</span>
      <h3 style="font-weight: 700; color: var(--color-text); margin-bottom: 10px;">Yardım mı lazım?</h3>
      <p style="color: var(--color-text-muted); font-size: 14px; margin-bottom: 25px;">
        Masa ${store.state.currentTable} için ne tür bir talepte bulunmak istersiniz?
      </p>
      <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
        <button class="btn btn-primary btn-call-type" data-type="garson">
          <span class="material-icons-round" style="margin-right: 5px;">person</span> Garson Çağır
        </button>
        <button class="btn btn-secondary btn-call-type" data-type="hesap_nfc">
          <span class="material-icons-round" style="margin-right: 5px;">nfc</span> Kart / Temassız Hesap
        </button>
        <button class="btn btn-outline btn-call-type" data-type="hesap_nakit">
          <span class="material-icons-round" style="margin-right: 5px;">payments</span> Nakit Hesap
        </button>
      </div>
      <button class="btn btn-ghost text-muted" id="btn-close-call-modal">Kapat</button>
    </div>
  `;
  
  document.body.appendChild(overlay);

  overlay.querySelectorAll('.btn-call-type').forEach(btn => {
    btn.addEventListener('click', async () => {
      const type = btn.getAttribute('data-type');
      overlay.remove();
      await store.addCall(type);
      startGarsonCooldown();
    });
  });

  overlay.querySelector('#btn-close-call-modal').addEventListener('click', () => {
    overlay.remove();
  });
};

function startGarsonCooldown() {
  garsonCooldownActive = true;
  const fab = document.getElementById('garson-fab');
  if (!fab) return;

  // Flash green success first
  fab.classList.add('fab-success');
  const labelEl = fab.querySelector('.fab-label');
  if (labelEl) labelEl.textContent = 'Çağrıldı ✓';

  setTimeout(() => {
    fab.classList.remove('fab-success');
    fab.classList.add('fab-cooldown');

    let remaining = GARSON_COOLDOWN_SECONDS;
    if (labelEl) labelEl.textContent = `${remaining}s bekleyin`;

    const interval = setInterval(() => {
      remaining--;
      if (labelEl) labelEl.textContent = `${remaining}s bekleyin`;

      if (remaining <= 0) {
        clearInterval(interval);
        garsonCooldownActive = false;
        fab.classList.remove('fab-cooldown');
        if (labelEl) labelEl.textContent = 'Garson Çağır';
      }
    }, 1000);
  }, 1500);
}

// Bind FAB click
const garsonFabBtn = document.getElementById('garson-fab');
if (garsonFabBtn) garsonFabBtn.addEventListener('click', handleGarsonCagir);

// ── Preloader Animation Dismissal ───────────────────────────
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.style.transition = 'opacity 0.6s ease, visibility 0.6s ease';
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
      setTimeout(() => {
        preloader.remove();
      }, 600);
    }, 1200); // 1.2s delay for maximum premium effect
  }
});
