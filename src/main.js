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

// ── App HTML Shell Template ─────────────────────────────────
const APP_SHELL = `
  <!-- Top Navigation Header (Customer Side) -->
  <nav class="navbar">
    <div class="navbar-inner" style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
      <a href="#/" class="navbar-brand">
        <img src="/images/fatih-belediyesi-logo.png" alt="Fatih Belediyesi" />
      </a>
      
      <!-- Quick Action Buttons Directly in Header for Mobile/Desktop -->
      <div class="navbar-quick-actions" style="display: flex; align-items: center; gap: 8px; margin-left: auto; margin-right: 8px; z-index: var(--z-sticky);">
        <div id="header-table-indicator" class="table-badge" style="display: none; padding: 5px 10px; font-size: 11px; font-weight: 700; color: var(--color-primary); background: rgba(200,16,46,0.08); border-radius: 20px; align-items: center; gap: 4px; border: 1px solid rgba(200,16,46,0.12);">
          <span class="material-icons-round" style="font-size: 13px;">table_restaurant</span>
          <span id="header-table-text">Masa</span>
        </div>
        
        <button id="header-garson-cagir" class="btn-call-waiter" style="padding: 5px 12px; font-size: 11px; display: inline-flex; align-items: center; gap: 4px; border-radius: 20px; background: var(--color-primary); color: #fff; border: none; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 10px rgba(200,16,46,0.2);">
          <span class="material-icons-round" style="font-size: 14px;">notifications_active</span>
          <span class="header-call-text">Garson Çağır</span>
        </button>
        
        <a href="#/cart" class="cart-icon-wrapper" style="position: relative; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 50%; background: #f5f5f5; color: var(--color-secondary); text-decoration: none; border: 1.5px solid #eef0f5; transition: all 0.2s;">
          <span class="material-icons-round" style="font-size: 18px;">shopping_basket</span>
          <span id="header-cart-badge" class="cart-badge" style="position: absolute; top: -4px; right: -4px; background: var(--color-primary); color: #fff; font-size: 9px; font-weight: 700; width: 15px; height: 15px; border-radius: 50%; display: none; align-items: center; justify-content: center; animation: pulse 2s ease-in-out infinite;">0</span>
        </a>
      </div>

      <!-- Mobile Toggle Button -->
      <button class="navbar-toggle" id="navbar-toggle-btn">
        <span></span>
      </button>

      <div class="navbar-nav" id="navbar-links">
        <a href="#/" class="nav-item">Ana Sayfa</a>
        <a href="#/menu" class="nav-item">Dijital Menü</a>
        <a href="#/cart" class="nav-item">Sepetim</a>
        <a href="#/orders" class="nav-item">Sipariş Takibi</a>
        
        <!-- Table indicator badge inside mobile menu or header -->
        <div id="nav-table-indicator" class="table-badge" style="display: none; padding: 6px 12px; font-size:13px; font-weight:600; color:var(--color-primary); background:rgba(200,16,46,0.08); border-radius:20px; align-items:center; gap:4px;">
          <span class="material-icons-round" style="font-size:16px;">table_restaurant</span>
          <span id="nav-table-text">Masa</span>
        </div>
        
        <button id="nav-garson-cagir" class="btn-call-waiter">
          <span class="material-icons-round">notifications_active</span>
          <span>Garson Çağır</span>
        </button>
        
        <a href="#/cart" class="cart-icon-wrapper-drawer" style="display:none;">
          <span class="material-icons-round">shopping_basket</span>
          <span id="nav-cart-badge" class="cart-badge">0</span>
        </a>
      </div>
    </div>
  </nav>

  <!-- Dynamic Page Workspace with offset padding-top class -->
  <main id="page-content" class="page-content"></main>

  <!-- Footer (Customer Side) -->
  <footer class="footer">
    <div class="container footer-grid">
      <div class="footer-brand">
        <img src="/images/fatih-belediyesi-logo.png" alt="Fatih Belediyesi" class="footer-logo" />
        <p class="footer-slogan">"Fatih Belediyesi öncülüğünde akıllı, hızlı ve modern hizmet deneyimi"</p>
      </div>
      <div class="footer-links">
        <h4>Hızlı Bağlantılar</h4>
        <ul>
          <li><a href="#/">Ana Sayfa</a></li>
          <li><a href="#/menu">Dijital Menü</a></li>
          <li><a href="#/cart">Sepetim</a></li>
          <li><a href="#/orders">Siparişlerim</a></li>
          <li><a href="#/admin">Yönetim Paneli</a></li>
        </ul>
      </div>
      <div class="footer-info">
        <h4>Fatih Akıllı Sofra</h4>
        <p>Fatih Akıllı Sofra, Fatih Belediyesi tesislerinde hızlı, hijyenik ve modern bir servis deneyimi sunmak amacıyla geliştirilmiş akıllı otomasyon sistemidir.</p>
      </div>
    </div>
    <div class="footer-bottom text-center">
      <p>&copy; ${new Date().getFullYear()} Fatih Belediyesi Bilgi İşlem Müdürlüğü. Tüm Hakları Saklıdır.</p>
    </div>
  </footer>

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

// ── Mobile Menu Toggle Handler ──────────────────────────────
const toggleBtn = document.getElementById('navbar-toggle-btn');
const navLinksEl = document.getElementById('navbar-links');
if (toggleBtn && navLinksEl) {
  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinksEl.classList.toggle('open');
    toggleBtn.classList.toggle('active');
  });

  // Close menu when clicking outside or clicking any nav link
  document.addEventListener('click', () => {
    navLinksEl.classList.remove('open');
    toggleBtn.classList.remove('active');
  });
  
  navLinksEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinksEl.classList.remove('open');
      toggleBtn.classList.remove('active');
    });
  });
}

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

  // 1. Update Navigation Cart Badges (Drawer & Header)
  const cartBadgeDrawer = document.getElementById('nav-cart-badge');
  const cartBadgeHeader = document.getElementById('header-cart-badge');

  [cartBadgeDrawer, cartBadgeHeader].forEach(badge => {
    if (badge) {
      badge.textContent = totalQty;
      if (totalQty > 0) {
        badge.style.display = 'flex';
        badge.classList.add('pulse');
      } else {
        badge.style.display = 'none';
      }
    }
  });

  // 2. Update Table Indicators (Drawer & Header)
  const tableIndicatorDrawer = document.getElementById('nav-table-indicator');
  const tableTextDrawer = document.getElementById('nav-table-text');
  const tableIndicatorHeader = document.getElementById('header-table-indicator');
  const tableTextHeader = document.getElementById('header-table-text');

  const btnGarsonHeader = document.getElementById('header-garson-cagir');
  const btnGarsonDrawer = document.getElementById('nav-garson-cagir');

  if (state.currentTable) {
    if (tableTextDrawer) tableTextDrawer.textContent = `Masa ${state.currentTable}`;
    if (tableIndicatorDrawer) tableIndicatorDrawer.style.display = 'flex';
    if (tableTextHeader) tableTextHeader.textContent = `Masa ${state.currentTable}`;
    if (tableIndicatorHeader) tableIndicatorHeader.style.display = 'flex';
    if (btnGarsonHeader) btnGarsonHeader.style.display = 'inline-flex';
    if (btnGarsonDrawer) btnGarsonDrawer.style.display = 'flex';
  } else if (state.currentFacility) {
    const facilitiesMap = {
      'catladikapi': 'Çatladıkapı',
      'topkapi': 'Topkapı',
      'ayvansaray': 'Ayvansaray',
      'yedikule': 'Yedikule',
      'sultanahmet': 'Sultanahmet',
      'karagumruk': 'Karagümrük'
    };
    const facName = facilitiesMap[state.currentFacility] || 'Tesis';
    if (tableTextDrawer) tableTextDrawer.textContent = `Gel-Al: ${facName}`;
    if (tableIndicatorDrawer) tableIndicatorDrawer.style.display = 'flex';
    if (tableTextHeader) tableTextHeader.textContent = `Gel-Al: ${facName}`;
    if (tableIndicatorHeader) tableIndicatorHeader.style.display = 'flex';
    if (btnGarsonHeader) btnGarsonHeader.style.display = 'none';
    if (btnGarsonDrawer) btnGarsonDrawer.style.display = 'none';
  } else {
    if (tableIndicatorDrawer) tableIndicatorDrawer.style.display = 'none';
    if (tableIndicatorHeader) tableIndicatorHeader.style.display = 'none';
    if (btnGarsonHeader) btnGarsonHeader.style.display = 'none';
    if (btnGarsonDrawer) btnGarsonDrawer.style.display = 'none';
  }
  
  // ── FAB visibility: hide on admin routes and Gel-Al mode ──
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
  
  // Close mobile drawer if open
  const navLinksEl = document.getElementById('navbar-links');
  const toggleBtn = document.getElementById('navbar-toggle-btn');
  if (navLinksEl) navLinksEl.classList.remove('open');
  if (toggleBtn) toggleBtn.classList.remove('active');

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

// Also keep navbar buttons working
const garsonBtnDrawer = document.getElementById('nav-garson-cagir');
const garsonBtnHeader = document.getElementById('header-garson-cagir');
if (garsonBtnDrawer) garsonBtnDrawer.addEventListener('click', handleGarsonCagir);
if (garsonBtnHeader) garsonBtnHeader.addEventListener('click', handleGarsonCagir);

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
