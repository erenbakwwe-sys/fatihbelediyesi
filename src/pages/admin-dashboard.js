import { store } from '../store.js';
import { formatPrice, formatDate, formatTime, animateNumber, showToast } from '../utils.js';

export function render() {
  const orders = store.orders || [];
  const tables = store.tables || [];
  const calls = store.calls || [];
  const financeStats = store.getFinanceStats ? store.getFinanceStats() : { daily: 0, weekly: 0, monthly: 0 };

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const dailyOrders = orders.filter(o => new Date(o.createdAt) >= todayStart);
  const dailyRevenue = dailyOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const activeTables = tables.filter(t => t.active).length;
  const pendingCalls = calls.filter(c => !c.completed).length;
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);

  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const preparingOrders = orders.filter(o => o.status === 'preparing').length;

  return `
    <div class="admin-page admin-dashboard">
      <div class="page-header">
        <div class="page-header-content">
          <h1><span class="material-icons-round">dashboard</span> Fatih Akıllı Sofra Yönetim Paneli</h1>
          <p class="page-subtitle">Hoş geldiniz! İşte günlük özetiniz.</p>
        </div>
        <div class="page-header-actions">
          <span class="header-date">
            <span class="material-icons-round">calendar_today</span>
            ${new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      <div class="metrics-grid">
        <div class="metric-card" data-metric="orders">
          <div class="metric-icon" style="background: linear-gradient(135deg, #C8102E, #e8384f);">
            <span class="material-icons-round">receipt_long</span>
          </div>
          <div class="metric-content">
            <div class="metric-value" data-target="${dailyOrders.length}" data-key="daily-orders">0</div>
            <div class="metric-label">Günlük Sipariş</div>
            <div class="metric-trend trend-up">
              <span class="material-icons-round">trending_up</span>
              <span>${pendingOrders} bekliyor</span>
            </div>
          </div>
        </div>

        <div class="metric-card" data-metric="revenue">
          <div class="metric-icon" style="background: linear-gradient(135deg, #2e7d32, #43a047);">
            <span class="material-icons-round">payments</span>
          </div>
          <div class="metric-content">
            <div class="metric-value" data-target="${dailyRevenue}" data-key="daily-revenue" data-format="price">0 ₺</div>
            <div class="metric-label">Toplam Ciro</div>
            <div class="metric-trend trend-up">
              <span class="material-icons-round">trending_up</span>
              <span>Günlük</span>
            </div>
          </div>
        </div>

        <div class="metric-card" data-metric="tables">
          <div class="metric-icon" style="background: linear-gradient(135deg, #1565c0, #1e88e5);">
            <span class="material-icons-round">table_restaurant</span>
          </div>
          <div class="metric-content">
            <div class="metric-value" data-target="${activeTables}" data-key="active-tables">0</div>
            <div class="metric-label">Aktif Masa</div>
            <div class="metric-trend">
              <span class="material-icons-round">info_outline</span>
              <span>${tables.length} toplam</span>
            </div>
          </div>
        </div>

        <div class="metric-card" data-metric="calls">
          <div class="metric-icon ${pendingCalls > 0 ? 'pulse-animation' : ''}" style="background: linear-gradient(135deg, #e65100, #fb8c00);">
            <span class="material-icons-round">notifications_active</span>
          </div>
          <div class="metric-content">
            <div class="metric-value" data-target="${pendingCalls}" data-key="pending-calls">0</div>
            <div class="metric-label">Bekleyen Çağrı</div>
            <div class="metric-trend ${pendingCalls > 0 ? 'trend-warning' : 'trend-up'}">
              <span class="material-icons-round">${pendingCalls > 0 ? 'warning' : 'check_circle'}</span>
              <span>${pendingCalls > 0 ? 'Dikkat!' : 'Çağrı yok'}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="card dashboard-main">
          <div class="card-header">
            <h2><span class="material-icons-round">list_alt</span> Son Siparişler</h2>
            <a href="#" class="btn btn-sm btn-outline" data-navigate="/admin/orders">Tümünü Gör</a>
          </div>
          <div class="card-body">
            ${recentOrders.length === 0 ? `
              <div class="empty-state">
                <span class="material-icons-round">receipt</span>
                <p>Henüz sipariş bulunmuyor</p>
              </div>
            ` : `
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Sipariş No</th>
                    <th>Masa</th>
                    <th>Ürünler</th>
                    <th>Tutar</th>
                    <th>Saat</th>
                    <th>Durum</th>
                  </tr>
                </thead>
                <tbody>
                  ${recentOrders.map(order => `
                    <tr>
                      <td><strong>#${order.id ? order.id.slice(-6).toUpperCase() : '---'}</strong></td>
                      <td>
                        <span class="table-badge">
                          <span class="material-icons-round">table_restaurant</span>
                          Masa ${order.tableNo}
                        </span>
                      </td>
                      <td class="items-cell">${(order.items || []).map(i => i.name || i).join(', ').substring(0, 40)}${(order.items || []).map(i => i.name || i).join(', ').length > 40 ? '...' : ''}</td>
                      <td><strong>${formatPrice ? formatPrice(order.total) : order.total + ' ₺'}</strong></td>
                      <td>${formatTime ? formatTime(order.createdAt) : new Date(order.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</td>
                      <td>
                        <span class="status-badge ${order.status}">
                          ${order.status === 'pending' ? 'Bekliyor' : order.status === 'preparing' ? 'Hazırlanıyor' : 'Teslim Edildi'}
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            `}
          </div>
        </div>

        <div class="card dashboard-sidebar">
          <div class="card-header">
            <h2><span class="material-icons-round">insights</span> Hızlı İstatistikler</h2>
          </div>
          <div class="card-body">
            <div class="quick-stats">
              <div class="quick-stat-item">
                <div class="quick-stat-icon pending">
                  <span class="material-icons-round">hourglass_top</span>
                </div>
                <div class="quick-stat-info">
                  <span class="quick-stat-value">${pendingOrders}</span>
                  <span class="quick-stat-label">Bekleyen Sipariş</span>
                </div>
              </div>
              <div class="quick-stat-item">
                <div class="quick-stat-icon preparing">
                  <span class="material-icons-round">restaurant</span>
                </div>
                <div class="quick-stat-info">
                  <span class="quick-stat-value">${preparingOrders}</span>
                  <span class="quick-stat-label">Hazırlanan Sipariş</span>
                </div>
              </div>
              <div class="quick-stat-item">
                <div class="quick-stat-icon delivered">
                  <span class="material-icons-round">check_circle</span>
                </div>
                <div class="quick-stat-info">
                  <span class="quick-stat-value">${orders.filter(o => o.status === 'delivered').length}</span>
                  <span class="quick-stat-label">Tamamlanan Sipariş</span>
                </div>
              </div>
              <div class="quick-stat-item">
                <div class="quick-stat-icon revenue">
                  <span class="material-icons-round">account_balance_wallet</span>
                </div>
                <div class="quick-stat-info">
                  <span class="quick-stat-value">${formatPrice ? formatPrice(financeStats.weekly || 0) : (financeStats.weekly || 0) + ' ₺'}</span>
                  <span class="quick-stat-label">Haftalık Ciro</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <style>
      .admin-dashboard .page-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 2rem;
        flex-wrap: wrap;
        gap: 1rem;
      }
      .admin-dashboard .page-header h1 {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.75rem;
        color: #1A1A2E;
        margin: 0;
      }
      .admin-dashboard .page-subtitle {
        color: #666;
        margin: 0.25rem 0 0 2.5rem;
        font-size: 0.95rem;
      }
      .admin-dashboard .header-date {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #666;
        font-size: 0.9rem;
        background: #f5f5f5;
        padding: 0.5rem 1rem;
        border-radius: 8px;
      }
      .admin-dashboard .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }
      .admin-dashboard .metric-card {
        background: #fff;
        border-radius: 16px;
        padding: 1.5rem;
        display: flex;
        align-items: center;
        gap: 1.25rem;
        box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        transition: transform 0.2s, box-shadow 0.2s;
        cursor: default;
      }
      .admin-dashboard .metric-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      }
      .admin-dashboard .metric-icon {
        width: 56px;
        height: 56px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .admin-dashboard .metric-icon .material-icons-round {
        font-size: 28px;
        color: #fff;
      }
      .admin-dashboard .metric-value {
        font-size: 2rem;
        font-weight: 700;
        color: #1A1A2E;
        line-height: 1.1;
      }
      .admin-dashboard .metric-label {
        font-size: 0.875rem;
        color: #888;
        margin-top: 2px;
      }
      .admin-dashboard .metric-trend {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.8rem;
        margin-top: 0.5rem;
        color: #888;
      }
      .admin-dashboard .metric-trend .material-icons-round {
        font-size: 16px;
      }
      .admin-dashboard .metric-trend.trend-up {
        color: #2e7d32;
      }
      .admin-dashboard .metric-trend.trend-warning {
        color: #e65100;
      }
      .admin-dashboard .pulse-animation {
        animation: pulse-glow 1.5s infinite;
      }
      @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 0 0 rgba(230, 81, 0, 0.4); }
        50% { box-shadow: 0 0 0 12px rgba(230, 81, 0, 0); }
      }
      .admin-dashboard .dashboard-grid {
        display: grid;
        grid-template-columns: 1fr 360px;
        gap: 1.5rem;
      }
      @media (max-width: 1024px) {
        .admin-dashboard .dashboard-grid {
          grid-template-columns: 1fr;
        }
      }
      .admin-dashboard .card {
        background: #fff;
        border-radius: 16px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        overflow: hidden;
      }
      .admin-dashboard .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.25rem 1.5rem;
        border-bottom: 1px solid #f0f0f0;
      }
      .admin-dashboard .card-header h2 {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.1rem;
        margin: 0;
        color: #1A1A2E;
      }
      .admin-dashboard .card-body {
        padding: 1.5rem;
      }
      .admin-dashboard .data-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.9rem;
      }
      .admin-dashboard .data-table th {
        text-align: left;
        padding: 0.75rem;
        color: #888;
        font-weight: 600;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border-bottom: 2px solid #f0f0f0;
      }
      .admin-dashboard .data-table td {
        padding: 0.75rem;
        border-bottom: 1px solid #f5f5f5;
        color: #333;
      }
      .admin-dashboard .data-table tr:hover td {
        background: #fafafa;
      }
      .admin-dashboard .table-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        background: #e3f2fd;
        color: #1565c0;
        padding: 0.25rem 0.5rem;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 600;
      }
      .admin-dashboard .table-badge .material-icons-round {
        font-size: 14px;
      }
      .admin-dashboard .items-cell {
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #666;
        font-size: 0.85rem;
      }
      .admin-dashboard .status-badge {
        display: inline-block;
        padding: 0.3rem 0.75rem;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: capitalize;
      }
      .admin-dashboard .status-badge.pending {
        background: #fff3e0;
        color: #e65100;
      }
      .admin-dashboard .status-badge.preparing {
        background: #e3f2fd;
        color: #1565c0;
      }
      .admin-dashboard .status-badge.delivered {
        background: #e8f5e9;
        color: #2e7d32;
      }
      .admin-dashboard .empty-state {
        text-align: center;
        padding: 3rem;
        color: #aaa;
      }
      .admin-dashboard .empty-state .material-icons-round {
        font-size: 48px;
        margin-bottom: 0.5rem;
      }
      .admin-dashboard .quick-stats {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .admin-dashboard .quick-stat-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.75rem;
        background: #f9f9f9;
        border-radius: 12px;
        transition: background 0.2s;
      }
      .admin-dashboard .quick-stat-item:hover {
        background: #f0f0f0;
      }
      .admin-dashboard .quick-stat-icon {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .admin-dashboard .quick-stat-icon .material-icons-round {
        font-size: 20px;
        color: #fff;
      }
      .admin-dashboard .quick-stat-icon.pending { background: #ff9800; }
      .admin-dashboard .quick-stat-icon.preparing { background: #2196f3; }
      .admin-dashboard .quick-stat-icon.delivered { background: #4caf50; }
      .admin-dashboard .quick-stat-icon.revenue { background: #9c27b0; }
      .admin-dashboard .quick-stat-info {
        display: flex;
        flex-direction: column;
      }
      .admin-dashboard .quick-stat-value {
        font-size: 1.25rem;
        font-weight: 700;
        color: #1A1A2E;
      }
      .admin-dashboard .quick-stat-label {
        font-size: 0.8rem;
        color: #888;
      }
    </style>
  `;
}

export function init() {
  // Animate metric numbers
  const metricValues = document.querySelectorAll('.admin-dashboard .metric-value[data-target]');
  metricValues.forEach(el => {
    const target = parseFloat(el.dataset.target) || 0;
    const format = el.dataset.format;
    if (typeof animateNumber === 'function') {
      animateNumber(el, 0, target, 1200, format === 'price' ? (val) => formatPrice(val) : null);
    } else {
      // Fallback animation
      const duration = 1200;
      const startTime = performance.now();
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        el.textContent = format === 'price' ? current.toLocaleString('tr-TR') + ' ₺' : current;
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  });

  // Navigate link
  const navLink = document.querySelector('[data-navigate]');
  if (navLink) {
    navLink.addEventListener('click', (e) => {
      e.preventDefault();
      const path = navLink.dataset.navigate;
      if (window.router && window.router.navigate) {
        window.router.navigate(path);
      } else {
        window.location.hash = path;
      }
    });
  }

  // Subscribe to store changes for live updates
  if (store.subscribe) {
    const unsubscribe = store.subscribe(() => {
      // Re-render on store changes if still on dashboard
      const dashboardEl = document.querySelector('.admin-dashboard');
      if (!dashboardEl) {
        if (typeof unsubscribe === 'function') unsubscribe();
      }
    });
  }
}
