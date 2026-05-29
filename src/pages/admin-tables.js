import { store } from '../store.js';
import { showToast } from '../utils.js';

export function render() {
  const tables = store.tables || [];
  
  return `
    <div class="admin-page admin-tables">
      <div class="page-header">
        <h1><span class="material-icons-round">table_restaurant</span> Masalar ve QR Kodlar</h1>
        <div class="page-header-actions" style="display: flex; gap: 10px;">
          <button class="btn btn-secondary" id="btn-print-all-qr">
            <span class="material-icons-round">print</span>
            Toplu QR Yazdır
          </button>
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
            <h2><span class="material-icons-round">add_circle</span> Toplu Masa Oluştur</h2>
            <button class="btn btn-sm btn-outline" id="btn-close-modal">
              <span class="material-icons-round">close</span>
            </button>
          </div>
          <div class="modal-body">
            <form id="add-table-form">
              <div class="form-group">
                <label class="form-label">Toplam Masa Sayısı *</label>
                <input type="number" class="form-input" id="new-table-count" min="1" required placeholder="Örn: 100">
                <small class="text-muted" style="display:block;margin-top:0.5rem;">Belirttiğiniz sayıya kadar eksik olan tüm masalar ve QR kodları otomatik oluşturulacaktır.</small>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" id="btn-cancel-modal">İptal</button>
            <button type="submit" form="add-table-form" class="btn btn-primary">
              <span class="material-icons-round">auto_awesome</span> Oluştur
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
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const countInput = document.getElementById('new-table-count').value;
      const totalCount = parseInt(countInput, 10);
      
      if (!totalCount || totalCount <= 0) {
        showToast('Geçerli bir masa sayısı girin.', 'error');
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = `<span class="material-icons-round" style="animation: spin 1s linear infinite;">autorenew</span> Oluşturuluyor...`;
      btn.disabled = true;

      const added = await store.addTablesBulk(totalCount);

      btn.innerHTML = originalText;
      btn.disabled = false;

      closeModal();
      
      if (added > 0) {
        showToast(`Toplam ${added} yeni masa başarıyla oluşturuldu!`, 'success');
        setTimeout(reRender, 100);
      } else {
        showToast(`Tüm masalar zaten tanımlı.`, 'info');
      }
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

  // Print All QRs Handler
  const btnPrintAll = document.getElementById('btn-print-all-qr');
  if (btnPrintAll) {
    btnPrintAll.addEventListener('click', () => {
      const activeTables = store.state.tables.filter(t => t.active !== false);
      if (activeTables.length === 0) {
        showToast('Yazdırılacak aktif masa bulunamadı.', 'warning');
        return;
      }

      // Create printable HTML
      const origin = window.location.origin || 'http://localhost:5173';
      const printWindow = window.open('', '_blank');
      
      let html = `
        <html>
        <head>
          <title>Fatih Akıllı Sofra - QR Kodlar</title>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 20px; background: #fff; }
            .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
            .qr-card { 
              border: 2px dashed #ccc; 
              padding: 20px; 
              text-align: center; 
              page-break-inside: avoid;
              border-radius: 16px;
            }
            .qr-card img { width: 200px; height: 200px; margin-bottom: 15px; }
            .qr-title { font-size: 24px; font-weight: bold; color: #C8102E; margin: 0 0 10px 0; }
            .qr-subtitle { font-size: 14px; color: #666; margin: 0; }
            .brand { text-align: center; margin-bottom: 40px; }
            .brand img { height: 60px; }
            @media print {
              .grid { gap: 20px; }
              .qr-card { border: 1px solid #000; }
            }
          </style>
        </head>
        <body>
          <div class="brand">
            <h1 style="color: #C8102E;">Fatih Belediyesi Akıllı Sofra</h1>
            <p>Masa QR Kod Listesi (${activeTables.length} Masa)</p>
          </div>
          <div class="grid">
      `;

      activeTables.forEach(table => {
        const appUrl = `${origin}${window.location.pathname}#/menu?table=${table.tableNo}`;
        const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(appUrl)}`;
        html += `
          <div class="qr-card">
            <h2 class="qr-title">Masa ${table.tableNo}</h2>
            <img src="${qrImageUrl}" alt="QR" />
            <p class="qr-subtitle">Sipariş vermek için okutun</p>
          </div>
        `;
      });

      html += `
          </div>
          <script>
            // Wait for images to load before printing
            window.onload = () => {
              setTimeout(() => {
                window.print();
                // window.close(); // Optional: close after print
              }, 1000);
            };
          </script>
        </body>
        </html>
      `;

      printWindow.document.write(html);
      printWindow.document.close();
    });
  }
}
