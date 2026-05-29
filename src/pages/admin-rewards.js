/* ============================================================
   FATIH AKILLI SOFRA — Kazı-Kazan Kampanya & Ödül Yönetimi
   Campaign management, scratch-card winners logs and push mockups
   ============================================================ */

import store from '../store.js';
import { formatDate, formatDateTime, showToast } from '../utils.js';

export default {
  render() {
    return `
      <div class="admin-page admin-rewards">
        <div class="page-header flex justify-between align-center" style="margin-bottom: 2rem;">
          <div>
            <h1><span class="material-icons-round text-primary">emoji_events</span> Ödül & Kazı-Kazan Kampanyaları</h1>
            <p class="page-subtitle" style="color:var(--text-muted); margin-top:5px;">Kazı-kazan talihlileri listesi, kampanya e-postaları ve push bildirim araçları.</p>
          </div>
          
          <div class="flex gap-10">
            <button class="btn btn-outline" id="btn-email-campaign">
              <span class="material-icons-round">email</span>
              <span>E-Posta Kampanyası</span>
            </button>
            <button class="btn btn-primary" id="btn-push-campaign">
              <span class="material-icons-round">notifications_active</span>
              <span>Web Push Gönder</span>
            </button>
          </div>
        </div>

        <!-- Metric KPI Cards -->
        <div class="metrics-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 30px;">
          <div class="card flex align-center gap-15" style="padding: 20px;">
            <div style="background: rgba(200,16,46,0.1); color: var(--primary-color); width: 44px; height: 44px; border-radius: 8px; display:flex; align-items:center; justify-content:center;">
              <span class="material-icons-round">people</span>
            </div>
            <div>
              <div id="reward-metric-total" style="font-size: 24px; font-weight:800; color:var(--text-dark);">0</div>
              <div style="font-size:12px; color:var(--text-muted); font-weight:600;">Toplam Katılım</div>
            </div>
          </div>

          <div class="card flex align-center gap-15" style="padding: 20px;">
            <div style="background: rgba(251,140,0,0.1); color: #fb8c00; width: 44px; height: 44px; border-radius: 8px; display:flex; align-items:center; justify-content:center;">
              <span class="material-icons-round">card_giftcard</span>
            </div>
            <div>
              <div id="reward-metric-active" style="font-size: 24px; font-weight:800; color:#fb8c00;">0</div>
              <div style="font-size:12px; color:var(--text-muted); font-weight:600;">Aktif Bekleyen Ödül</div>
            </div>
          </div>

          <div class="card flex align-center gap-15" style="padding: 20px;">
            <div style="background: rgba(46,125,50,0.1); color: #2e7d32; width: 44px; height: 44px; border-radius: 8px; display:flex; align-items:center; justify-content:center;">
              <span class="material-icons-round">check_circle</span>
            </div>
            <div>
              <div id="reward-metric-used" style="font-size: 24px; font-weight:800; color:#2e7d32;">0</div>
              <div style="font-size:12px; color:var(--text-muted); font-weight:600;">Kullanılmış Ödüller</div>
            </div>
          </div>
        </div>

        <!-- Filter & Search Bar -->
        <div class="filter-bar flex align-center justify-between gap-15 wrap" style="padding: 15px 20px; background:#fff; border-radius:12px; border:1px solid var(--border-color); margin-bottom: 25px;">
          <div class="flex gap-5" id="rewards-filter-tabs">
            <button class="btn btn-sm btn-outline active-filter" data-filter="all">Tümü</button>
            <button class="btn btn-sm btn-outline" data-filter="pending">Bekleyenler</button>
            <button class="btn btn-sm btn-outline" data-filter="used">Kullanılanlar</button>
          </div>
          
          <div class="filter-search-wrapper" style="position:relative; min-width:280px;">
            <span class="material-icons-round search-icon" style="position:absolute; left:10px; top:50%; transform:translateY(-50%); color:var(--text-muted); font-size:16px;">search</span>
            <input type="text" id="reward-search-input" class="form-input search-input" style="padding-left:35px; width:100%;" placeholder="İsim, Kod, Ödül veya Telefon ile ara..." />
          </div>
        </div>

        <!-- Winners Table -->
        <div class="card table-wrapper">
          <div class="table-scroll">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Kod & Masa</th>
                  <th>Müşteri Bilgileri</th>
                  <th>Kazanılan Hediye</th>
                  <th>Durum</th>
                  <th>Tarih</th>
                  <th style="text-align: right;">İşlem</th>
                </tr>
              </thead>
              <tbody id="rewards-table-body">
                <!-- Injected Rows -->
              </tbody>
            </table>
          </div>
        </div>

        <!-- Email Campaign Modal -->
        <div id="email-modal" class="modal-overlay" style="display: none;">
          <div class="modal scale-in" style="max-width: 500px; padding: 25px;">
            <div class="modal-header flex justify-between align-center" style="border-bottom:1px solid var(--border-color); padding-bottom:15px; margin-bottom:20px;">
              <h3 style="font-weight:700; color:var(--text-dark); margin:0;">E-Posta Kampanyası Gönder</h3>
              <span class="material-icons-round text-muted" id="btn-close-email" style="cursor: pointer;">close</span>
            </div>
            
            <form id="email-campaign-form">
              <div class="form-group" style="margin-bottom:15px;">
                <label class="form-label" for="email-subject">Konu</label>
                <input type="text" id="email-subject" class="form-input" placeholder="Fatih Belediyesi Akıllı Sofra Hediyeleri!" required />
              </div>
              <div class="form-group" style="margin-bottom:15px;">
                <label class="form-label" for="email-message">Mesaj</label>
                <textarea id="email-message" class="form-textarea" rows="4" placeholder="Sayın müşterimiz, belediyemiz öncülüğünde sunulan Kazı-Kazan kodunuzun geçerlilik süresi..." required></textarea>
              </div>
              <div class="form-group" style="margin-bottom:20px;">
                <label class="form-label">Hedef Kitle</label>
                <div class="flex flex-direction-column gap-5" style="margin-top:5px; font-size:13px;">
                  <label class="flex align-center gap-5" style="cursor:pointer;">
                    <input type="radio" name="email-target" value="all" checked /> Tüm Müşteriler
                  </label>
                  <label class="flex align-center gap-5" style="cursor:pointer;">
                    <input type="radio" name="email-target" value="active" /> Sadece Aktif Ödüllü Müşteriler
                  </label>
                  <label class="flex align-center gap-5" style="cursor:pointer;">
                    <input type="radio" name="email-target" value="birthday" /> Doğum Günü Yaklaşanlar
                  </label>
                </div>
              </div>
              <div class="flex justify-end gap-10">
                <button type="button" class="btn btn-ghost text-muted" id="btn-cancel-email">İptal</button>
                <button type="submit" class="btn btn-primary">Kampanyayı Gönder</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Push Notification Modal -->
        <div id="push-modal" class="modal-overlay" style="display: none;">
          <div class="modal scale-in" style="max-width: 450px; padding: 25px;">
            <div class="modal-header flex justify-between align-center" style="border-bottom:1px solid var(--border-color); padding-bottom:15px; margin-bottom:20px;">
              <h3 style="font-weight:700; color:var(--text-dark); margin:0;">Web Push Bildirimi Gönder</h3>
              <span class="material-icons-round text-muted" id="btn-close-push" style="cursor: pointer;">close</span>
            </div>
            
            <form id="push-campaign-form">
              <div class="form-group" style="margin-bottom:15px;">
                <label class="form-label" for="push-title">Başlık</label>
                <input type="text" id="push-title" class="form-input" placeholder="Akıllı Sofra Bildirimi" required />
              </div>
              <div class="form-group" style="margin-bottom:15px;">
                <label class="form-label" for="push-message">Mesaj</label>
                <input type="text" id="push-message" class="form-input" placeholder="Masa 2 için kazandığınız Bedava Baklava sizi bekliyor!" required />
              </div>
              <div class="form-group" style="margin-bottom:20px;">
                <label class="form-label" for="push-target">Hedef Kitle</label>
                <select id="push-target" class="form-select">
                  <option value="all">Tüm Aktif Kullanıcılar</option>
                  <option value="diners">Şu An Masada Yemek Yiyenler</option>
                  <option value="winners">Kupon Sahibi Olanlar</option>
                </select>
              </div>
              <div class="flex justify-end gap-10">
                <button type="button" class="btn btn-ghost text-muted" id="btn-cancel-push">İptal</button>
                <button type="submit" class="btn btn-primary">Bildirimi Yayınla</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  },

  init() {
    this.filterTab = 'all';
    this.searchQuery = '';

    // 1. Initial Render
    this.filterAndRender();

    // 2. Modals setup
    this.setupModals();

    // 3. Filters & Search setup
    const searchInput = document.getElementById('reward-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.filterAndRender();
      });
    }

    document.querySelectorAll('#rewards-filter-tabs button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#rewards-filter-tabs button').forEach(b => b.classList.remove('active-filter'));
        btn.classList.add('active-filter');
        this.filterTab = btn.getAttribute('data-filter');
        this.filterAndRender();
      });
    });

    // 4. Live Sync
    this.unsubscribe = store.subscribe(() => {
      this.filterAndRender();
    });
  },

  filterAndRender() {
    const rewards = [...store.state.rewards];
    
    // Calculate KPIs
    const totalCount = rewards.length;
    const activeCount = rewards.filter(r => !r.used).length;
    const usedCount = rewards.filter(r => r.used).length;

    const totEl = document.getElementById('reward-metric-total');
    const actEl = document.getElementById('reward-metric-active');
    const usdEl = document.getElementById('reward-metric-used');

    if (totEl) totEl.textContent = totalCount;
    if (actEl) actEl.textContent = activeCount;
    if (usdEl) usdEl.textContent = usedCount;

    // Filter
    let filtered = rewards;
    if (this.filterTab === 'pending') {
      filtered = filtered.filter(r => !r.used);
    } else if (this.filterTab === 'used') {
      filtered = filtered.filter(r => r.used);
    }

    // Search
    if (this.searchQuery) {
      filtered = filtered.filter(r => 
        r.customerName.toLowerCase().includes(this.searchQuery) ||
        r.code.toLowerCase().includes(this.searchQuery) ||
        r.prizeName.toLowerCase().includes(this.searchQuery) ||
        r.customerPhone.includes(this.searchQuery)
      );
    }

    // Render Table Rows
    const tbody = document.getElementById('rewards-table-body');
    if (tbody) {
      if (filtered.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" class="text-center" style="padding:40px; color:var(--text-muted);">
              Aranan kriterlere uygun kampanya veya hediye talihlisi bulunamadı.
            </td>
          </tr>
        `;
      } else {
        tbody.innerHTML = filtered.map(r => this.renderRewardRow(r)).join('');
        this.bindUseActions();
      }
    }
  },

  renderRewardRow(reward) {
    return `
      <tr id="reward-row-${reward.id}">
        <td>
          <div class="cell-bold">${reward.code}</div>
          <div class="cell-muted" style="font-size:11px;">Masa ${reward.tableNo}</div>
        </td>
        <td>
          <div class="cell-bold" style="color:var(--text-dark);">${reward.customerName}</div>
          <div style="font-size:12px; color:var(--text-muted); line-height:1.4;">
            Tel: ${reward.customerPhone} <br>
            E-Posta: ${reward.customerEmail} <br>
            Doğum Günü: ${formatDate(reward.customerBirthday)}
          </div>
        </td>
        <td class="cell-bold" style="color:var(--primary-color);">
          <span class="flex align-center gap-4">
            <span class="material-icons-round" style="font-size:16px;">redeem</span>
            <span>${reward.prizeName}</span>
          </span>
        </td>
        <td>
          <span class="status-badge ${reward.used ? 'delivered' : 'pending'}" style="font-size:11px;">
            ${reward.used ? 'Kullanıldı' : 'Aktif Kupon'}
          </span>
        </td>
        <td class="cell-muted" style="font-size:12px;">${formatDateTime(reward.createdAt)}</td>
        <td style="text-align: right;">
          <button class="btn btn-sm btn-outline btn-mark-used" data-id="${reward.id}" ${reward.used ? 'disabled' : ''} style="font-size:11px; padding: 4px 10px;">
            <span class="material-icons-round" style="font-size:14px; margin-right:2px;">check</span>
            <span>Kullanıldı Yap</span>
          </button>
        </td>
      </tr>
    `;
  },

  bindUseActions() {
    document.querySelectorAll('.btn-mark-used').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        await store.markRewardUsed(id);
      });
    });
  },

  setupModals() {
    const emailModal = document.getElementById('email-modal');
    const pushModal = document.getElementById('push-modal');

    // Open Btns
    const openEmail = document.getElementById('btn-email-campaign');
    const openPush = document.getElementById('btn-push-campaign');

    if (openEmail && emailModal) {
      openEmail.addEventListener('click', () => {
        emailModal.style.display = 'flex';
      });
    }

    if (openPush && pushModal) {
      openPush.addEventListener('click', () => {
        pushModal.style.display = 'flex';
      });
    }

    // Email close handlers
    const closeEmail = () => {
      if (emailModal) emailModal.style.display = 'none';
      const form = document.getElementById('email-campaign-form');
      if (form) form.reset();
    };
    document.getElementById('btn-close-email').addEventListener('click', closeEmail);
    document.getElementById('btn-cancel-email').addEventListener('click', closeEmail);

    const emailForm = document.getElementById('email-campaign-form');
    if (emailForm) {
      emailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const subject = document.getElementById('email-subject').value;
        showToast(`Kampanya E-postası başarıyla kuyruğa alındı: "${subject}"`);
        closeEmail();
      });
    }

    // Push close handlers
    const closePush = () => {
      if (pushModal) pushModal.style.display = 'none';
      const form = document.getElementById('push-campaign-form');
      if (form) form.reset();
    };
    document.getElementById('btn-close-push').addEventListener('click', closePush);
    document.getElementById('btn-cancel-push').addEventListener('click', closePush);

    const pushForm = document.getElementById('push-campaign-form');
    if (pushForm) {
      pushForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('push-title').value;
        showToast(`Web Push Bildirimi hedeflenen kullanıcılara gönderildi: "${title}"`);
        closePush();
      });
    }
  },

  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
};
