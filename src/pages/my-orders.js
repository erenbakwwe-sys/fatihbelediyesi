/* ============================================================
   FATIH AKILLI SOFRA — Siparişlerim (Order Tracking) Page
   Real-time status tracking with active progress timelines
   ============================================================ */

import store from '../store.js';
import { formatPrice, formatDateTime } from '../utils.js';

export default {
  render() {
    return `
      <section class="orders-tracking-section container reveal">
        <div class="orders-header text-center">
          <h2 class="section-title">Sipariş Takibi</h2>
          <p class="section-subtitle">Masa ${store.state.currentTable || 'Belirtilmedi'} için verilen tüm siparişlerin güncel durumları.</p>
        </div>

        <div class="orders-workspace">
          <!-- Real-time Active Orders -->
          <div id="active-orders-container" class="active-orders-grid">
            <div class="text-center" style="padding: 40px;">Siparişler yükleniyor...</div>
          </div>

          <!-- Collapsible Past Orders -->
          <div class="past-orders-section card" style="margin-top: 40px;">
            <div class="card-header flex justify-between align-center" id="btn-toggle-past-orders" style="cursor: pointer; padding: 20px;">
              <div class="flex align-center gap-10">
                <span class="material-icons-round text-muted">history</span>
                <h3 style="font-weight:700; color:var(--text-dark); margin:0;">Geçmiş Siparişlerim</h3>
              </div>
              <span class="material-icons-round text-muted" id="past-toggle-icon">expand_more</span>
            </div>
            
            <div class="card-body" id="past-orders-body" style="display: none; border-top: 1px solid var(--border-color); padding: 20px;">
              <div id="past-orders-list" class="past-orders-list-wrap">
                <div class="text-center text-muted">Geçmiş sipariş bulunmamaktadır.</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  init() {
    this.showPastOrders = false;
    
    // Subscribe to state change
    this.unsubscribe = store.subscribe((state) => {
      this.updateOrders(state);
    });

    // Toggle past orders collapsible
    const toggleHeader = document.getElementById('btn-toggle-past-orders');
    if (toggleHeader) {
      toggleHeader.addEventListener('click', () => {
        this.showPastOrders = !this.showPastOrders;
        const body = document.getElementById('past-orders-body');
        const icon = document.getElementById('past-toggle-icon');
        if (body && icon) {
          if (this.showPastOrders) {
            body.style.display = 'block';
            icon.textContent = 'expand_less';
          } else {
            body.style.display = 'none';
            icon.textContent = 'expand_more';
          }
        }
      });
    }
  },

  updateOrders(state) {
    const tableNo = state.currentTable;
    
    // Filter orders for the current table session
    const currentTableOrders = state.orders.filter(o => o.tableNo === tableNo);
    
    const activeOrders = currentTableOrders.filter(o => o.status !== 'delivered');
    const pastOrders = currentTableOrders.filter(o => o.status === 'delivered');

    // 1. Render Active Orders
    const activeContainer = document.getElementById('active-orders-container');
    if (activeContainer) {
      if (activeOrders.length === 0) {
        activeContainer.innerHTML = `
          <div class="card text-center" style="padding: 60px 20px;">
            <span class="material-icons-round text-muted" style="font-size: 64px; margin-bottom: 20px;">restaurant</span>
            <h3 style="font-weight: 700; color: var(--text-dark);">Aktif Siparişiniz Bulunmuyor</h3>
            <p style="color: var(--text-muted); margin: 15px 0 25px;">Masanız için şu anda hazırlanmakta olan aktif bir sipariş yoktur.</p>
            <a href="#/menu" class="btn btn-primary">
              <span class="material-icons-round">restaurant_menu</span>
              <span>Menüyü Gör ve Sipariş Ver</span>
            </a>
          </div>
        `;
      } else {
        activeContainer.innerHTML = activeOrders.map(order => this.renderActiveOrderCard(order)).join('');
      }
    }

    // 2. Render Past Orders
    const pastList = document.getElementById('past-orders-list');
    if (pastList) {
      if (pastOrders.length === 0) {
        pastList.innerHTML = `<div class="text-center text-muted" style="padding:20px;">Geçmiş sipariş kaydı bulunmuyor.</div>`;
      } else {
        pastList.innerHTML = pastOrders.map(order => this.renderPastOrderRow(order)).join('');
      }
    }
  },

  renderActiveOrderCard(order) {
    // Determine status steps for progress timeline
    const isPending = order.status === 'pending';
    const isPreparing = order.status === 'preparing';
    
    let pendingClass = 'completed';
    let preparingClass = isPending ? 'active' : 'completed';
    let deliveredClass = 'upcoming';

    if (isPending) {
      pendingClass = 'active';
      preparingClass = 'upcoming';
    } else if (isPreparing) {
      pendingClass = 'completed';
      preparingClass = 'active';
    }

    const itemsSummary = order.items.map(item => `
      <div class="order-summary-item flex justify-between" style="padding: 6px 0; border-bottom: 1px dashed var(--border-color); font-size:14px;">
        <span style="color:var(--text-dark); font-weight:500;">${item.quantity}x ${item.name}</span>
        <span style="color:var(--text-muted);">${formatPrice(item.price * item.quantity)}</span>
      </div>
    `).join('');

    return `
      <div class="active-order-card card scale-in" style="margin-bottom: 25px; overflow: hidden; border-left: 5px solid var(--primary-color);">
        <div class="card-header flex justify-between align-center" style="background: rgba(200, 16, 46, 0.03); padding: 15px 20px;">
          <div>
            <div class="order-id" style="font-weight: 700; color: var(--text-dark); font-size: 16px;">Sipariş #${order.id}</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">${formatDateTime(order.createdAt)}</div>
          </div>
          <span class="badge badge-warning text-uppercase" style="font-size: 12px;">
            ${order.status === 'pending' ? 'Sıraya Alındı' : 'Hazırlanıyor'}
          </span>
        </div>
        
        <div class="card-body" style="padding: 20px;">
          <!-- Real-time Progress Timeline -->
          <div class="status-timeline-wrap">
            <div class="timeline-step ${pendingClass}">
              <div class="timeline-icon">
                <span class="material-icons-round">receipt_long</span>
              </div>
              <div class="timeline-label">Sipariş Alındı</div>
            </div>
            
            <div class="timeline-progress-bar">
              <div class="timeline-progress-fill" style="width: ${order.status === 'preparing' ? '50%' : '0%'}"></div>
            </div>

            <div class="timeline-step ${preparingClass}">
              <div class="timeline-icon">
                <span class="material-icons-round">soup_kitchen</span>
              </div>
              <div class="timeline-label">Hazırlanıyor</div>
            </div>
            
            <div class="timeline-progress-bar">
              <div class="timeline-progress-fill" style="width: 0%"></div>
            </div>

            <div class="timeline-step ${deliveredClass}">
              <div class="timeline-icon">
                <span class="material-icons-round">restaurant</span>
              </div>
              <div class="timeline-label">Teslim Edildi</div>
            </div>
          </div>

          <!-- Order note if exists -->
          ${order.note ? `
            <div class="order-user-note" style="margin-top: 25px; padding: 10px 15px; background: #f8f9fa; border-radius: 8px; font-size: 13px; color: var(--text-muted);">
              <strong>Sipariş Notu:</strong> "${order.note}"
            </div>
          ` : ''}

          <!-- Items Accordion -->
          <div style="margin-top: 25px;">
            <h4 style="font-weight:700; color:var(--text-dark); margin-bottom:10px; font-size:14px;">Sipariş Detayları</h4>
            ${itemsSummary}
          </div>

          <!-- Price summary -->
          <div class="flex justify-between align-center" style="margin-top: 20px; padding-top: 15px; border-top: 1px solid var(--border-color);">
            <span style="font-weight: 700; color: var(--text-dark);">Toplam Ödenen (${order.paymentMethod.toUpperCase()})</span>
            <span style="font-size: 20px; font-weight: 800; color: var(--primary-color);">${formatPrice(order.total)}</span>
          </div>
        </div>
      </div>
    `;
  },

  renderPastOrderRow(order) {
    const itemsText = order.items.map(item => `${item.quantity}x ${item.name}`).join(', ');
    
    return `
      <div class="past-order-row" style="padding: 15px 0; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; gap: 15px;">
        <div style="flex: 1;">
          <div style="font-weight: 700; color: var(--text-dark); font-size: 14px;">
            Sipariş #${order.id} 
            <span class="status-badge delivered" style="margin-left: 8px; font-size: 11px; padding: 2px 6px;">Teslim Edildi</span>
          </div>
          <div style="font-size: 13px; color: var(--text-muted); margin-top: 4px; line-height: 1.4;">
            ${itemsText}
          </div>
          <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">
            ${formatDateTime(order.createdAt)} • Ödeme: ${order.paymentMethod.toUpperCase()}
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-weight: 800; color: var(--text-dark); font-size: 16px;">${formatPrice(order.total)}</div>
        </div>
      </div>
    `;
  },

  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
};
