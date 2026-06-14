/* ============================================================
   FATIH AKILLI SOFRA — Siparişlerim (Order Tracking) Page
   Mobile-first compact design with real-time status tracking
   ============================================================ */

import store from '../store.js';
import { formatPrice, formatDateTime } from '../utils.js';

export default {
  render() {
    return `
      <div style="padding-bottom: 140px; background: #fff; min-height: 100vh;">
        <!-- ═══ ACTIVE ORDERS ═══ -->
        <div id="active-orders-container" style="padding: 8px 16px;">
          <div style="text-align: center; padding: 40px 20px; color: #999;">Siparişler yükleniyor...</div>
        </div>

        <!-- ═══ PAST ORDERS (collapsible) ═══ -->
        <div style="margin: 16px; border-radius: 14px; background: #f5f6f8; overflow: hidden;">
          <div id="btn-toggle-past-orders" style="
            display: flex; justify-content: space-between; align-items: center;
            padding: 14px 16px; cursor: pointer;
          ">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="material-icons-round" style="font-size: 20px; color: #999;">history</span>
              <span style="font-weight: 700; color: #1A1A2E; font-size: 14px;">Geçmiş Siparişlerim</span>
            </div>
            <span class="material-icons-round" style="color: #999;" id="past-toggle-icon">expand_more</span>
          </div>
          
          <div id="past-orders-body" style="display: none; border-top: 1px solid #eee; padding: 12px 16px;">
            <div id="past-orders-list">
              <div style="text-align: center; color: #999; font-size: 13px; padding: 16px;">Geçmiş sipariş kaydı bulunmuyor.</div>
            </div>
          </div>
        </div>
      </div>
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
    
    const currentTableOrders = state.orders.filter(o => o.tableNo === tableNo);
    
    const activeOrders = currentTableOrders.filter(o => o.status !== 'delivered');
    const pastOrders = currentTableOrders.filter(o => o.status === 'delivered');

    // 1. Render Active Orders
    const activeContainer = document.getElementById('active-orders-container');
    if (activeContainer) {
      if (activeOrders.length === 0) {
        activeContainer.innerHTML = `
          <div style="
            text-align: center; padding: 50px 20px;
            background: #f5f6f8; border-radius: 16px; margin-top: 8px;
          ">
            <span class="material-icons-round" style="font-size: 48px; color: #ddd; margin-bottom: 12px;">restaurant</span>
            <h3 style="font-weight: 700; color: #1A1A2E; font-size: 16px; margin-bottom: 6px;">Aktif Siparişiniz Yok</h3>
            <p style="color: #999; font-size: 13px; margin-bottom: 16px;">Şu anda hazırlanmakta olan sipariş bulunmuyor.</p>
            <a href="#/menu" style="
              display: inline-flex; align-items: center; gap: 6px;
              padding: 10px 24px; border-radius: 25px;
              background: #C8102E; color: #fff; font-size: 14px; font-weight: 700;
              text-decoration: none;
            ">
              <span class="material-icons-round" style="font-size: 18px;">restaurant_menu</span>
              Sipariş Ver
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
        pastList.innerHTML = `<div style="text-align: center; color: #999; font-size: 13px; padding: 16px;">Geçmiş sipariş kaydı bulunmuyor.</div>`;
      } else {
        pastList.innerHTML = pastOrders.map(order => this.renderPastOrderRow(order)).join('');
      }
    }
  },

  renderActiveOrderCard(order) {
    const isPending = order.status === 'pending';
    const isPreparing = order.status === 'preparing';
    
    const statusText = isPending ? 'Sıraya Alındı' : 'Hazırlanıyor';
    const statusColor = isPending ? '#f59e0b' : '#3b82f6';

    const itemsSummary = order.items.map(item => `
      <div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px;">
        <span style="color: #1A1A2E;">${item.quantity}x ${item.name}</span>
        <span style="color: #999;">${formatPrice(item.price * item.quantity)}</span>
      </div>
    `).join('');

    // Progress dots
    const step1Color = '#C8102E';
    const step2Color = isPreparing ? '#C8102E' : '#ddd';
    const step3Color = '#ddd';
    const line1Color = isPreparing ? '#C8102E' : '#eee';
    const line2Color = '#eee';

    return `
      <div style="
        background: #fff; border-radius: 16px; margin-bottom: 12px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.06); overflow: hidden;
        border-left: 4px solid #C8102E;
      ">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: #f9f9f9;">
          <div>
            <div style="font-weight: 700; color: #1A1A2E; font-size: 14px;">#${order.id}</div>
            <div style="font-size: 11px; color: #999; margin-top: 2px;">${formatDateTime(order.createdAt)}</div>
          </div>
          <span style="
            padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;
            background: ${statusColor}20; color: ${statusColor};
          ">${statusText}</span>
        </div>
        
        <!-- Progress Timeline (horizontal) -->
        <div style="padding: 16px; display: flex; align-items: center; justify-content: center; gap: 0;">
          <div style="text-align: center;">
            <div style="width: 28px; height: 28px; border-radius: 50%; background: ${step1Color}; color: #fff; display: flex; align-items: center; justify-content: center; margin: 0 auto 4px;">
              <span class="material-icons-round" style="font-size: 14px;">receipt_long</span>
            </div>
            <span style="font-size: 10px; color: #1A1A2E; font-weight: 600;">Alındı</span>
          </div>
          <div style="flex: 1; height: 3px; background: ${line1Color}; margin: 0 4px; margin-bottom: 18px; border-radius: 2px;"></div>
          <div style="text-align: center;">
            <div style="width: 28px; height: 28px; border-radius: 50%; background: ${step2Color}; color: #fff; display: flex; align-items: center; justify-content: center; margin: 0 auto 4px;">
              <span class="material-icons-round" style="font-size: 14px;">soup_kitchen</span>
            </div>
            <span style="font-size: 10px; color: ${isPreparing ? '#1A1A2E' : '#ccc'}; font-weight: 600;">Hazırlanıyor</span>
          </div>
          <div style="flex: 1; height: 3px; background: ${line2Color}; margin: 0 4px; margin-bottom: 18px; border-radius: 2px;"></div>
          <div style="text-align: center;">
            <div style="width: 28px; height: 28px; border-radius: 50%; background: ${step3Color}; color: #fff; display: flex; align-items: center; justify-content: center; margin: 0 auto 4px;">
              <span class="material-icons-round" style="font-size: 14px;">restaurant</span>
            </div>
            <span style="font-size: 10px; color: #ccc; font-weight: 600;">Teslim</span>
          </div>
        </div>

        <!-- Items & Total -->
        <div style="padding: 0 16px 16px;">
          ${order.note ? `
            <div style="padding: 8px 12px; background: #f5f6f8; border-radius: 8px; font-size: 12px; color: #999; margin-bottom: 10px;">
              <b>Not:</b> "${order.note}"
            </div>
          ` : ''}
          
          <div style="border-top: 1px solid #f0f0f0; padding-top: 8px;">
            ${itemsSummary}
          </div>
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; padding-top: 10px; border-top: 1px solid #eee;">
            <span style="font-weight: 600; color: #999; font-size: 12px;">${order.paymentMethod ? order.paymentMethod.toUpperCase() : ''}</span>
            <span style="font-size: 18px; font-weight: 800; color: #C8102E;">${formatPrice(order.total)}</span>
          </div>
        </div>
      </div>
    `;
  },

  renderPastOrderRow(order) {
    const itemsText = order.items.map(item => `${item.quantity}x ${item.name}`).join(', ');
    
    return `
      <div style="padding: 10px 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; gap: 12px;">
        <div style="flex: 1; min-width: 0;">
          <div style="font-weight: 700; color: #1A1A2E; font-size: 13px;">
            #${order.id}
            <span style="display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 600; background: #d1fae5; color: #059669; margin-left: 6px;">Teslim</span>
          </div>
          <div style="font-size: 12px; color: #999; margin-top: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            ${itemsText}
          </div>
          <div style="font-size: 11px; color: #ccc; margin-top: 2px;">
            ${formatDateTime(order.createdAt)}
          </div>
        </div>
        <div style="font-weight: 800; color: #1A1A2E; font-size: 15px; flex-shrink: 0;">${formatPrice(order.total)}</div>
      </div>
    `;
  },

  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
};
