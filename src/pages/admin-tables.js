import { store } from '../store.js';
import { showToast } from '../utils.js';

export function render() {
  const tables = store.tables || [];
  
  return `
    <div class="admin-page admin-tables">
      <div class="page-header">
        <h1><span class="material-icons-round">table_restaurant</span> Masalar ve QR Kodlar</h1>
        <div class="page-header-actions">
          <button class="btn btn-primary" id="btn-add-table-modal">
            <span class="material-icons-round">add</span>
            Yeni Masa Ekle
          </button>
        </div>
      </div>

      <div class="stats-row" style="margin-bottom: 2rem;">
        <div class="metric-card">
          <div class="metric-icon" style="background: rgba(46, 139, 87, 0.1); color: #2E8B57;">
            <span class="material-icons-round">check_circle</span>
          </div>
          <div class="metric-content">
            <h3 class="metric-value">${tables.filter(t => t.active !== false).length}</h3>
            <p class="metric-label">Aktif Masa</p>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-icon" style="background: rgba(200, 16, 46, 0.1); color: #C8102E;">
            <span class="material-icons-round">chair_alt</span>
          </div>
          <div class="metric-content">
            <h3 class="metric-value">${tables.filter(t => t.status === 'empty').length}</h3>
            <p class="metric-label">Boş Masa</p>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-icon" style="background: rgba(255, 152, 0, 0.1); color: #ff9800;">
            <span class="material-icons-round">dining</span>
          </div>
          <div class="metric-content">
            <h3 class="metric-value">${tables.filter(t => t.status === 'dining' || t.status === 'calling').length}</h3>
            <p class="metric-label">Dolu Masa</p>
          </div>
        </div>
      </div>

      <div class="tables-admin-grid">
        ${tables.map(table => renderTableCard(table)).join('')}
      </div>

      <!-- Add Table Modal -->
      <div class="modal-overlay" id="add-table-modal" style="display:none;">
        <div class="modal modal-sm">
          <div class="modal-header">
            <h2><span class="material-icons-round">add_circle</span> Yeni Masa Ekle</h2>
            <button class="btn btn-sm btn-outline" id="btn-close-modal">
              <span class="material-icons-round">close</span>
            </button>
          </div>
          <div class="modal-body">
            <form id="add-table-form">
              <div class="form-group">
                <label class="form-label">Masa Numarası *</label>
                <input type="number" class="form-input" id="new-table-no" min="1" required placeholder="Örn: 14">
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label">NFC Etiket ID (Opsiyonel)</label>
                <input type="text" class="form-input" id="new-table-nfc" placeholder="Boş bırakırsanız otomatik atanır">
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" id="btn-cancel-modal">İptal</button>
            <button type="submit" form="add-table-form" class="btn btn-primary">
              <span class="material-icons-round">save</span> Ekle
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <style>
      .tables-admin-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
      }
      .table-admin-card {
        background: #fff;
        border-radius: 16px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        overflow: hidden;
        border: 1px solid #f0f0f0;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      .table-admin-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.08);
      }
      .table-admin-card.inactive {
        opacity: 0.6;
        filter: grayscale(100%);
      }
      .table-card-header {
        background: #f8f9fa;
        padding: 1.25rem 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #eee;
      }
      .table-card-header h3 {
        margin: 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.2rem;
        color: #1A1A2E;
      }
      .table-card-body {
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
      .qr-container {
        padding: 1rem;
        background: #fff;
        border: 2px dashed #ddd;
        border-radius: 12px;
        margin-bottom: 1.5rem;
      }
      .qr-container img {
        display: block;
        width: 150px;
        height: 150px;
      }
      .table-info-row {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 0;
        border-bottom: 1px solid #f5f5f5;
        font-size: 0.9rem;
      }
      .table-info-row:last-child {
        border-bottom: none;
      }
      .info-label {
        color: #666;
        font-weight: 500;
      }
      .info-val {
        color: #1A1A2E;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 0.3rem;
      }
      .table-card-actions {
        padding: 1rem 1.5rem;
        background: #fcfcfc;
        border-top: 1px solid #eee;
        display: flex;
        gap: 0.75rem;
      }
      .btn-download-qr {
        flex: 1;
        justify-content: center;
      }
    </style>
  `;
}

function renderTableCard(table) {
  const origin = window.location.origin || 'http://localhost:5173';
  const appUrl = `${origin}${window.location.pathname}#/menu?table=${table.tableNo}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(appUrl)}`;

  return `
    <div class="table-admin-card ${table.active === false ? 'inactive' : ''}">
      <div class="table-card-header">
        <h3>
          <span class="material-icons-round text-primary">table_restaurant</span>
          Masa ${table.tableNo}
        </h3>
        <label class="toggle-switch" title="Masa Durumu">
          <input type="checkbox" class="table-active-toggle" data-id="${table.id}" ${table.active !== false ? 'checked' : ''}>
          <span class="toggle-slider"></span>
        </label>
      </div>
      
      <div class="table-card-body">
        <div class="qr-container">
          <img src="${qrImageUrl}" alt="QR Kod Masa ${table.tableNo}" crossOrigin="anonymous" id="qr-img-${table.tableNo}" />
        </div>
        
        <div class="table-info-row">
          <span class="info-label">Durum</span>
          <span class="info-val">
            ${table.status === 'empty' ? '<span class="badge badge-success">Boş</span>' : ''}
            ${table.status === 'dining' ? '<span class="badge badge-warning">Dolu</span>' : ''}
            ${table.status === 'calling' ? '<span class="badge badge-danger">Çağrı</span>' : ''}
          </span>
        </div>
        <div class="table-info-row">
          <span class="info-label">NFC Etiket ID</span>
          <span class="info-val">
            <span class="material-icons-round" style="font-size: 16px; color: #888;">nfc</span>
            ${table.nfcTagId}
          </span>
        </div>
        <div class="table-info-row">
          <span class="info-label">Özel URL</span>
          <span class="info-val text-primary" style="font-size: 0.8rem; text-decoration: underline; cursor: pointer;" onclick="navigator.clipboard.writeText('${appUrl}').then(()=>alert('Kopyalandı!'))">
            Kopyala <span class="material-icons-round" style="font-size: 14px;">content_copy</span>
          </span>
        </div>
      </div>

      <div class="table-card-actions">
        <button class="btn btn-outline btn-download-qr" data-table="${table.tableNo}" data-url="${appUrl}">
          <span class="material-icons-round">download</span> QR İndir
        </button>
      </div>
    </div>
  `;
}

export function init() {
  const container = document.querySelector('.admin-tables');
  if (!container) return;

  function reRender() {
    const wrapper = document.querySelector('.admin-page.admin-tables');
    if (wrapper) {
      wrapper.outerHTML = render();
      init();
    }
  }

  const modal = document.getElementById('add-table-modal');
  const openBtn = document.getElementById('btn-add-table-modal');
  const closeBtn = document.getElementById('btn-close-modal');
  const cancelBtn = document.getElementById('btn-cancel-modal');
  const form = document.getElementById('add-table-form');

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => {
      modal.style.display = 'flex';
    });
  }

  const closeModal = () => {
    if (modal) modal.style.display = 'none';
    if (form) form.reset();
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const tableNo = document.getElementById('new-table-no').value;
      const nfcTagId = document.getElementById('new-table-nfc').value;

      const exists = store.tables.some(t => t.tableNo === parseInt(tableNo, 10));
      if (exists) {
        showToast(`Masa ${tableNo} zaten tanımlı!`, 'error');
        return;
      }

      store.addTable(tableNo, nfcTagId);
      closeModal();
      setTimeout(reRender, 50);
    });
  }

  // Toggle handlers
  document.querySelectorAll('.table-active-toggle').forEach(toggle => {
    toggle.addEventListener('change', (e) => {
      const id = e.target.dataset.id;
      store.toggleTableActive(id, e.target.checked);
    });
  });

  // Download QR Handlers
  document.querySelectorAll('.btn-download-qr').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tableNo = e.currentTarget.dataset.table;
      const qrImg = document.getElementById(`qr-img-${tableNo}`);
      
      if (!qrImg || !qrImg.complete) {
        showToast('QR Kod henüz yüklenmedi, lütfen bekleyin.', 'warning');
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = 150;
      canvas.height = 150;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(qrImg, 0, 0, 150, 150);
      
      const link = document.createElement('a');
      link.download = `Masa_${tableNo}_QR.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  });
}
