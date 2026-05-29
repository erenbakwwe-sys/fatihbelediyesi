/* ============================================================
   FATIH AKILLI SOFRA — Finansal Raporlama ve Analiz Sayfası
   CSS-only bar charts, product rankings and payment method ratios
   ============================================================ */

import store from '../store.js';
import { formatPrice } from '../utils.js';

export default {
  render() {
    return `
      <div class="admin-page admin-finance">
        <div class="page-header flex justify-between align-center" style="margin-bottom: 2rem;">
          <div>
            <h1><span class="material-icons-round">analytics</span> Finansal Analiz & Raporlar</h1>
            <p class="page-subtitle" style="color:var(--text-muted); margin-top:5px;">Sipariş ciroları, en çok tercih edilen ürünler ve tahsilat yöntemlerinin detaylı analizi.</p>
          </div>
          
          <div class="period-filter flex gap-5" style="background:#fff; padding:4px; border-radius:8px; border:1px solid var(--border-color);">
            <button class="btn btn-sm btn-outline active-period" id="btn-period-daily" data-period="daily">Günlük</button>
            <button class="btn btn-sm btn-outline" id="btn-period-weekly" data-period="weekly">Haftalık</button>
            <button class="btn btn-sm btn-outline" id="btn-period-monthly" data-period="monthly">Aylık</button>
          </div>
        </div>

        <!-- Ciro KPI & Trends -->
        <div class="metrics-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 30px;">
          <div class="card flex align-center justify-between" style="padding: 20px;">
            <div>
              <div style="font-size:12px; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Toplam Hacim</div>
              <div id="finance-total-revenue" style="font-size: 28px; font-weight:800; color:var(--text-dark); margin-top:5px;">0 ₺</div>
              <div class="flex align-center gap-4" style="color:#2e7d32; font-size:11px; font-weight:700; margin-top:5px;">
                <span class="material-icons-round" style="font-size:14px;">trending_up</span>
                <span>%14.2 artış (Önceki Döneme Göre)</span>
              </div>
            </div>
            <div style="background: rgba(200,16,46,0.1); color: var(--primary-color); width: 48px; height: 48px; border-radius: 8px; display:flex; align-items:center; justify-content:center;">
              <span class="material-icons-round">account_balance_wallet</span>
            </div>
          </div>

          <div class="card flex align-center justify-between" style="padding: 20px;">
            <div>
              <div style="font-size:12px; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Ortalama Sipariş Tutarı</div>
              <div id="finance-average-order" style="font-size: 28px; font-weight:800; color:var(--text-dark); margin-top:5px;">0 ₺</div>
              <div class="flex align-center gap-4" style="color:#2e7d32; font-size:11px; font-weight:700; margin-top:5px;">
                <span class="material-icons-round" style="font-size:14px;">trending_up</span>
                <span>%3.8 yükseliş</span>
              </div>
            </div>
            <div style="background: rgba(21,101,192,0.1); color: #1565c0; width: 48px; height: 48px; border-radius: 8px; display:flex; align-items:center; justify-content:center;">
              <span class="material-icons-round">shopping_bag</span>
            </div>
          </div>
        </div>

        <!-- Charts Grid -->
        <div class="finance-grid" style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 25px; margin-bottom: 30px;">
          <!-- CSS-only Bar Chart Card -->
          <div class="card" style="padding: 20px;">
            <h3 style="font-weight:700; color:var(--text-dark); margin-bottom: 20px;">Dönemsel Satış Grafiği</h3>
            <div class="bar-chart-container" id="finance-bar-chart" style="display: flex; align-items: flex-end; justify-content: space-around; height: 220px; border-bottom: 2px solid var(--border-color); padding-bottom: 10px;">
              <!-- Bars dynamically injected -->
            </div>
            <div class="chart-labels" id="finance-chart-labels" style="display: flex; justify-content: space-around; margin-top:10px; font-size:11px; font-weight:700; color:var(--text-muted);">
              <!-- Labels injected -->
            </div>
          </div>

          <!-- Payment Methods Distribution -->
          <div class="card" style="padding: 20px;">
            <h3 style="font-weight:700; color:var(--text-dark); margin-bottom: 20px;">Tahsilat Yöntemleri Dağılımı</h3>
            <div class="payment-distribution-list" style="display: flex; flex-direction: column; gap: 20px;">
              
              <div class="payment-ratio-item">
                <div class="flex justify-between" style="font-size:13px; font-weight:700; margin-bottom: 6px;">
                  <span class="flex align-center gap-4 text-primary"><span class="material-icons-round">contactless</span> Temassız NFC</span>
                  <span id="ratio-nfc-percent">0%</span>
                </div>
                <div class="progress-bar-wrap" style="background:#e9ecef; height:8px; border-radius:10px; overflow:hidden;">
                  <div class="progress-fill" id="ratio-nfc-fill" style="background:var(--primary-color); height:100%; width:0%; transition:width 0.8s ease;"></div>
                </div>
              </div>

              <div class="payment-ratio-item">
                <div class="flex justify-between" style="font-size:13px; font-weight:700; margin-bottom: 6px;">
                  <span class="flex align-center gap-4 text-info"><span class="material-icons-round">credit_card</span> Kredi Kartı</span>
                  <span id="ratio-card-percent">0%</span>
                </div>
                <div class="progress-bar-wrap" style="background:#e9ecef; height:8px; border-radius:10px; overflow:hidden;">
                  <div class="progress-fill" id="ratio-card-fill" style="background:#1565c0; height:100%; width:0%; transition:width 0.8s ease;"></div>
                </div>
              </div>

              <div class="payment-ratio-item">
                <div class="flex justify-between" style="font-size:13px; font-weight:700; margin-bottom: 6px;">
                  <span class="flex align-center gap-4 text-success"><span class="material-icons-round">payments</span> Nakit Ödeme</span>
                  <span id="ratio-cash-percent">0%</span>
                </div>
                <div class="progress-bar-wrap" style="background:#e9ecef; height:8px; border-radius:10px; overflow:hidden;">
                  <div class="progress-fill" id="ratio-cash-fill" style="background:#2e7d32; height:100%; width:0%; transition:width 0.8s ease;"></div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Top Selling Items -->
        <div class="card" style="padding: 20px;">
          <h3 style="font-weight:700; color:var(--text-dark); margin-bottom: 20px;">En Popüler Ürünler Sıralaması</h3>
          <div class="table-scroll">
            <table class="data-table">
              <thead>
                <tr>
                  <th style="width: 60px;">Sıra</th>
                  <th>Ürün Adı</th>
                  <th>Kategori</th>
                  <th>Satış Adedi</th>
                  <th style="width: 300px;">Popülerlik Oranı</th>
                  <th style="text-align: right;">Oluşturulan Ciro</th>
                </tr>
              </thead>
              <tbody id="top-items-tbody">
                <!-- Top items injected -->
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>
        .finance-bar-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 40px;
          height: 100%;
          justify-content: flex-end;
          cursor: pointer;
        }
        .finance-bar-value {
          font-size: 10px;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 4px;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .finance-bar-wrap:hover .finance-bar-value {
          opacity: 1;
        }
        .finance-bar-fill {
          background: linear-gradient(to top, var(--primary-color), #ff4d6d);
          width: 100%;
          border-radius: 4px 4px 0 0;
          transition: height 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      </style>
    `;
  },

  init() {
    this.period = 'daily';

    // Period clicks
    document.querySelectorAll('.period-filter button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.period-filter button').forEach(b => b.classList.remove('active-period'));
        btn.classList.add('active-period');
        
        this.period = btn.getAttribute('data-period');
        this.calculateAndRender();
      });
    });

    this.calculateAndRender();

    // Sync changes
    this.unsubscribe = store.subscribe(() => {
      this.calculateAndRender();
    });
  },

  calculateAndRender() {
    const orders = [...store.state.orders];
    
    // 1. Calculate General metrics
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const averageOrder = orders.length > 0 ? (totalRevenue / orders.length) : 0;

    const revEl = document.getElementById('finance-total-revenue');
    const avgEl = document.getElementById('finance-average-order');

    if (revEl) revEl.textContent = formatPrice(totalRevenue);
    if (avgEl) avgEl.textContent = formatPrice(averageOrder);

    // 2. Render CSS Bar Chart based on Period
    this.renderPeriodChart(orders);

    // 3. Calculate and Render Payment Method Ratios
    this.renderPaymentRatios(orders);

    // 4. Calculate and Render Top Selling Items
    this.renderTopSellingItems(orders);
  },

  renderPeriodChart(orders) {
    const chart = document.getElementById('finance-bar-chart');
    const labels = document.getElementById('finance-chart-labels');
    if (!chart || !labels) return;

    let chartData = [];
    if (this.period === 'daily') {
      // Last 7 days ciro
      const days = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
      chartData = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayLabel = days[d.getDay()];
        
        const dayStart = new Date(d);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(d);
        dayEnd.setHours(23, 59, 59, 999);
        
        const dayRevenue = orders
          .filter(o => {
            const date = new Date(o.createdAt);
            return date >= dayStart && date <= dayEnd;
          })
          .reduce((sum, o) => sum + (o.total || 0), 0);

        return { label: dayLabel, value: dayRevenue };
      }).reverse();
    } else if (this.period === 'weekly') {
      // Last 4 weeks
      chartData = Array.from({ length: 4 }, (_, i) => {
        const wStart = new Date();
        wStart.setDate(wStart.getDate() - (i + 1) * 7);
        const wEnd = new Date();
        wEnd.setDate(wEnd.getDate() - i * 7);

        const wRevenue = orders
          .filter(o => {
            const date = new Date(o.createdAt);
            return date >= wStart && date <= wEnd;
          })
          .reduce((sum, o) => sum + (o.total || 0), 0);

        return { label: `${4 - i}. Hafta`, value: wRevenue };
      }).reverse();
    } else {
      // Last 6 months
      const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
      chartData = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const mLabel = months[d.getMonth()];

        const mRevenue = orders
          .filter(o => {
            const date = new Date(o.createdAt);
            return date.getMonth() === d.getMonth() && date.getFullYear() === d.getFullYear();
          })
          .reduce((sum, o) => sum + (o.total || 0), 0);

        return { label: mLabel, value: mRevenue };
      }).reverse();
    }

    const maxValue = Math.max(...chartData.map(d => d.value), 1);

    chart.innerHTML = chartData.map(d => {
      const heightPercent = Math.min((d.value / maxValue) * 100, 100);
      return `
        <div class="finance-bar-wrap">
          <span class="finance-bar-value">${formatPrice(d.value)}</span>
          <div class="finance-bar-fill" style="height: 0%;" data-height="${heightPercent}%"></div>
        </div>
      `;
    }).join('');

    labels.innerHTML = chartData.map(d => `<div>${d.label}</div>`).join('');

    // Trigger visual build transition after render
    setTimeout(() => {
      document.querySelectorAll('.finance-bar-fill').forEach(bar => {
        bar.style.height = bar.getAttribute('data-height');
      });
    }, 100);
  },

  renderPaymentRatios(orders) {
    if (orders.length === 0) return;

    const nfcOrders = orders.filter(o => o.paymentMethod === 'nfc');
    const cardOrders = orders.filter(o => o.paymentMethod === 'card' || o.paymentMethod === 'credit_card');
    const cashOrders = orders.filter(o => o.paymentMethod === 'cash');

    const totalCount = orders.length;

    const nfcRatio = Math.round((nfcOrders.length / totalCount) * 100);
    const cardRatio = Math.round((cardOrders.length / totalCount) * 100);
    const cashRatio = Math.round((cashOrders.length / totalCount) * 100);

    const nfcPct = document.getElementById('ratio-nfc-percent');
    const cardPct = document.getElementById('ratio-card-percent');
    const cashPct = document.getElementById('ratio-cash-percent');

    if (nfcPct) nfcPct.textContent = `${nfcRatio}%`;
    if (cardPct) cardPct.textContent = `${cardRatio}%`;
    if (cashPct) cashPct.textContent = `${cashRatio}%`;

    const nfcFill = document.getElementById('ratio-nfc-fill');
    const cardFill = document.getElementById('ratio-card-fill');
    const cashFill = document.getElementById('ratio-cash-fill');

    if (nfcFill) nfcFill.style.width = `${nfcRatio}%`;
    if (cardFill) cardFill.style.width = `${cardRatio}%`;
    if (cashFill) cashFill.style.width = `${cashRatio}%`;
  },

  renderTopSellingItems(orders) {
    const tbody = document.getElementById('top-items-tbody');
    if (!tbody) return;

    // Aggregate items sold
    const itemSales = {};
    orders.forEach(o => {
      o.items.forEach(i => {
        if (!itemSales[i.id]) {
          itemSales[i.id] = { name: i.name, count: 0, revenue: 0 };
        }
        itemSales[i.id].count += i.quantity;
        itemSales[i.id].revenue += i.quantity * i.price;
      });
    });

    // Convert to sorted array
    const sortedItems = Object.keys(itemSales)
      .map(key => ({ id: key, ...itemSales[key] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // top 5

    if (sortedItems.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center" style="padding:30px; color:var(--text-muted);">
            Satış verisi bulunmuyor.
          </td>
        </tr>
      `;
      return;
    }

    const maxCount = sortedItems[0].count;

    tbody.innerHTML = sortedItems.map((item, idx) => {
      const category = store.state.menu.find(m => m.id === item.id)?.category || 'Yemek';
      const categoryMap = { starters: 'Başlangıç', mains: 'Ana Yemek', kebabs: 'Kebap', desserts: 'Tatlı', drinks: 'İçecek' };
      const widthPercent = (item.count / maxCount) * 100;

      return `
        <tr>
          <td class="cell-bold">${idx + 1}</td>
          <td class="cell-bold" style="color:var(--text-dark);">${item.name}</td>
          <td class="cell-muted">${categoryMap[category] || 'Diğer'}</td>
          <td class="cell-bold">${item.count} Adet</td>
          <td>
            <div class="progress-bar-wrap" style="background:#e9ecef; height:6px; border-radius:10px; overflow:hidden;">
              <div class="progress-fill" style="background:var(--primary-color); height:100%; width:${widthPercent}%;"></div>
            </div>
          </td>
          <td class="cell-bold" style="text-align: right; color:var(--text-dark);">${formatPrice(item.revenue)}</td>
        </tr>
      `;
    }).join('');
  },

  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
};
