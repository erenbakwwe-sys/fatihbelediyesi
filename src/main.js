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
    <div class="navbar-inner">
      <a href="#/" class="navbar-brand">
        <img src="/images/fatih-belediyesi-logo.png" alt="Fatih Belediyesi" />
      </a>
      
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
        
        <a href="#/cart" class="cart-icon-wrapper">
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
router.addRoute('/cart', () => import('./pages/cart.js'));
router.addRoute('/payment', () => import('./pages/payment.js'));
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
store.subscribe((state) => {
  // 1. Update Navigation Cart Badge
  const cartBadge = document.getElementById('nav-cart-badge');
  if (cartBadge) {
    const totalQty = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalQty;
    if (totalQty > 0) {
      cartBadge.style.display = 'flex';
      cartBadge.classList.add('pulse');
    } else {
      cartBadge.style.display = 'none';
    }
  }

  // 2. Update Table Indicator
  const tableIndicator = document.getElementById('nav-table-indicator');
  const tableText = document.getElementById('nav-table-text');
  if (tableIndicator && tableText) {
    if (state.currentTable) {
      tableText.textContent = `Masa ${state.currentTable}`;
      tableIndicator.style.display = 'flex';
    } else {
      tableIndicator.style.display = 'none';
    }
  }
});

// ── Header Interactions ─────────────────────────────────────
const garsonBtn = document.getElementById('nav-garson-cagir');
if (garsonBtn) {
  garsonBtn.addEventListener('click', async (e) => {
    e.stopPropagation(); // Avoid closing mobile drawer on click
    if (!store.state.currentTable) {
      showToast('Garson çağırmak için lütfen QR kodu okutun veya bir masa seçin.', 'warning');
      return;
    }
    
    // Create elegant interactive modal for waiter call
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay fade-in';
    overlay.innerHTML = `
      <div class="modal scale-in text-center" style="max-width: 400px; padding: 30px;">
        <span class="material-icons-round text-primary" style="font-size: 54px; margin-bottom: 15px;">notifications_active</span>
        <h3 style="font-weight: 700; color: var(--text-dark); margin-bottom: 10px;">Yardım mı lazım?</h3>
        <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 25px;">
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

    // Click handler for types
    overlay.querySelectorAll('.btn-call-type').forEach(btn => {
      btn.addEventListener('click', async () => {
        const type = btn.getAttribute('data-type');
        overlay.remove();
        await store.addCall(type);
      });
    });

    overlay.querySelector('#btn-close-call-modal').addEventListener('click', () => {
      overlay.remove();
    });
  });
}

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
