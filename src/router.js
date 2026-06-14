/* ============================================================
   FATIH AKILLI SOFRA — SPA Hash Router
   ============================================================ */

class Router {
  constructor() {
    this.routes = {};
    this.currentPath = null;
    this.currentPage = null;
    this.container = null;

    // Listen to hash changes
    window.addEventListener('hashchange', () => this.handleRouteChange());
    window.addEventListener('load', () => this.handleRouteChange());
  }

  // ── Register Routes ─────────────────────────────────────────
  addRoute(path, pageModuleResolver) {
    this.routes[path] = pageModuleResolver;
  }

  setContainer(element) {
    this.container = element;
  }

  // ── Navigation Method ───────────────────────────────────────
  navigate(path) {
    window.location.hash = path.startsWith('/') ? path : '/' + path;
  }

  getCurrentRoute() {
    const hash = window.location.hash || '#/';
    // Strip query strings or table parameters from hash path
    const path = hash.slice(1).split('?')[0] || '/';
    return path;
  }

  // ── Route Change Handler ────────────────────────────────────
  async handleRouteChange() {
    if (!this.container) return;

    // Cleanup any lingering global overlays/popups from previous routes
    const upsellPopup = document.querySelector('.bottom-popup-overlay');
    if (upsellPopup) upsellPopup.remove();
    const modalOverlays = document.querySelectorAll('.modal-overlay');
    modalOverlays.forEach(overlay => overlay.remove());

    const path = this.getCurrentRoute();
    this.currentPath = path;
    const isAdminRoute = path.startsWith('/admin');

    // 1. Render layout structure if we switched layouts
    if (isAdminRoute) {
      // Check if admin shell is already loaded
      let pageHolder = document.getElementById('admin-page-holder');
      if (!pageHolder) {
        this.container.innerHTML = `
          <div class="admin-layout">
            <!-- Sidebar toggle button for mobile -->
            <button class="sidebar-toggle" id="admin-sidebar-toggle">
              <span class="material-icons-round">menu</span>
            </button>
            <div class="sidebar-backdrop" id="admin-sidebar-backdrop"></div>

            <aside class="admin-sidebar">
              <div class="sidebar-brand">
                <div class="sidebar-brand-logo">F</div>
                <div class="sidebar-brand-text">
                  <span class="sidebar-brand-name">FATİH <span>SOFRA</span></span>
                  <span class="sidebar-brand-sub">AKILLI BELEDİYE</span>
                </div>
              </div>
              <nav class="sidebar-nav">
                <div class="sidebar-section-label">YÖNETİM</div>
                <a href="#/admin" class="sidebar-nav-item" data-admin-nav="/admin">
                  <span class="material-icons-round nav-icon">dashboard</span>
                  <span class="nav-label">Dashboard</span>
                </a>
                <a href="#/admin/orders" class="sidebar-nav-item" data-admin-nav="/admin/orders">
                  <span class="material-icons-round nav-icon">receipt_long</span>
                  <span class="nav-label">Siparişler</span>
                </a>
                <a href="#/admin/menu" class="sidebar-nav-item" data-admin-nav="/admin/menu">
                  <span class="material-icons-round nav-icon">restaurant_menu</span>
                  <span class="nav-label">Menü Yönetimi</span>
                </a>
                <a href="#/admin/tables" class="sidebar-nav-item" data-admin-nav="/admin/tables">
                  <span class="material-icons-round nav-icon">table_restaurant</span>
                  <span class="nav-label">Masa & QR</span>
                </a>
                <a href="#/admin/stock" class="sidebar-nav-item" data-admin-nav="/admin/stock">
                  <span class="material-icons-round nav-icon">inventory_2</span>
                  <span class="nav-label">Stok & Maliyet</span>
                </a>
                <a href="#/admin/calls" class="sidebar-nav-item" data-admin-nav="/admin/calls">
                  <span class="material-icons-round nav-icon">notifications_active</span>
                  <span class="nav-label">Çağrılar</span>
                </a>
                <a href="#/admin/history" class="sidebar-nav-item" data-admin-nav="/admin/history">
                  <span class="material-icons-round nav-icon">history</span>
                  <span class="nav-label">Geçmiş</span>
                </a>
                <a href="#/admin/finance" class="sidebar-nav-item" data-admin-nav="/admin/finance">
                  <span class="material-icons-round nav-icon">analytics</span>
                  <span class="nav-label">Finans</span>
                </a>
                <a href="#/admin/rewards" class="sidebar-nav-item" data-admin-nav="/admin/rewards">
                  <span class="material-icons-round nav-icon">emoji_events</span>
                  <span class="nav-label">Ödüller</span>
                </a>
              </nav>
              <div class="sidebar-footer">
                <a href="#/" class="sidebar-nav-item" style="color:rgba(255,255,255,0.5);">
                  <span class="material-icons-round nav-icon">arrow_back</span>
                  <span class="nav-label">Müşteri Ekranı</span>
                </a>
              </div>
            </aside>
            <main class="admin-main">
              <div class="admin-main-content" id="admin-page-holder"></div>
            </main>
          </div>
        `;
        pageHolder = document.getElementById('admin-page-holder');
      }

      // Show skeleton inside the page holder
      pageHolder.innerHTML = `
        <div class="skeleton-container fade-in" style="padding:20px;">
          <div class="skeleton-header" style="height:40px; width:60%; margin-bottom:20px;"></div>
          <div class="skeleton-body">
            <div class="skeleton-line" style="height:150px; margin-bottom:20px;"></div>
            <div class="skeleton-line" style="height:300px;"></div>
          </div>
        </div>
      `;
    } else {
      // If going to customer route, make sure we clean up the admin shell and draw skeleton directly
      this.container.innerHTML = `
        <div class="skeleton-container fade-in">
          <div class="skeleton-header"></div>
          <div class="skeleton-body">
            <div class="skeleton-line"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line"></div>
          </div>
        </div>
      `;
    }

    // 2. Fetch page module resolver
    const resolver = this.routes[path] || this.routes['/']; // Fallback to landing/home
    
    try {
      // Execute the resolver to load page
      const pageModule = await resolver();
      
      // Cleanup previous page if it exists
      if (this.currentPage && typeof this.currentPage.destroy === 'function') {
        this.currentPage.destroy();
      }

      this.currentPage = pageModule.default || pageModule;

      // Determine correct mount target
      const mountTarget = isAdminRoute ? document.getElementById('admin-page-holder') : this.container;

      // 3. Render HTML
      if (mountTarget) {
        if (typeof this.currentPage.render === 'function') {
          mountTarget.innerHTML = this.currentPage.render();
        } else {
          mountTarget.innerHTML = '<div style="padding:40px; text-align:center;">Sayfa yükleme arayüzü bulunamadı.</div>';
        }
      }

      // 4. Bind event listeners
      if (typeof this.currentPage.init === 'function') {
        this.currentPage.init();
      }

      // Bind mobile sidebar toggle inside router
      const sidebarToggle = document.getElementById('admin-sidebar-toggle');
      const sidebarEl = document.querySelector('.admin-sidebar');
      const sidebarBackdrop = document.getElementById('admin-sidebar-backdrop');
      if (sidebarToggle && sidebarEl && sidebarBackdrop) {
        const toggleSidebar = (e) => {
          e.stopPropagation();
          sidebarEl.classList.toggle('open');
          sidebarBackdrop.classList.toggle('active');
        };
        sidebarToggle.onclick = toggleSidebar;
        sidebarBackdrop.onclick = toggleSidebar;
        
        // Auto-close on nav item clicks
        sidebarEl.querySelectorAll('.sidebar-nav-item').forEach(link => {
          link.addEventListener('click', () => {
            sidebarEl.classList.remove('open');
            sidebarBackdrop.classList.remove('active');
          });
        });
      }

      // 5. Update active link in navbar / sidebar
      this.updateActiveNavLinks(path);

      // 6. Scroll reveal animations initialization
      this.initScrollReveal();

    } catch (e) {
      console.error(`Failed to load route: ${path}`, e);
      let mountTarget = isAdminRoute ? document.getElementById('admin-page-holder') : this.container;
      if (!mountTarget) {
        mountTarget = this.container;
      }
      if (mountTarget) {
        mountTarget.innerHTML = `
          <div class="container text-center reveal" style="padding: 100px 20px; max-width: 500px; margin: 0 auto; text-align: center;">
            <span class="material-icons text-primary" style="font-size: 64px; color: #C8102E;">error_outline</span>
            <h2 style="margin-top:20px; font-weight:700; color: #1A1A2E;">Sayfa Yüklenemedi</h2>
            <p style="color: #666; margin: 15px 0;">İstediğiniz sayfaya şu anda erişemiyoruz.</p>
            <div style="background: #f8f9fa; border: 1px solid #eee; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 13px; color: #ef4444; margin-bottom: 20px; word-break: break-all; text-align: left;">
              Hata: ${e.stack || e.message}
            </div>
            <a href="#/" class="btn btn-primary" style="margin-top:15px;">Ana Sayfaya Dön</a>
          </div>
        `;
      }
    }
  }

  // ── Highlight Active Navigation Links ───────────────────────
  updateActiveNavLinks(path) {
    // Top customer nav links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${path}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Sidebar admin navigation links
    const sidebarLinks = document.querySelectorAll('.admin-sidebar [data-admin-nav]');
    sidebarLinks.forEach(link => {
      const navPath = link.getAttribute('data-admin-nav');
      if (navPath === path) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Toggle customer header / admin sidebar layouts based on route
    const isAdminRoute = path.startsWith('/admin');
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const mainWrapper = document.getElementById('app');

    if (isAdminRoute) {
      if (header) header.style.display = 'none';
      if (footer) footer.style.display = 'none';
      if (mainWrapper) mainWrapper.classList.add('admin-mode');
    } else {
      if (header) header.style.display = 'flex';
      if (footer) footer.style.display = 'block';
      if (mainWrapper) mainWrapper.classList.remove('admin-mode');
    }
  }

  // ── Scroll Reveal Trigger ──────────────────────────────────
  initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    const revealOnScroll = () => {
      const windowHeight = window.innerHeight;
      reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 100;
        
        if (elementTop < windowHeight - elementVisible) {
          element.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', revealOnScroll);
    // Initial run to reveal elements already visible
    setTimeout(revealOnScroll, 100);
  }
}

const router = new Router();
export default router;
export { router };
