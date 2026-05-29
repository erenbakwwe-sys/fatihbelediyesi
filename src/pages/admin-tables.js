/* ============================================================
   FATIH AKILLI SOFRA — Masa & QR Yönetim Sayfası
   QR Code Generator & NFC Tag association administration panel
   ============================================================ */

import store from '../store.js';
import qrcode from 'qrcode-generator';
import { showToast } from '../utils.js';

export default {
  render() {
    const tables = store.state.tables || [];

    return `
      <div class="admin-page admin-tables">
        <div class="page-header flex justify-between align-center" style="margin-bottom: 2rem;">
          <div>
            <h1><span class="material-icons-round">table_restaurant</span> Masa & QR Kod Yönetimi</h1>
            <p class="page-subtitle" style="color:var(--text-muted); margin-top:5px;">Masa tanımlamaları, dinamik QR kod basımı ve NFC etiket eşleştirmeleri.</p>
          </div>
          <button class="btn btn-primary" id="btn-add-table-modal">
            <span class="material-icons-round">add</span>
            <span>Yeni Masa Ekle</span>
          </button>
        </div>

        <!-- Table Cards Grid -->
        <div class="tables-admin-grid">
          ${tables.map(table => this.renderTableCard(table)).join('')}
        </div>

        <!-- Add Table Modal (Initially Hidden) -->
        <div id="add-table-modal" class="modal-overlay" style="display: none;">
          <div class="modal scale-in" style="max-width: 450px; padding: 25px;">
            <div class="modal-header flex justify-between align-center" style="border-bottom:1px solid var(--border-color); padding-bottom:15px; margin-bottom:20px;">
              <h3 style="font-weight: 700; color: var(--text-dark); margin:0;">Yeni Masa Tanımla</h3>
              <span class="material-icons-round text-muted" id="btn-close-modal" style="cursor: pointer;">close</span>
            </div>
            
            <form id="add-table-form">
              <div class="form-group" style="margin-bottom: 15px;">
                <label class="form-label" for="new-table-no">Masa Numarası</label>
                <input type="number" id="new-table-no" class="form-input" placeholder="Örn: 13" min="1" required />
              </div>
              <div class="form-group" style="margin-bottom: 25px;">
                <label class="form-label" for="new-table-nfc">NFC Etiket ID (Opsiyonel)</label>
                <input type="text" id="new-table-nfc" class="form-input" placeholder="Örn: NFC-FATIH-T13" />
                <small style="color:var(--text-muted); font-size:11px; margin-top:4px; display:block;">Boş bırakılırsa otomatik etiket kimliği atanacaktır.</small>
              </div>
              <div class="flex justify-end gap-10">
                <button type="button" class="btn btn-ghost text-muted" id="btn-cancel-modal">İptal</button>
                <button type="submit" class="btn btn-primary">Masayı Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>
        .tables-admin-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        .admin-table-card {
          background: #fff;
          border-radius: 12px;
          border: 1px solid var(--border-color);
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .admin-table-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
        }
        .table-status-indicator {
          position: absolute;
          top: 15px;
          right: 15px;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 20px;
        }
        .table-status-indicator.empty { background: #e8f5e9; color: #2e7d32; }
        .table-status-indicator.dining { background: #e3f2fd; color: #1565c0; }
        .table-status-indicator.calling { background: #fff3e0; color: #e65100; animation: flash-glow 1s infinite alternate; }
        @keyframes flash-glow {
          0% { box-shadow: 0 0 2px #ff9800; }
          100% { box-shadow: 0 0 10px #ff9800; }
        }
        .table-card-number {
          font-size: 18px;
          font-weight: 800;
          color: var(--text-dark);
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .qr-svg-wrap {
          background: #f8f9fa;
          padding: 10px;
          border-radius: 8px;
          border: 1px dashed var(--border-color);
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .nfc-tag-info {
          font-size: 12px;
          background: #f1f3f5;
          padding: 4px 10px;
          border-radius: 20px;
          color: var(--text-muted);
          font-family: monospace;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .table-toggle-active {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          border-top: 1px solid var(--border-color);
          padding-top: 15px;
          margin-top: 10px;
          font-size: 13px;
        }
      </style>
    `;
  },

  renderTableCard(table) {
    // Generate QR code SVG element
    const qrSvg = this.generateQrSvg(table.tableNo);

    // Status map in Turkish
    const statusMap = { empty: 'Boş', dining: 'Dolu', calling: 'Çağrı Var' };

    return `
      <div class="admin-table-card card" id="card-table-${table.tableNo}">
        <span class="table-status-indicator ${table.status}">${statusMap[table.status] || 'Boş'}</span>
        
        <div class="table-card-number">
          <span class="material-icons-round text-muted">table_restaurant</span>
          <span>Masa ${table.tableNo}</span>
        </div>

        <!-- Rendered QR code SVG -->
        <div class="qr-svg-wrap">
          ${qrSvg}
        </div>

        <div class="nfc-tag-info">
          <span class="material-icons-round" style="font-size:14px;">nfc</span>
          <span>${table.nfcTagId}</span>
        </div>

        <div class="flex gap-10" style="width: 100%; margin-top:5px;">
          <button class="btn btn-sm btn-outline btn-block btn-download-qr" data-table="${table.tableNo}" style="font-size:11px;">
            <span class="material-icons-round" style="font-size:14px;">download</span>
            <span>QR İndir</span>
          </button>
        </div>

        <div class="table-toggle-active">
          <span style="font-weight: 600; color: var(--text-dark);">Aktif / Satışta</span>
          <label class="toggle-switch">
            <input type="checkbox" class="table-active-checkbox" data-id="${table.id}" ${table.active ? 'checked' : ''} />
            <span class="slider"></span>
          </label>
        </div>
      </div>
    `;
  },

  // Dynamic QR Code SVG Generator helper
  generateQrSvg(tableNo) {
    try {
      // Robust way to support both default, named, or global qrcode-generator imports in Vite
      let qrFn = null;
      if (typeof qrcode === 'function') {
        qrFn = qrcode;
      } else if (qrcode && typeof qrcode.default === 'function') {
        qrFn = qrcode.default;
      } else if (qrcode && typeof qrcode.qrcode === 'function') {
        qrFn = qrcode.qrcode;
      } else if (typeof window !== 'undefined' && typeof window.qrcode === 'function') {
        qrFn = window.qrcode;
      }

      if (!qrFn) {
        throw new Error('qrcode-generator library not loaded correctly');
      }

      const qr = qrFn(4, 'M');
      // Create actual routing link pointing to the correct local/deployed URL dynamically
      const origin = window.location.origin || 'http://localhost:5173';
      const appUrl = `${origin}${window.location.pathname}#/menu?table=${tableNo}`;
      qr.addData(appUrl);
      qr.make();
      return qr.createSvgTag({ cellSize: 3, margin: 2 });
    } catch (e) {
      console.error('QR Generation failed:', e);
      return `<div style="color:var(--danger-color); font-size:11px;">QR Oluşturulamadı</div>`;
    }
  },

  init() {
    // 1. Unsubscribe/Subscribe for live UI updates
    this.unsubscribe = store.subscribe(() => {
      // Re-render table card content if tables list is updated
      const container = document.querySelector('.tables-admin-grid');
      if (container) {
        container.innerHTML = store.state.tables.map(table => this.renderTableCard(table)).join('');
        this.bindCardActions();
      }
    });

    // 2. Add Table Modal Handlers
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
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const tableNo = document.getElementById('new-table-no').value;
        const nfcTagId = document.getElementById('new-table-nfc').value;

        // Check if table no already exists
        const exists = store.state.tables.some(t => t.tableNo === parseInt(tableNo, 10));
        if (exists) {
          showToast(`Masa ${tableNo} zaten tanımlı!`, 'error');
          return;
        }

        await store.addTable(tableNo, nfcTagId);
        closeModal();
      });
    }

    this.bindCardActions();
  },

  bindCardActions() {
    // Active toggles
    document.querySelectorAll('.table-active-checkbox').forEach(chk => {
      chk.addEventListener('change', async () => {
        const tableId = chk.getAttribute('data-id');
        const active = chk.checked;
        await store.toggleTableActive(tableId, active);
      });
    });

    // QR Downloads
    document.querySelectorAll('.btn-download-qr').forEach(btn => {
      btn.addEventListener('click', () => {
        const tableNo = btn.getAttribute('data-table');
        this.downloadQrSvg(tableNo);
      });
    });
  },

  downloadQrSvg(tableNo) {
    const qrSvgString = this.generateQrSvg(tableNo);
    
    // Create downloaded file blob
    const blob = new Blob([qrSvgString], { type: 'image/svg+xml;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = `fatih_sofra_masa_${tableNo}_qr.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(blobUrl);

    showToast(`Masa ${tableNo} QR SVG görseli indirildi.`);
  },

  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
};
