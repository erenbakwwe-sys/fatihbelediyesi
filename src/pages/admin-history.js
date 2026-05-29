/* ============================================================
   FATIH AKILLI SOFRA — Sipariş Arşivi ve Geçmişi Sayfası
   Search, sort, filter and analyze completed or cancelled transactions
   ============================================================ */

import store from '../store.js';
import { formatPrice, formatDate, formatTime } from '../utils.js';

export default {
  render() {
    return `
      <div class="admin-page admin-history">
        <div class="page-header" style="margin-bottom: 2rem;">
          <h1><span class="material-icons-round">history</span> Sipariş Arşivi & Geçmişi</h1>
          <p class="page-subtitle" style="color:var(--text-muted); margin-top:5px;">Sistem genelindeki tamamlanmış siparişlerin sorgulanması ve filtrelenmesi.</p>
        </div>

        <!-- Filter Panel -->
        <div class="filter-bar flex align-center gap-15 wrap" style="padding: 20px; background:#fff; border-radius:12px; border:1px solid var(--border-color); margin-bottom: 30px;">
          <div class="filter-group flex align-center gap-10">
            <span class="material-icons-round text-muted" style="font-size:18px;">calendar_today</span>
            <input type="date" id="filter-start-date" class="form-input" style="padding: 6px 12px;" />
            <span style="color:var(--text-muted);">ve</span>
            <input type="date" id="filter-end-date" class="form-input" style="padding: 6px 12px;" />
          </div>
          
          <div class="filter-divider" style="height: 30px; width: 1px; background: var(--border-color);"></div>

          <div class="filter-group flex align-center gap-10">
            <span class="material-icons-round text-muted" style="font-size:18px;">table_restaurant</span>
            <select id="filter-table" class="form-select" style="padding: 6px 12px; min-width: 120px;">
              <option value="all">Tüm Masalar</option>
              ${Array.from({ length: 12 }, (_, i) => `<option value="${i + 1}">Masa ${i + 1}</option>`).join('')}
            </select>
          </div>

          <button class="btn btn-outline btn-sm" id="btn-reset-filters" style="margin-left: auto;">
            <span class="material-icons-round" style="font-size:14px; margin-right:4px;">restart_alt</span>
            <span>Filtreleri Temizle</span>
          </button>
        </div>

        <!-- Summary Metrics -->
        <div class="metrics-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 30px;">
          <div class="card flex align-center gap-15" style="padding: 20px;">
            <div style="background: rgba(200,16,46,0.1); color: var(--primary-color); width: 44px; height: 44px; border-radius: 8px; display:flex; align-items:center; justify-content:center;">
              <span class="material-icons-round">task_alt</span>
            </div>
            <div>
              <div id="summary-total-count" style="font-size: 24px; font-weight:800; color:var(--text-dark);">0</div>
              <div style="font-size:12px; color:var(--text-muted); font-weight:600;">Filtrelenen Sipariş</div>
            </div>
          </div>

          <div class="card flex align-center gap-15" style="padding: 20px;">
            <div style="background: rgba(46,125,50,0.1); color: #2e7d32; width: 44px; height: 44px; border-radius: 8px; display:flex; align-items:center; justify-content:center;">
              <span class="material-icons-round">monetization_on</span>
            </div>
            <div>
              <div id="summary-total-revenue" style="font-size: 24px; font-weight:800; color:#2e7d32;">0 ₺</div>
              <div style="font-size:12px; color:var(--text-muted); font-weight:600;">Toplam Ciro Tutarı</div>
            </div>
          </div>
        </div>

        <!-- History Table -->
        <div class="card table-wrapper">
          <div class="table-scroll">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Sipariş Kodu</th>
                  <th>Masa No</th>
                  <th>Ürün Detayları</th>
                  <th>Ödeme Şekli</th>
                  <th>Tarih & Saat</th>
                  <th>Durum</th>
                  <th>Tutar</th>
                </tr>
              </thead>
              <tbody id="history-table-body">
                <tr>
                  <td colspan="7" class="text-center" style="padding:40px; color:var(--text-muted);">Filtrelenmiş sipariş kaydı aranıyor...</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  init() {
    this.startDate = '';
    this.endDate = '';
    this.tableNo = 'all';

    // 1. Initial Render
    this.filterAndRender();

    // 2. Setup Listeners
    const startInput = document.getElementById('filter-start-date');
    const endInput = document.getElementById('filter-end-date');
    const tableSelect = document.getElementById('filter-table');
    const resetBtn = document.getElementById('btn-reset-filters');

    if (startInput) {
      startInput.addEventListener('change', (e) => {
        this.startDate = e.target.value;
        this.filterAndRender();
      });
    }

    if (endInput) {
      endInput.addEventListener('change', (e) => {
        this.endDate = e.target.value;
        this.filterAndRender();
      });
    }

    if (tableSelect) {
      tableSelect.addEventListener('change', (e) => {
        this.tableNo = e.target.value;
        this.filterAndRender();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (startInput) startInput.value = '';
        if (endInput) endInput.value = '';
        if (tableSelect) tableSelect.value = 'all';
        
        this.startDate = '';
        this.endDate = '';
        this.tableNo = 'all';
        this.filterAndRender();
      });
    }

    // 3. Sync live changes from store
    this.unsubscribe = store.subscribe(() => {
      this.filterAndRender();
    });
  },

  filterAndRender() {
    let filtered = [...store.state.orders];

    // Filter by table
    if (this.tableNo !== 'all') {
      filtered = filtered.filter(o => o.tableNo === parseInt(this.tableNo, 10));
    }

    // Filter by start date
    if (this.startDate) {
      const startLimit = new Date(this.startDate);
      startLimit.setHours(0, 0, 0, 0);
      filtered = filtered.filter(o => new Date(o.createdAt) >= startLimit);
    }

    // Filter by end date
    if (this.endDate) {
      const endLimit = new Date(this.endDate);
      endLimit.setHours(23, 59, 59, 999);
      filtered = filtered.filter(o => new Date(o.createdAt) <= endLimit);
    }

    // Update Summary KPIs
    const totalCount = filtered.length;
    const totalRevenue = filtered.reduce((sum, o) => sum + (o.total || 0), 0);

    const countEl = document.getElementById('summary-total-count');
    const revEl = document.getElementById('summary-total-revenue');

    if (countEl) countEl.textContent = totalCount;
    if (revEl) revEl.textContent = formatPrice(totalRevenue);

    // Update Table body
    const tbody = document.getElementById('history-table-body');
    if (tbody) {
      if (filtered.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" class="text-center" style="padding: 40px; color:var(--text-muted);">
              Filtrelere uygun sipariş geçmişi bulunamadı.
            </td>
          </tr>
        `;
      } else {
        tbody.innerHTML = filtered.map(order => this.renderHistoryRow(order)).join('');
      }
    }
  },

  renderHistoryRow(order) {
    const itemsList = order.items.map(i => `${i.quantity}x ${i.name}`).join(', ');
    const paymentMap = { nfc: 'NFC Ödeme', card: 'Banka Kartı', cash: 'Nakit (Masada)' };
    const statusMap = { pending: 'Bekliyor', preparing: 'Hazırlanıyor', delivered: 'Teslim Edildi' };

    return `
      <tr>
        <td class="cell-bold">#${order.id}</td>
        <td>
          <span class="table-badge">
            <span class="material-icons-round" style="font-size:14px; margin-right:2px;">table_restaurant</span>
            Masa ${order.tableNo}
          </span>
        </td>
        <td style="max-width:250px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${itemsList}">
          ${itemsList}
        </td>
        <td class="cell-muted">${paymentMap[order.paymentMethod] || order.paymentMethod.toUpperCase()}</td>
        <td>${formatDate(order.createdAt)} ${formatTime(order.createdAt)}</td>
        <td>
          <span class="status-badge ${order.status}">
            ${statusMap[order.status] || order.status}
          </span>
        </td>
        <td class="cell-bold" style="color:var(--text-dark);">${formatPrice(order.total)}</td>
      </tr>
    `;
  },

  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
};
