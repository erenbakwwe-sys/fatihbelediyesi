/* ============================================================
   FATIH AKILLI SOFRA — Stok & Maliyet Yönetimi Sayfası
   ============================================================ */

import store from '../store.js';
import { formatPrice } from '../utils.js';

let activeCategory = 'all';
let searchQuery = '';
let selectedItemId = null;
let unsubscribe = null;

const categoryMap = {
  starters: 'Başlangıç',
  mains: 'Ana Yemek',
  kebabs: 'Kebap',
  desserts: 'Tatlı',
  drinks: 'İçecek'
};

export default {
  render() {
    return `
      <div class="admin-page admin-stock">
        <div class="page-header flex justify-between align-center" style="margin-bottom: 2rem;">
          <div>
            <h1><span class="material-icons-round">inventory_2</span> Stok & Maliyet Yönetimi</h1>
            <p class="page-subtitle" style="color:var(--text-muted); margin-top:5px;">
              Ürün stok seviyeleri, birim maliyetler ve sipariş kâr/zarar maliyet analizleri.
            </p>
          </div>
        </div>
        
        <!-- KPI Kartları -->
        <div id="stock-kpi-container" class="metrics-grid"></div>

        <!-- Ana Arayüz Grid Yapısı -->
        <div class="stock-main-grid">
          
          <!-- Sol Kısım: Ürün Stok Listesi -->
          <div class="card" style="padding: 24px;">
            <div class="flex justify-between align-center" style="margin-bottom: 20px; flex-wrap: wrap; gap: 15px;">
              <h3 style="font-weight:700; color:var(--text-dark);">Stok Durumu ve Maliyet Ayarları</h3>
              
              <!-- Arama Çubuğu -->
              <div class="flex gap-4 align-center" style="flex-wrap: wrap;">
                <div class="filter-search-wrapper" style="position:relative;">
                  <span class="material-icons-round search-icon" style="position:absolute; left:10px; top:50%; transform:translateY(-50%); color:var(--text-muted); font-size:18px;">search</span>
                  <input type="text" id="stock-search" placeholder="Ürün ara..." class="form-input" style="padding-left: 35px; width: 200px; height: 38px; border-radius: 20px; font-size: 13px;" />
                </div>
              </div>
            </div>

            <!-- Kategori Sekmeleri -->
            <div class="category-tabs flex gap-2" id="stock-category-tabs" style="margin-bottom: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px; overflow-x: auto; white-space: nowrap;">
              <!-- Sekmeler dinamik yüklenecek -->
            </div>

            <div class="table-scroll">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Ürün</th>
                    <th>Kategori</th>
                    <th>Satış Fiyatı</th>
                    <th>Birim Maliyet</th>
                    <th>Stok Seviyesi</th>
                    <th>Durum</th>
                    <th style="text-align: center;">Takip</th>
                    <th style="text-align: right; width: 80px;">İşlem</th>
                  </tr>
                </thead>
                <tbody id="stock-table-body">
                  <!-- Dinamik ürün satırları -->
                </tbody>
              </table>
            </div>
          </div>

          <!-- Sağ Kısım: Karlılık ve Maliyet Analiz Tablosu -->
          <div class="card" style="padding: 24px;">
            <h3 style="font-weight:700; color:var(--text-dark); margin-bottom: 5px;">Kâr Analizi & Marj Dağılımı</h3>
            <p style="font-size: 12px; color:var(--text-muted); margin-bottom: 20px;">
              Ürün bazında gerçekleşen kâr ve brüt kâr marjı (%) analizi.
            </p>
            <div class="table-scroll">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Ürün</th>
                    <th style="text-align: center; width: 60px;">Satış</th>
                    <th>Toplam Maliyet</th>
                    <th>Net Kâr</th>
                    <th style="text-align: right; width: 80px;">Marj</th>
                  </tr>
                </thead>
                <tbody id="profitability-table-body">
                  <!-- Dinamik analiz satırları -->
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <!-- Düzenleme Modalı -->
        <div id="stock-edit-modal" class="modal-overlay" style="display: none;"></div>
      </div>

      <style>
        .stock-main-grid {
          display: grid;
          grid-template-columns: 1.8fr 1.2fr;
          gap: 24px;
          align-items: start;
          margin-bottom: 30px;
        }
        
        .stock-progress-bar {
          background: #e9ecef;
          height: 6px;
          border-radius: 3px;
          overflow: hidden;
          width: 100px;
          margin-top: 4px;
        }
        
        .stock-progress-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.3s ease;
        }
        
        .stock-progress-fill.safe { background: #2e7d32; }
        .stock-progress-fill.warning { background: #ef6c00; }
        .stock-progress-fill.danger { background: #c62828; }
        
        @media (max-width: 1024px) {
          .stock-main-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>
    `;
  },

  init() {
    activeCategory = 'all';
    searchQuery = '';
    selectedItemId = null;

    // Arama dinleyicisi
    const searchInput = document.getElementById('stock-search');
    if (searchInput) {
      searchInput.value = searchQuery;
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        this.renderTableContent();
      });
    }

    // İlk hesaplama ve çizim
    this.calculateAndRenderAll();

    // Değişiklik aboneliği
    unsubscribe = store.subscribe(() => {
      this.calculateAndRenderAll();
    });
  },

  calculateAndRenderAll() {
    this.renderKpis();
    this.renderCategoryTabs();
    this.renderTableContent();
    this.renderProfitabilityTable();
    this.syncEditModal();
  },

  renderKpis() {
    const orders = store.state.orders || [];
    
    let totalCiro = 0;
    let totalMaliyet = 0;

    // Satılan ürünlerin adet analizini ve maliyetlerini hesapla
    orders.forEach(order => {
      totalCiro += (order.total || 0);
      (order.items || []).forEach(item => {
        const menuItem = store.state.menu.find(m => m.id === item.id);
        const cost = menuItem ? (menuItem.cost || 0) : 0;
        totalMaliyet += (item.quantity * cost);
      });
    });

    const netKar = totalCiro - totalMaliyet;
    const karMarji = totalCiro > 0 ? Math.round((netKar / totalCiro) * 100) : 0;

    // Kritik veya tükenen ürün sayısını bul
    let criticalCount = 0;
    let outOfStockCount = 0;
    store.state.menu.forEach(item => {
      if (item.trackStock) {
        if ((item.stock || 0) <= 0) {
          outOfStockCount++;
        } else if ((item.stock || 0) <= (item.criticalStock || 10)) {
          criticalCount++;
        }
      }
    });

    const kpiContainer = document.getElementById('stock-kpi-container');
    if (!kpiContainer) return;

    kpiContainer.innerHTML = `
      <div class="card flex align-center justify-between" style="padding: 20px;">
        <div>
          <div style="font-size:12px; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Toplam Ciro</div>
          <div style="font-size: 28px; font-weight:800; color:var(--text-dark); margin-top:5px;">${formatPrice(totalCiro)}</div>
          <div style="color:var(--text-muted); font-size:11px; margin-top:5px;">Siparişlerden üretilen brüt gelir</div>
        </div>
        <div style="background: rgba(46,125,50,0.1); color: #2e7d32; width: 48px; height: 48px; border-radius: 8px; display:flex; align-items:center; justify-content:center;">
          <span class="material-icons-round">payments</span>
        </div>
      </div>

      <div class="card flex align-center justify-between" style="padding: 20px;">
        <div>
          <div style="font-size:12px; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Toplam Hammadde Maliyeti</div>
          <div style="font-size: 28px; font-weight:800; color:#ef5350; margin-top:5px;">${formatPrice(totalMaliyet)}</div>
          <div style="color:var(--text-muted); font-size:11px; margin-top:5px;">Satılan ürünlerin toplam maliyeti</div>
        </div>
        <div style="background: rgba(239,83,80,0.1); color: #ef5350; width: 48px; height: 48px; border-radius: 8px; display:flex; align-items:center; justify-content:center;">
          <span class="material-icons-round">inventory_2</span>
        </div>
      </div>

      <div class="card flex align-center justify-between" style="padding: 20px;">
        <div>
          <div style="font-size:12px; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Net Kâr / Marj</div>
          <div style="font-size: 28px; font-weight:800; color:#2e7d32; margin-top:5px;">${formatPrice(netKar)} <span style="font-size:16px; font-weight:600; color:var(--text-muted);">(${karMarji}%)</span></div>
          <div style="color:var(--text-muted); font-size:11px; margin-top:5px;">Ciro - Maliyet net kazancı</div>
        </div>
        <div style="background: rgba(46,125,50,0.1); color: #2e7d32; width: 48px; height: 48px; border-radius: 8px; display:flex; align-items:center; justify-content:center;">
          <span class="material-icons-round">trending_up</span>
        </div>
      </div>

      <div class="card flex align-center justify-between" style="padding: 20px;">
        <div>
          <div style="font-size:12px; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Stok Alarmları</div>
          <div style="font-size: 28px; font-weight:800; color:${outOfStockCount > 0 ? '#c62828' : criticalCount > 0 ? '#ef6c00' : 'var(--text-dark)'}; margin-top:5px;">
            ${outOfStockCount} <span style="font-size:16px; font-weight:600; color:var(--text-muted);">Tükendi</span> / ${criticalCount} <span style="font-size:16px; font-weight:600; color:var(--text-muted);">Kritik</span>
          </div>
          <div style="color:var(--text-muted); font-size:11px; margin-top:5px;">Eşiğin altındaki stok takip nesneleri</div>
        </div>
        <div style="background: rgba(239,108,0,0.1); color: #ef6c00; width: 48px; height: 48px; border-radius: 8px; display:flex; align-items:center; justify-content:center;">
          <span class="material-icons-round">warning_amber</span>
        </div>
      </div>
    `;
  },

  renderCategoryTabs() {
    const tabsContainer = document.getElementById('stock-category-tabs');
    if (!tabsContainer) return;

    const categories = [
      { id: 'all', name: 'Tümü' },
      ...store.categories
    ];

    tabsContainer.innerHTML = categories.map(cat => {
      const isActive = cat.id === activeCategory;
      return `
        <button class="filter-btn ${isActive ? 'active' : ''}" data-cat-id="${cat.id}">
          ${cat.name}
        </button>
      `;
    }).join('');

    // Tab tıklama olaylarını bağla
    tabsContainer.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        activeCategory = btn.getAttribute('data-cat-id');
        this.renderCategoryTabs();
        this.renderTableContent();
      });
    });
  },

  renderTableContent() {
    const tbody = document.getElementById('stock-table-body');
    if (!tbody) return;

    let items = [...store.state.menu];

    // Kategori filtresi uygula
    if (activeCategory !== 'all') {
      items = items.filter(i => i.category === activeCategory);
    }

    // Arama kelimesi filtresi uygula
    if (searchQuery) {
      items = items.filter(i => i.name.toLowerCase().includes(searchQuery));
    }

    if (items.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center" style="padding: 30px; color: var(--text-muted);">
            Kriterlere uygun ürün bulunamadı.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = items.map(item => {
      const isTracked = item.trackStock !== false;
      const stock = item.stock || 0;
      const critical = item.criticalStock || 10;
      
      let badgeHtml = '';
      let progressFillClass = 'safe';
      let progressPercent = 0;

      if (!isTracked) {
        badgeHtml = `<span class="badge badge-info">Limitsiz</span>`;
        progressPercent = 100;
        progressFillClass = 'safe';
      } else {
        progressPercent = Math.min((stock / Math.max(critical * 3, 30)) * 100, 100);
        if (stock <= 0) {
          badgeHtml = `<span class="badge badge-danger">Tükendi</span>`;
          progressPercent = 0;
          progressFillClass = 'danger';
        } else if (stock <= critical) {
          badgeHtml = `<span class="badge badge-warning">Kritik</span>`;
          progressFillClass = 'warning';
        } else {
          badgeHtml = `<span class="badge badge-success">Yeterli</span>`;
          progressFillClass = 'safe';
        }
      }

      return `
        <tr>
          <td>
            <div class="flex align-center gap-3">
              <img src="${item.image}" style="width: 38px; height: 38px; border-radius: var(--radius-sm); object-fit: cover;" />
              <div class="cell-bold" style="color:var(--text-dark);">${item.name}</div>
            </div>
          </td>
          <td class="cell-muted">${categoryMap[item.category] || 'Diğer'}</td>
          <td class="cell-bold">${formatPrice(item.price)}</td>
          <td class="cell-bold" style="color: #ef5350;">${formatPrice(item.cost || 0)}</td>
          <td>
            <div class="flex flex-column">
              <span class="cell-bold">${isTracked ? stock + ' Adet' : '—'}</span>
              <div class="stock-progress-bar">
                <div class="stock-progress-fill ${progressFillClass}" style="width: ${progressPercent}%;"></div>
              </div>
            </div>
          </td>
          <td>${badgeHtml}</td>
          <td style="text-align: center;">
            <label class="toggle-switch" style="display:inline-block;">
              <input type="checkbox" class="toggle-track-stock" data-item-id="${item.id}" ${isTracked ? 'checked' : ''} />
              <span class="toggle-slider"></span>
            </label>
          </td>
          <td class="cell-actions">
            <button class="btn btn-icon btn-ghost edit-item-stock-btn" data-item-id="${item.id}" title="Düzenle">
              <span class="material-icons-round">edit</span>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    // Toggle takibi olaylarını dinle
    tbody.querySelectorAll('.toggle-track-stock').forEach(checkbox => {
      checkbox.addEventListener('change', async (e) => {
        const itemId = e.target.getAttribute('data-item-id');
        const trackStock = e.target.checked;
        const menuItem = store.state.menu.find(m => m.id === itemId);
        const critical = menuItem ? (menuItem.criticalStock || 10) : 10;
        await store.updateItemStockSettings(itemId, trackStock, critical);
      });
    });

    // Düzenle butonu olaylarını dinle
    tbody.querySelectorAll('.edit-item-stock-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedItemId = btn.getAttribute('data-item-id');
        this.syncEditModal();
      });
    });
  },

  renderProfitabilityTable() {
    const tbody = document.getElementById('profitability-table-body');
    if (!tbody) return;

    const orders = store.state.orders || [];
    
    // Satış adetlerini topla
    const sales = {};
    orders.forEach(order => {
      (order.items || []).forEach(item => {
        if (!sales[item.id]) {
          sales[item.id] = { name: item.name, quantity: 0, revenue: 0 };
        }
        sales[item.id].quantity += item.quantity;
        sales[item.id].revenue += item.quantity * item.price;
      });
    });

    // Menüdeki tüm ürünleri kâr oranlarına göre listele
    const profitData = store.state.menu.map(menuItem => {
      const sale = sales[menuItem.id] || { quantity: 0, revenue: 0 };
      const totalCost = sale.quantity * (menuItem.cost || 0);
      const netProfit = sale.revenue - totalCost;
      const margin = sale.revenue > 0 ? Math.round((netProfit / sale.revenue) * 100) : 0;

      return {
        id: menuItem.id,
        name: menuItem.name,
        quantity: sale.quantity,
        totalCost: totalCost,
        netProfit: netProfit,
        margin: margin
      };
    }).sort((a, b) => b.netProfit - a.netProfit); // Kâra göre sırala

    tbody.innerHTML = profitData.map(item => {
      return `
        <tr>
          <td class="cell-bold" style="color:var(--text-dark);">${item.name}</td>
          <td class="cell-bold" style="text-align: center;">${item.quantity}</td>
          <td class="cell-muted">${formatPrice(item.totalCost)}</td>
          <td class="cell-bold" style="color: ${item.netProfit >= 0 ? '#2e7d32' : '#c62828'};">
            ${formatPrice(item.netProfit)}
          </td>
          <td style="text-align: right;">
            <span class="badge ${item.margin >= 50 ? 'badge-success' : item.margin > 0 ? 'badge-info' : 'badge-warning'}">
              ${item.margin}%
            </span>
          </td>
        </tr>
      `;
    }).join('');
  },

  syncEditModal() {
    const modalEl = document.getElementById('stock-edit-modal');
    if (!modalEl) return;

    if (!selectedItemId) {
      modalEl.style.display = 'none';
      modalEl.innerHTML = '';
      return;
    }

    const item = store.state.menu.find(m => m.id === selectedItemId);
    if (!item) {
      selectedItemId = null;
      modalEl.style.display = 'none';
      return;
    }

    modalEl.style.display = 'flex';
    modalEl.innerHTML = `
      <div class="modal scale-in" style="max-width: 460px; padding: 25px;">
        <div class="modal-header flex justify-between align-center" style="margin-bottom: 20px;">
          <h3 style="font-weight: 700; color: var(--color-text);">Stok & Maliyet Düzenle</h3>
          <button class="btn btn-icon btn-ghost" id="modal-close-btn" style="color:var(--text-muted);">
            <span class="material-icons-round">close</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="flex align-center gap-4" style="margin-bottom: 20px; background: var(--color-bg); padding: 12px; border-radius: var(--radius-md);">
            <img src="${item.image}" style="width: 50px; height: 50px; border-radius: var(--radius-sm); object-fit: cover;" />
            <div>
              <h4 style="font-weight: 700; margin: 0; color: var(--text-dark);">${item.name}</h4>
              <span style="font-size: 12px; color: var(--text-muted);">${categoryMap[item.category] || 'Diğer'}</span>
            </div>
          </div>
          
          <form id="edit-stock-form">
            <div class="form-group" style="margin-bottom: 15px;">
              <label class="form-label" style="font-weight: 600; margin-bottom: 6px; display: block;">Mevcut Stok Miktarı</label>
              <input type="number" id="input-stock" class="form-input" value="${item.stock || 0}" min="0" required />
            </div>

            <div class="form-group" style="margin-bottom: 15px;">
              <label class="form-label" style="font-weight: 600; margin-bottom: 6px; display: block;">Kritik Stok Eşiği</label>
              <input type="number" id="input-critical" class="form-input" value="${item.criticalStock || 10}" min="0" required />
            </div>

            <div class="form-group" style="margin-bottom: 15px;">
              <label class="form-label" style="font-weight: 600; margin-bottom: 6px; display: block;">Birim Maliyet (₺)</label>
              <input type="number" step="0.01" id="input-cost" class="form-input" value="${item.cost || 0}" min="0" required />
            </div>

            <div class="form-group flex align-center justify-between" style="margin-top: 20px; margin-bottom: 25px;">
              <div>
                <label style="font-weight: 600; display: block; color: var(--text-dark);">Stok Takibini Etkinleştir</label>
                <span style="font-size: 11px; color: var(--text-muted);">Sipariş verildiğinde stok seviyesi otomatik eksilir.</span>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" id="input-track" ${item.trackStock !== false ? 'checked' : ''} />
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="modal-footer flex justify-end gap-3">
              <button type="button" class="btn btn-secondary" id="modal-cancel-btn">Vazgeç</button>
              <button type="submit" class="btn btn-primary">Değişiklikleri Kaydet</button>
            </div>
          </form>
        </div>
      </div>
    `;

    // Modal olaylarını bağla
    const closeBtn = document.getElementById('modal-close-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');
    const form = document.getElementById('edit-stock-form');

    const closeModal = () => {
      selectedItemId = null;
      this.syncEditModal();
    };

    if (closeBtn) closeBtn.onclick = closeModal;
    if (cancelBtn) cancelBtn.onclick = closeModal;

    if (form) {
      form.onsubmit = async (e) => {
        e.preventDefault();
        
        const newStock = parseInt(document.getElementById('input-stock').value, 10) || 0;
        const newCritical = parseInt(document.getElementById('input-critical').value, 10) || 0;
        const newCost = parseFloat(document.getElementById('input-cost').value) || 0;
        const trackStock = document.getElementById('input-track').checked;

        // Ayarları güncelle (optimistic update & firestore background sync)
        await store.updateStock(selectedItemId, newStock);
        await store.updateItemCost(selectedItemId, newCost);
        await store.updateItemStockSettings(selectedItemId, trackStock, newCritical);

        closeModal();
      };
    }
  },

  destroy() {
    if (unsubscribe) {
      unsubscribe();
    }
  }
};
