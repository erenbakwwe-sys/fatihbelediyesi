import { store } from '../store.js';
import { formatPrice, formatTime, showToast } from '../utils.js';

let currentFilter = 'all';

function getFilteredOrders() {
  const orders = store.orders || [];
  if (currentFilter === 'all') return orders;
  return orders.filter(o => o.status === currentFilter);
}

function getStatusText(status) {
  const map = { pending: 'Bekliyor', preparing: 'Hazırlanıyor', delivered: 'Teslim Edildi' };
  return map[status] || status;
}

function getPaymentText(method) {
  const map = { nfc: 'NFC', card: 'Kredi Kartı', cash: 'Nakit', credit_card: 'Kredi Kartı' };
  return map[method] || method || 'Belirtilmemiş';
}

function getPaymentIcon(method) {
  const map = { nfc: 'contactless', card: 'credit_card', cash: 'payments', credit_card: 'credit_card' };
  return map[method] || 'payment';
}

function renderOrderItems(items) {
  if (!items || items.length === 0) return '<span class="no-items">-</span>';
  return items.map(item => {
    const name = item.name || item;
    const qty = item.quantity || 1;
    return `<span class="order-item-tag">${qty > 1 ? qty + 'x ' : ''}${name}</span>`;
  }).join('');
}

export function render() {
  const orders = store.orders || [];
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const preparingCount = orders.filter(o => o.status === 'preparing').length;
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;
  const filteredOrders = getFilteredOrders();
  const sortedOrders = [...filteredOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return `
    <div class="admin-page admin-orders">
      <div class="page-header">
        <h1><span class="material-icons-round">receipt_long</span> Sipariş Yönetimi</h1>
        <div class="order-summary-pills">
          <span class="summary-pill pending-pill">
            <span class="material-icons-round">hourglass_top</span>
            ${pendingCount} Bekliyor
          </span>
          <span class="summary-pill preparing-pill">
            <span class="material-icons-round">restaurant</span>
            ${preparingCount} Hazırlanıyor
          </span>
        </div>
      </div>

      <div class="filter-bar">
        <button class="filter-btn ${currentFilter === 'all' ? 'active' : ''}" data-filter="all">
          Tümü <span class="filter-count">${orders.length}</span>
        </button>
        <button class="filter-btn ${currentFilter === 'pending' ? 'active' : ''}" data-filter="pending">
          Bekliyor <span class="filter-count warning">${pendingCount}</span>
        </button>
        <button class="filter-btn ${currentFilter === 'preparing' ? 'active' : ''}" data-filter="preparing">
          Hazırlanıyor <span class="filter-count info">${preparingCount}</span>
        </button>
        <button class="filter-btn ${currentFilter === 'delivered' ? 'active' : ''}" data-filter="delivered">
          Teslim Edildi <span class="filter-count success">${deliveredCount}</span>
        </button>
      </div>

      <div class="orders-container">
        ${sortedOrders.length === 0 ? `
          <div class="empty-state">
            <span class="material-icons-round">receipt</span>
            <h3>Sipariş bulunamadı</h3>
            <p>${currentFilter !== 'all' ? '"' + getStatusText(currentFilter) + '" durumunda sipariş yok.' : 'Henüz sipariş girilmemiş.'}</p>
          </div>
        ` : `
          <div class="orders-list">
            ${sortedOrders.map(order => `
              <div class="order-card ${order.status}" data-order-id="${order.id}">
                <div class="order-card-header">
                  <div class="order-id-info">
                    <span class="order-id">#${order.id ? order.id.slice(-6).toUpperCase() : '---'}</span>
                    <span class="status-badge ${order.status}">${getStatusText(order.status)}</span>
                  </div>
                  <div class="order-time">
                    <span class="material-icons-round">schedule</span>
                    ${formatTime ? formatTime(order.createdAt) : new Date(order.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div class="order-card-body">
                  <div class="order-table-info ${order.orderType === 'pickup' ? 'pickup' : ''}">
                    <span class="material-icons-round">${order.orderType === 'pickup' ? 'storefront' : 'table_restaurant'}</span>
                    <span>${order.orderType === 'pickup' ? `Gel-Al (Tesis)` : `Masa ${order.tableNo}`}</span>
                  </div>

                  <div class="order-items-list">
                    ${renderOrderItems(order.items)}
                  </div>

                  <div class="order-card-footer">
                    <div class="order-payment">
                      <span class="material-icons-round">${getPaymentIcon(order.paymentMethod)}</span>
                      <span>${getPaymentText(order.paymentMethod)}</span>
                    </div>
                    <div class="order-total">
                      ${formatPrice ? formatPrice(order.total) : order.total + ' ₺'}
                    </div>
                  </div>
                </div>

                <div class="order-card-actions">
                  ${order.status === 'pending' ? `
                    <button class="btn btn-primary btn-action" data-action="preparing" data-order="${order.id}">
                      <span class="material-icons-round">restaurant</span>
                      Hazırlanıyor
                    </button>
                  ` : ''}
                  ${order.status === 'preparing' ? `
                    <button class="btn btn-primary btn-action btn-success-action" data-action="delivered" data-order="${order.id}">
                      <span class="material-icons-round">check_circle</span>
                      Teslim Edildi
                    </button>
                  ` : ''}
                  ${order.status === 'delivered' ? `
                    <span class="delivered-check">
                      <span class="material-icons-round">done_all</span> Tamamlandı
                    </span>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    </div>

    <style>
      .admin-orders .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
        gap: 1rem;
      }
      .admin-orders .page-header h1 {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.5rem;
        color: #1A1A2E;
        margin: 0;
      }
      .admin-orders .order-summary-pills {
        display: flex;
        gap: 0.75rem;
      }
      .admin-orders .summary-pill {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.4rem 0.85rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
      }
      .admin-orders .summary-pill .material-icons-round { font-size: 16px; }
      .admin-orders .pending-pill { background: #fff3e0; color: #e65100; }
      .admin-orders .preparing-pill { background: #e3f2fd; color: #1565c0; }

      .admin-orders .filter-bar {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
      }
      .admin-orders .filter-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.6rem 1.25rem;
        border: 2px solid #e0e0e0;
        background: #fff;
        border-radius: 10px;
        font-size: 0.9rem;
        font-weight: 500;
        color: #666;
        cursor: pointer;
        transition: all 0.2s;
      }
      .admin-orders .filter-btn:hover { border-color: #C8102E; color: #C8102E; }
      .admin-orders .filter-btn.active {
        background: #C8102E;
        border-color: #C8102E;
        color: #fff;
      }
      .admin-orders .filter-count {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 22px;
        height: 22px;
        border-radius: 11px;
        font-size: 0.75rem;
        font-weight: 700;
        background: #e0e0e0;
        color: #666;
        padding: 0 0.35rem;
      }
      .admin-orders .filter-btn.active .filter-count {
        background: rgba(255,255,255,0.3);
        color: #fff;
      }
      .admin-orders .filter-count.warning { background: #ff9800; color: #fff; }
      .admin-orders .filter-count.info { background: #2196f3; color: #fff; }
      .admin-orders .filter-count.success { background: #4caf50; color: #fff; }

      .admin-orders .orders-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
        gap: 1rem;
      }

      .admin-orders .order-card {
        background: #fff;
        border-radius: 14px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.06);
        overflow: hidden;
        border-left: 4px solid #e0e0e0;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      .admin-orders .order-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0,0,0,0.1);
      }
      .admin-orders .order-card.pending { border-left-color: #ff9800; }
      .admin-orders .order-card.preparing { border-left-color: #2196f3; }
      .admin-orders .order-card.delivered { border-left-color: #4caf50; }

      .admin-orders .order-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.25rem;
        border-bottom: 1px solid #f0f0f0;
      }
      .admin-orders .order-id-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .admin-orders .order-id {
        font-weight: 700;
        font-size: 0.95rem;
        color: #1A1A2E;
      }
      .admin-orders .order-time {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        color: #999;
        font-size: 0.85rem;
      }
      .admin-orders .order-time .material-icons-round { font-size: 16px; }

      .admin-orders .order-card-body { padding: 1rem 1.25rem; }
      .admin-orders .order-table-info {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        font-weight: 600;
        color: #1565c0;
        margin-bottom: 0.75rem;
        font-size: 0.9rem;
      }
      .admin-orders .order-table-info .material-icons-round { font-size: 18px; }

      .admin-orders .order-items-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem;
        margin-bottom: 1rem;
      }
      .admin-orders .order-item-tag {
        background: #f5f5f5;
        color: #555;
        padding: 0.25rem 0.6rem;
        border-radius: 6px;
        font-size: 0.8rem;
      }
      .admin-orders .no-items { color: #ccc; }

      .admin-orders .order-card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 0.75rem;
        border-top: 1px solid #f5f5f5;
      }
      .admin-orders .order-payment {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        color: #888;
        font-size: 0.85rem;
      }
      .admin-orders .order-payment .material-icons-round { font-size: 18px; }
      .admin-orders .order-total {
        font-size: 1.2rem;
        font-weight: 700;
        color: #1A1A2E;
      }

      .admin-orders .order-card-actions {
        padding: 0.75rem 1.25rem;
        background: #fafafa;
        display: flex;
        justify-content: flex-end;
      }
      .admin-orders .btn-action {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.5rem 1.25rem;
        border-radius: 8px;
        font-size: 0.85rem;
        font-weight: 600;
        border: none;
        cursor: pointer;
        transition: all 0.2s;
        background: #1565c0;
        color: #fff;
      }
      .admin-orders .btn-action:hover { opacity: 0.9; transform: scale(1.02); }
      .admin-orders .btn-action .material-icons-round { font-size: 18px; }
      .admin-orders .btn-success-action { background: #2e7d32; }
      .admin-orders .delivered-check {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        color: #4caf50;
        font-size: 0.85rem;
        font-weight: 600;
      }
      .admin-orders .delivered-check .material-icons-round { font-size: 18px; }

      .admin-orders .status-badge {
        padding: 0.2rem 0.6rem;
        border-radius: 20px;
        font-size: 0.7rem;
        font-weight: 600;
      }
      .admin-orders .status-badge.pending { background: #fff3e0; color: #e65100; }
      .admin-orders .status-badge.preparing { background: #e3f2fd; color: #1565c0; }
      .admin-orders .status-badge.delivered { background: #e8f5e9; color: #2e7d32; }

      .admin-orders .empty-state {
        text-align: center;
        padding: 4rem 2rem;
        color: #aaa;
      }
      .admin-orders .empty-state .material-icons-round {
        font-size: 56px;
        margin-bottom: 1rem;
        color: #ddd;
      }
      .admin-orders .empty-state h3 {
        margin: 0 0 0.5rem;
        color: #888;
        font-size: 1.1rem;
      }
      .admin-orders .empty-state p { margin: 0; font-size: 0.9rem; }
    </style>
  `;
}

export function init() {
  // Filter buttons
  document.querySelectorAll('.admin-orders .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentFilter = btn.dataset.filter;
      const container = document.querySelector('.admin-orders');
      if (container) {
        container.outerHTML = render();
        init();
      }
    });
  });

  // Status change buttons
  document.querySelectorAll('.admin-orders .btn-action').forEach(btn => {
    btn.addEventListener('click', () => {
      const orderId = btn.dataset.order;
      const newStatus = btn.dataset.action;
      if (store.updateOrderStatus) {
        store.updateOrderStatus(orderId, newStatus);
        const statusText = newStatus === 'preparing' ? 'Hazırlanıyor' : 'Teslim Edildi';
        if (typeof showToast === 'function') {
          showToast(`Sipariş durumu "${statusText}" olarak güncellendi`, 'success');
        }
        // Re-render
        const container = document.querySelector('.admin-orders');
        if (container) {
          container.outerHTML = render();
          init();
        }
      }
    });
  });

  // Subscribe to store for live updates
  if (store.subscribe) {
    const unsubscribe = store.subscribe(() => {
      const container = document.querySelector('.admin-orders');
      if (!container) {
        if (typeof unsubscribe === 'function') unsubscribe();
        return;
      }
    });
  }
}
