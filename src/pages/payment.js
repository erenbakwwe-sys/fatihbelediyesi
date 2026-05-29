// ─── Payment Page ─── Fatih Akıllı Sofra
// NFC, Credit Card, Cash payment methods with animations

import { store } from '../store.js';
import { formatPrice, showToast, generateId } from '../utils.js';

export function render() {
  const cart = store.cart || [];
  const total = store.getCartTotal ? store.getCartTotal() : 0;

  return `
    <div class="payment-page" style="padding-bottom: 3rem; max-width: 600px; margin: 0 auto;">

      <!-- ═══ HEADER ═══ -->
      <div style="text-align: center; padding: 1.5rem 1rem 1rem;">
        <h1 style="font-size: 1.6rem; font-weight: 800; color: #1A1A2E; margin-bottom: 0.3rem;">
          <span class="material-icons-round" style="vertical-align: middle; margin-right: 0.3rem; color: #C8102E;">payment</span>
          Ödeme
        </h1>
        <p class="text-muted" style="font-size: 0.88rem;">Ödeme yönteminizi seçin</p>
      </div>

      <!-- ═══ ORDER SUMMARY ═══ -->
      <div style="padding: 0 1rem 1rem;">
        <div class="card" style="border-radius: 14px; padding: 1.2rem; background: #f8f9fa; border: 1px solid #eee;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem;">
            <span style="font-weight: 600; color: #1A1A2E; font-size: 0.95rem;">Sipariş Özeti</span>
            <span class="badge badge-success" style="font-size: 0.78rem;">${cart.length} ürün</span>
          </div>
          ${cart.map(entry => `
            <div style="display: flex; justify-content: space-between; padding: 0.35rem 0; font-size: 0.88rem; color: #666;">
              <span>${entry.name} × ${entry.quantity}</span>
              <span style="font-weight: 600;">${formatPrice(entry.price * entry.quantity)}</span>
            </div>
          `).join('')}
          <div style="height: 1px; background: #ddd; margin: 0.6rem 0;"></div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 1.1rem; font-weight: 700; color: #1A1A2E;">Toplam</span>
            <span style="font-size: 1.25rem; font-weight: 800; color: #C8102E;">${formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <!-- ═══ PAYMENT METHODS ═══ -->
      <div id="payment-methods" style="padding: 0 1rem;">
        <p style="font-weight: 600; color: #1A1A2E; margin-bottom: 0.8rem; font-size: 0.95rem;">Ödeme Yöntemi</p>

        <!-- 1. NFC -->
        <div class="payment-method-card selected" data-method="nfc" style="
          border: 2px solid #C8102E; border-radius: 16px; padding: 1.2rem;
          margin-bottom: 0.8rem; cursor: pointer; position: relative;
          background: linear-gradient(135deg, rgba(200,16,46,0.03), rgba(200,16,46,0.08));
          transition: all 0.3s;
        ">
          <div class="badge" style="
            position: absolute; top: -8px; right: 12px;
            background: #C8102E; color: #fff;
            padding: 0.2rem 0.7rem; border-radius: 50px;
            font-size: 0.72rem; font-weight: 700;
          ">ÖNERİLEN</div>
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="
              width: 52px; height: 52px; border-radius: 14px;
              background: linear-gradient(135deg, #C8102E, #e8334e);
              display: flex; align-items: center; justify-content: center;
              box-shadow: 0 4px 14px rgba(200,16,46,0.3);
            ">
              <span class="material-icons-round" style="color: #fff; font-size: 1.6rem;">contactless</span>
            </div>
            <div style="flex: 1;">
              <div style="font-size: 1.02rem; font-weight: 700; color: #1A1A2E;">NFC Temassız Ödeme</div>
              <div style="font-size: 0.82rem; color: #888; margin-top: 0.2rem;">Kartınızı veya telefonunuzu cihaza yaklaştırın, ödemeniz anında tamamlansın</div>
            </div>
            <span class="material-icons-round payment-check" style="color: #C8102E; font-size: 1.4rem;">radio_button_checked</span>
          </div>
        </div>

        <!-- 2. Credit Card -->
        <div class="payment-method-card" data-method="card" style="
          border: 2px solid #e0e0e0; border-radius: 16px; padding: 1.2rem;
          margin-bottom: 0.8rem; cursor: pointer;
          background: #fff; transition: all 0.3s;
        ">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="
              width: 52px; height: 52px; border-radius: 14px;
              background: linear-gradient(135deg, #1A1A2E, #2a2a4e);
              display: flex; align-items: center; justify-content: center;
            ">
              <span class="material-icons-round" style="color: #fff; font-size: 1.6rem;">credit_card</span>
            </div>
            <div style="flex: 1;">
              <div style="font-size: 1.02rem; font-weight: 700; color: #1A1A2E;">Kredi / Banka Kartı</div>
              <div style="font-size: 0.82rem; color: #888; margin-top: 0.2rem;">Kart bilgilerinizle güvenli ödeme</div>
            </div>
            <span class="material-icons-round payment-check" style="color: #ccc; font-size: 1.4rem;">radio_button_unchecked</span>
          </div>
        </div>

        <!-- 3. Cash -->
        <div class="payment-method-card" data-method="cash" style="
          border: 2px solid #e0e0e0; border-radius: 16px; padding: 1.2rem;
          margin-bottom: 0.8rem; cursor: pointer;
          background: #fff; transition: all 0.3s;
        ">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="
              width: 52px; height: 52px; border-radius: 14px;
              background: linear-gradient(135deg, #16a34a, #22c55e);
              display: flex; align-items: center; justify-content: center;
            ">
              <span class="material-icons-round" style="color: #fff; font-size: 1.6rem;">payments</span>
            </div>
            <div style="flex: 1;">
              <div style="font-size: 1.02rem; font-weight: 700; color: #1A1A2E;">Nakit (Garson Onaylı)</div>
              <div style="font-size: 0.82rem; color: #888; margin-top: 0.2rem;">Ödemenizi garsonunuza nakit yapın</div>
            </div>
            <span class="material-icons-round payment-check" style="color: #ccc; font-size: 1.4rem;">radio_button_unchecked</span>
          </div>
        </div>
      </div>

      <!-- ═══ PAYMENT DETAIL AREA ═══ -->
      <div id="payment-detail" style="padding: 0.5rem 1rem 0;">
        <!-- NFC default -->
        ${renderNFCDetail()}
      </div>

      <!-- ═══ SUCCESS OVERLAY (hidden) ═══ -->
      <div id="payment-success-overlay" style="
        display: none;
        position: fixed; inset: 0; z-index: 9999;
        background: rgba(26,26,46,0.92);
        flex-direction: column; align-items: center; justify-content: center;
        text-align: center; padding: 2rem;
      ">
        <div class="payment-success-circle" style="
          width: 100px; height: 100px; border-radius: 50%;
          background: linear-gradient(135deg, #16a34a, #22c55e);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1.5rem;
          animation: successPop 0.6s cubic-bezier(0.22,1,0.36,1);
          box-shadow: 0 0 60px rgba(34,197,94,0.4);
        ">
          <span class="material-icons-round" style="font-size: 3rem; color: #fff;">check</span>
        </div>
        <h2 style="color: #fff; font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem;">Ödeme Başarılı!</h2>
        <p style="color: rgba(255,255,255,0.7); font-size: 0.95rem; margin-bottom: 2rem;">Ödemeniz başarıyla tamamlandı</p>
        <p style="color: rgba(255,255,255,0.5); font-size: 0.85rem;">Kazı-kazan kartınıza yönlendiriliyorsunuz...</p>
      </div>
    </div>

    <style>
      .payment-method-card:hover {
        box-shadow: 0 4px 16px rgba(0,0,0,0.08);
      }
      .payment-method-card.selected {
        border-color: #C8102E !important;
        background: linear-gradient(135deg, rgba(200,16,46,0.03), rgba(200,16,46,0.08)) !important;
      }
      .payment-method-card.selected .payment-check {
        color: #C8102E !important;
      }

      /* NFC Pulse Animation */
      @keyframes nfcPulse {
        0% { transform: scale(1); opacity: 0.5; }
        100% { transform: scale(2.5); opacity: 0; }
      }
      .nfc-ripple {
        position: absolute;
        width: 80px; height: 80px;
        border-radius: 50%;
        border: 3px solid #C8102E;
        animation: nfcPulse 2s infinite;
      }
      .nfc-ripple:nth-child(2) { animation-delay: 0.5s; }
      .nfc-ripple:nth-child(3) { animation-delay: 1s; }

      /* Success animation */
      @keyframes successPop {
        0% { transform: scale(0); opacity: 0; }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes successCheckmark {
        0% { stroke-dashoffset: 50; }
        100% { stroke-dashoffset: 0; }
      }

      /* Processing spinner */
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      .payment-spinner {
        width: 40px; height: 40px;
        border: 4px solid #e8e8e8;
        border-top: 4px solid #C8102E;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      /* Card form styling */
      .payment-card-input {
        width: 100%;
        padding: 0.8rem 1rem;
        border: 2px solid #e0e0e0;
        border-radius: 12px;
        font-size: 0.95rem;
        transition: border-color 0.3s;
        box-sizing: border-box;
      }
      .payment-card-input:focus {
        border-color: #C8102E;
        outline: none;
        box-shadow: 0 0 0 3px rgba(200,16,46,0.1);
      }
    </style>
  `;
}

function renderNFCDetail() {
  return `
    <div id="nfc-section" class="card" style="
      border-radius: 16px; padding: 2rem; text-align: center;
      background: linear-gradient(135deg, #fafafa, #fff);
    ">
      <div style="position: relative; display: inline-flex; align-items: center; justify-content: center; width: 120px; height: 120px; margin: 0 auto 1.5rem;">
        <div class="nfc-ripple"></div>
        <div class="nfc-ripple"></div>
        <div class="nfc-ripple"></div>
        <span class="material-icons-round" style="font-size: 3.5rem; color: #C8102E; position: relative; z-index: 1;">contactless</span>
      </div>
      <h3 style="font-size: 1.1rem; font-weight: 700; color: #1A1A2E; margin-bottom: 0.5rem;">
        Cihazınızı ödeme terminaline yaklaştırın
      </h3>
      <p class="text-muted" style="font-size: 0.88rem; margin-bottom: 1.5rem;">
        NFC özellikli kartınızı veya telefonunuzu terminale yaklaştırarak ödemenizi tamamlayın
      </p>
      <button id="nfc-pay-btn" class="btn btn-primary btn-lg" style="
        padding: 0.9rem 2.5rem; border-radius: 14px; font-size: 1rem;
        display: inline-flex; align-items: center; gap: 0.5rem;
      ">
        <span class="material-icons-round">nfc</span>
        Ödemeyi Başlat
      </button>
    </div>
  `;
}

function renderCardDetail() {
  return `
    <div id="card-section" class="card" style="
      border-radius: 16px; padding: 1.5rem;
      background: #fff;
    ">
      <div class="form-group" style="margin-bottom: 1rem;">
        <label class="form-label" style="font-size: 0.85rem; font-weight: 600; color: #555;">Kart Numarası</label>
        <input type="text" class="payment-card-input" placeholder="0000 0000 0000 0000" maxlength="19" id="card-number" />
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; margin-bottom: 1rem;">
        <div class="form-group">
          <label class="form-label" style="font-size: 0.85rem; font-weight: 600; color: #555;">Son Kullanma</label>
          <input type="text" class="payment-card-input" placeholder="AA/YY" maxlength="5" id="card-expiry" />
        </div>
        <div class="form-group">
          <label class="form-label" style="font-size: 0.85rem; font-weight: 600; color: #555;">CVV</label>
          <input type="text" class="payment-card-input" placeholder="•••" maxlength="3" id="card-cvv" />
        </div>
      </div>
      <button id="card-pay-btn" class="btn btn-primary btn-lg" style="
        width: 100%; padding: 0.9rem; border-radius: 14px; font-size: 1rem;
        display: flex; align-items: center; justify-content: center; gap: 0.5rem;
      ">
        <span class="material-icons-round">lock</span>
        Ödemeyi Tamamla
      </button>
    </div>
  `;
}

function renderCashDetail() {
  return `
    <div id="cash-section" class="card" style="
      border-radius: 16px; padding: 2rem; text-align: center;
      background: linear-gradient(135deg, rgba(22,163,74,0.04), rgba(22,163,74,0.08));
      border: 1px solid rgba(22,163,74,0.15);
    ">
      <div style="
        width: 72px; height: 72px; border-radius: 50%;
        background: linear-gradient(135deg, #16a34a, #22c55e);
        display: flex; align-items: center; justify-content: center;
        margin: 0 auto 1.2rem;
        box-shadow: 0 6px 20px rgba(34,197,94,0.3);
      ">
        <span class="material-icons-round" style="font-size: 2rem; color: #fff;">room_service</span>
      </div>
      <h3 style="font-size: 1.1rem; font-weight: 700; color: #1A1A2E; margin-bottom: 0.5rem;">
        Garson Bilgilendirildi
      </h3>
      <p class="text-muted" style="font-size: 0.88rem; margin-bottom: 1.5rem;">
        Garson bilgilendirildi, ödemenizi masanızda yapabilirsiniz
      </p>
      <button id="cash-confirm-btn" class="btn btn-primary btn-lg" style="
        padding: 0.9rem 2.5rem; border-radius: 14px; font-size: 1rem;
        display: inline-flex; align-items: center; gap: 0.5rem;
        background: linear-gradient(135deg, #16a34a, #22c55e);
        border: none;
      ">
        <span class="material-icons-round">check_circle</span>
        Onayla
      </button>
    </div>
  `;
}

function showSuccess() {
  const overlay = document.getElementById('payment-success-overlay');
  if (overlay) {
    overlay.style.display = 'flex';
    setTimeout(() => {
      window.location.hash = '#/scratch';
    }, 2500);
  }
}

export function init() {
  const methodsContainer = document.getElementById('payment-methods');
  const detailArea = document.getElementById('payment-detail');
  let selectedMethod = 'nfc';

  // Method selection
  if (methodsContainer) {
    methodsContainer.addEventListener('click', (e) => {
      const card = e.target.closest('.payment-method-card');
      if (!card) return;

      const method = card.dataset.method;
      if (method === selectedMethod) return;
      selectedMethod = method;

      // Update active states
      methodsContainer.querySelectorAll('.payment-method-card').forEach(c => {
        c.classList.remove('selected');
        const check = c.querySelector('.payment-check');
        if (check) {
          check.textContent = 'radio_button_unchecked';
          check.style.color = '#ccc';
        }
      });

      card.classList.add('selected');
      const check = card.querySelector('.payment-check');
      if (check) {
        check.textContent = 'radio_button_checked';
        check.style.color = '#C8102E';
      }

      // Update detail area
      if (detailArea) {
        detailArea.style.opacity = '0';
        detailArea.style.transform = 'translateY(10px)';
        detailArea.style.transition = 'all 0.3s';

        setTimeout(() => {
          if (method === 'nfc') detailArea.innerHTML = renderNFCDetail();
          else if (method === 'card') detailArea.innerHTML = renderCardDetail();
          else if (method === 'cash') detailArea.innerHTML = renderCashDetail();

          bindPaymentActions();
          setTimeout(() => {
            detailArea.style.opacity = '1';
            detailArea.style.transform = 'translateY(0)';
          }, 50);
        }, 300);
      }
    });
  }

  bindPaymentActions();

  function bindPaymentActions() {
    async function processPayment(method, btnEl) {
      const note = sessionStorage.getItem('fatih_order_note') || '';
      const orderId = generateId('ORD');
      
      if (store.placeOrder) {
        try {
          await store.placeOrder(orderId, method, note);
          sessionStorage.removeItem('fatih_order_note');
          showSuccess();
        } catch (e) {
          if (btnEl) {
            btnEl.disabled = false;
            btnEl.innerHTML = 'Hata! Tekrar Dene';
          }
        }
      } else {
        showSuccess();
      }
    }

    // NFC Payment
    const nfcBtn = document.getElementById('nfc-pay-btn');
    if (nfcBtn) {
      nfcBtn.addEventListener('click', () => {
        nfcBtn.disabled = true;
        nfcBtn.innerHTML = `
          <div class="payment-spinner" style="width: 20px; height: 20px; border-width: 3px;"></div>
          İşleniyor...
        `;

        setTimeout(() => {
          processPayment('nfc', nfcBtn);
        }, 2000);
      });
    }

    // Card Payment
    const cardBtn = document.getElementById('card-pay-btn');
    if (cardBtn) {
      cardBtn.addEventListener('click', () => {
        cardBtn.disabled = true;
        cardBtn.innerHTML = `
          <div class="payment-spinner" style="width: 20px; height: 20px; border-width: 3px;"></div>
          İşleniyor...
        `;

        setTimeout(() => {
          processPayment('card', cardBtn);
        }, 2000);
      });
    }

    // Card number formatting
    const cardNumber = document.getElementById('card-number');
    if (cardNumber) {
      cardNumber.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
        v = v.match(/.{1,4}/g)?.join(' ') || v;
        e.target.value = v;
      });
    }

    // Expiry formatting
    const cardExpiry = document.getElementById('card-expiry');
    if (cardExpiry) {
      cardExpiry.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2);
        e.target.value = v;
      });
    }

    // Cash Payment
    const cashBtn = document.getElementById('cash-confirm-btn');
    if (cashBtn) {
      cashBtn.addEventListener('click', () => {
        cashBtn.disabled = true;
        cashBtn.innerHTML = `İşleniyor...`;
        processPayment('cash', cashBtn);
      });
    }
  }
}
