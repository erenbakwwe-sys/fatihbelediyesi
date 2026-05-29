import { store } from '../store.js';
import { formatPrice, showToast, generateId } from '../utils.js';

export function render() {
  const tableNo = store.state.currentTable;
  if (!tableNo) {
    return `<div style="padding: 2rem; text-align: center;">Masa bilgisi bulunamadı. Lütfen masanızdaki QR kodu okutun.</div>`;
  }

  const order = store.getPendingSplitOrder(tableNo);

  if (!order) {
    return `
      <div style="padding: 2rem; text-align: center;">
        <h3 style="margin-bottom:1rem;">Bu masada ödeme bekleyen sipariş bulunmuyor.</h3>
        <a href="#/menu" class="btn btn-primary">Menüye Git</a>
      </div>
    `;
  }

  const perPerson = order.total / order.splitCount;

  return `
    <div class="page-container" style="padding-bottom: 80px;">
      <div class="page-header" style="text-align: center; margin-bottom: 1.5rem;">
        <h1 style="font-size: 1.5rem; color: var(--color-primary);">Ödemeye Katıl</h1>
        <p style="color: var(--color-text-muted); font-size: 0.95rem;">Masa ${tableNo}</p>
      </div>

      <div class="card" style="margin-bottom: 1.5rem;">
        <div class="card-header" style="background: rgba(200, 16, 46, 0.05);">
          <h3 style="margin: 0; font-size: 1.1rem; display: flex; align-items: center; gap: 8px;">
            <span class="material-icons-round text-primary">receipt_long</span>
            Ortak Sipariş Detayı
          </h3>
        </div>
        <div class="card-body">
          <ul style="list-style: none; padding: 0; margin: 0 0 1rem 0;">
            ${order.items.map(item => `
              <li style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #eee;">
                <span>${item.quantity}x ${item.name}</span>
                <span style="font-weight: 600;">₺${formatPrice(item.price * item.quantity)}</span>
              </li>
            `).join('')}
          </ul>
          <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 1.1rem; padding-top: 10px;">
            <span>Toplam Tutar:</span>
            <span>₺${formatPrice(order.total)}</span>
          </div>
          <div style="text-align: center; margin-top: 1rem; color: var(--color-text-muted); font-size: 0.9rem;">
            Toplam ${order.splitCount} Kişi / Ödeyen: ${order.paidCount || 0}
          </div>
        </div>
      </div>

      <div style="background: linear-gradient(135deg, rgba(200,16,46,0.05), rgba(200,16,46,0.1)); border: 2px solid rgba(200,16,46,0.2); border-radius: 16px; padding: 1.5rem; text-align: center; margin-bottom: 1.5rem;">
        <p style="font-size: 0.95rem; font-weight: 600; color: #555; margin-bottom: 5px;">Ödemeniz Gereken Tutar</p>
        <div style="font-size: 2.2rem; font-weight: 800; color: var(--color-primary);">₺${formatPrice(perPerson)}</div>
      </div>

      <button id="btn-join-pay" class="btn btn-primary btn-lg" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;">
        <span class="material-icons-round">contactless</span>
        Temassız Öde
      </button>

      <!-- Success Overlay -->
      <div id="join-success-overlay" style="display:none; position:fixed; inset:0; z-index:9999; background:rgba(26,26,46,0.92); flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:2rem;">
        <div style="width:100px; height:100px; border-radius:50%; background:linear-gradient(135deg,#16a34a,#22c55e); display:flex; align-items:center; justify-content:center; margin-bottom:1.5rem; animation:successPop 0.6s cubic-bezier(0.22,1,0.36,1); box-shadow:0 0 60px rgba(34,197,94,0.4);">
          <span class="material-icons-round" style="font-size:3rem; color:#fff;">check</span>
        </div>
        <h2 style="color:#fff; font-size:1.5rem; font-weight:700; margin-bottom:0.5rem;" id="join-success-title">Ödeme Başarılı!</h2>
        <p style="color:rgba(255,255,255,0.7); font-size:0.95rem; margin-bottom:2rem;" id="join-success-desc">Payınızı ödediniz.</p>
        <p style="color:rgba(255,255,255,0.5); font-size:0.85rem;">Menüye yönlendiriliyorsunuz...</p>
      </div>
    </div>
  `;
}

export function init() {
  const btnPay = document.getElementById('btn-join-pay');
  if (!btnPay) return;

  const tableNo = store.state.currentTable;
  const order = store.getPendingSplitOrder(tableNo);

  if (order) {
    // If order gets fulfilled by someone else while we look at it
    const unsubscribe = store.subscribe(() => {
      const currentOrder = store.state.orders.find(o => o.id === order.id);
      if (currentOrder && currentOrder.status === 'pending') {
        if (typeof unsubscribe === 'function') unsubscribe();
        showToast('Siparişin tüm ödemeleri tamamlandı ve mutfağa iletildi!', 'success');
        window.location.hash = '#/menu';
      }
    });
  }

  btnPay.addEventListener('click', async () => {
    if (!order) return;
    
    btnPay.disabled = true;
    btnPay.innerHTML = `<span class="material-icons-round" style="animation: spin 1s linear infinite;">autorenew</span> İşleniyor...`;

    // Simulate payment delay
    setTimeout(async () => {
      const isCompleted = await store.joinSplitPayment(order.id);
      
      const overlay = document.getElementById('join-success-overlay');
      const title = document.getElementById('join-success-title');
      const desc = document.getElementById('join-success-desc');
      
      if (overlay) {
        if (isCompleted) {
          title.textContent = "Hesap Tamamlandı!";
          desc.textContent = "Siparişiniz mutfağa iletildi. Afiyet olsun!";
        } else {
          title.textContent = "Ödeme Başarılı!";
          desc.textContent = "Diğer arkadaşlarınızın ödemesi bekleniyor...";
        }
        overlay.style.display = 'flex';
        
        setTimeout(() => {
          overlay.style.display = 'none';
          window.location.hash = isCompleted ? '#/scratch' : '#/menu';
        }, 3000);
      }
    }, 1500);
  });
}
