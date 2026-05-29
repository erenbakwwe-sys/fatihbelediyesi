/* ============================================================
   FATIH AKILLI SOFRA — Kazı-Kazan (Scratch Card) Page
   Interactive Canvas-based Scratch Card with Lead Generation
   ============================================================ */

import store from '../store.js';
import { generateId, showToast } from '../utils.js';
import { PRIZE_POOL } from '../data.js';

export default {
  render() {
    return `
      <section class="scratch-card-section container reveal revealed">
        <div class="scratch-card-wrapper card">
          <div class="card-header text-center">
            <h2 class="scratch-title">Mutfaktan Sürpriz Hediye!</h2>
            <p class="scratch-subtitle">Fatih Belediyesi öncülüğünde, siparişinize özel sürpriz hediyenizi açın!</p>
          </div>
          
          <div class="card-body">
            <div id="scratch-confetti-container" class="confetti-container"></div>
            
            <div class="scratch-game-area" id="gift-area">
              <div id="gift-box-container" style="
                cursor: pointer; padding: 2rem 0; text-align: center;
                transition: all 0.3s;
              ">
                <div id="gift-box" style="
                  font-size: 6rem; line-height: 1; text-shadow: 0 10px 20px rgba(0,0,0,0.15);
                  animation: float 3s ease-in-out infinite; display: inline-block;
                ">🎁</div>
                <div class="scratch-instruction text-center" style="margin-top: 1.5rem;">
                  <span class="material-icons-round" style="vertical-align: middle;">touch_app</span>
                  <span>Hediyenizi görmek için pakete dokunun!</span>
                </div>
              </div>

              <div id="gift-result-container" style="display: none; padding: 2rem 0; text-align: center; animation: scaleIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
                <!-- Result gets injected here -->
              </div>
            </div>

            <!-- Lead Capture Form (Initially Hidden) -->
            <div id="scratch-lead-form-wrap" class="scratch-lead-form-container" style="display: none; margin-top: 1rem;">
              <div class="lead-header text-center">
                <h3 id="reward-celebration-title" style="color: #C8102E; font-weight: 800; margin-bottom: 0.5rem;">Tebrikler!</h3>
                <p>Hediyenizi size özel kupon koduyla almak için bilgilerinizi eksiksiz doldurun.</p>
              </div>
              
              <form id="scratch-claim-form" class="lead-form">
                <div class="form-group">
                  <label class="form-label" for="claim-name">Ad Soyad</label>
                  <input type="text" id="claim-name" class="form-input" placeholder="Ahmet Yılmaz" required />
                </div>
                <div class="form-group">
                  <label class="form-label" for="claim-phone">Telefon Numarası</label>
                  <input type="tel" id="claim-phone" class="form-input" placeholder="0535XXXXXXX" pattern="[0-9]{11}" title="Lütfen 11 haneli telefon numaranızı girin (05XXXXXXXXX)" required />
                </div>
                <div class="form-group">
                  <label class="form-label" for="claim-email">E-Posta Adresi</label>
                  <input type="email" id="claim-email" class="form-input" placeholder="ahmet@example.com" required />
                </div>
                <div class="form-group">
                  <label class="form-label" for="claim-birthday">Doğum Tarihi</label>
                  <input type="date" id="claim-birthday" class="form-input" required />
                </div>
                <button type="submit" class="btn btn-primary btn-block">
                  <span class="material-icons-round">redeem</span>
                  <span>Kupon Kodunu Oluştur ve Kaydet</span>
                </button>
              </form>
            </div>

            <!-- Failure Action Area (Initially Hidden) -->
            <div id="scratch-failure-wrap" class="scratch-failure-container text-center" style="display: none; margin-top: 1rem;">
              <p style="margin-bottom: 1rem; color: #666;">Masa ${store.state.currentTable || 1} için bu seferlik bir hediye çıkmadı. Afiyet olsun!</p>
              <a href="#/menu" class="btn btn-primary">
                <span class="material-icons-round">restaurant_menu</span>
                <span>Menüye Dön</span>
              </a>
            </div>

            <!-- Saved Reward Receipt Area (Initially Hidden) -->
            <div id="scratch-saved-wrap" class="scratch-saved-container text-center" style="display: none; margin-top: 1rem;">
              <span class="material-icons-round success-icon text-success" style="font-size: 4rem;">check_circle</span>
              <h3 style="margin-top: 0.5rem;">Kuponunuz Kaydedildi!</h3>
              <p style="margin-bottom: 20px; color: #666; font-size: 0.9rem;">Kupon kodunuz adınıza tanımlanmıştır. Görevliye göstererek talep edebilirsiniz.</p>
              
              <div class="promo-coupon-card" style="background: #f8f9fa; border: 2px dashed #C8102E; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
                <div class="coupon-title" id="receipt-prize-name" style="font-size: 1.2rem; font-weight: 800; color: #1A1A2E; margin-bottom: 0.5rem;">Hediye Adı</div>
                <div class="coupon-code-wrap" style="margin: 1rem 0;">
                  <span class="coupon-label" style="font-size: 0.75rem; color: #888;">KUPON KODU</span>
                  <div class="coupon-code" id="receipt-coupon-code" style="font-size: 1.5rem; font-weight: 900; color: #C8102E; letter-spacing: 2px;">APO-XXXXXX</div>
                </div>
                <div class="coupon-details" style="font-size: 0.85rem; color: #666;">
                  <span id="receipt-customer-name">İsim Soyad</span> • <span id="receipt-customer-phone">Telefon</span>
                </div>
              </div>

              <a href="#/" class="btn btn-primary">
                <span class="material-icons-round">home</span>
                <span>Ana Sayfaya Dön</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  init() {
    this.confettiActive = false;
    this.opened = false;
    this.prize = null;
    this.couponId = generateId('APO');
    
    // 1. Determine Win/Loss (40% win rate)
    const isWinner = Math.random() < 0.4;
    if (isWinner) {
      const randomIdx = Math.floor(Math.random() * PRIZE_POOL.length);
      this.prize = PRIZE_POOL[randomIdx];
    }

    // 2. Gift Box click handler
    const giftBoxContainer = document.getElementById('gift-box-container');
    if (giftBoxContainer) {
      giftBoxContainer.addEventListener('click', () => {
        if (this.opened) return;
        this.opened = true;
        
        const giftBox = document.getElementById('gift-box');
        
        // Shake animation
        giftBox.style.animation = 'none';
        giftBox.style.transformOrigin = 'center bottom';
        giftBox.animate([
          { transform: 'rotate(0deg)' },
          { transform: 'rotate(-10deg)' },
          { transform: 'rotate(10deg)' },
          { transform: 'rotate(-10deg)' },
          { transform: 'rotate(10deg)' },
          { transform: 'rotate(0deg)' }
        ], { duration: 500, iterations: 2 });
        
        // Reveal after shake
        setTimeout(() => {
          giftBoxContainer.style.opacity = '0';
          giftBoxContainer.style.transform = 'scale(0.8)';
          
          setTimeout(() => {
            giftBoxContainer.style.display = 'none';
            this.revealPrize();
          }, 300);
        }, 1000);
      });
    }

    // 3. Form Submit handler
    const form = document.getElementById('scratch-claim-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('claim-name').value;
        const phone = document.getElementById('claim-phone').value;
        const email = document.getElementById('claim-email').value;
        const birthday = document.getElementById('claim-birthday').value;

        const rewardData = {
          tableNo: store.state.currentTable || 1,
          customerName: name,
          customerPhone: phone,
          customerEmail: email,
          customerBirthday: birthday,
          prizeName: this.prize,
          used: false
        };

        try {
          await store.addReward(this.couponId, rewardData);
          
          document.getElementById('scratch-lead-form-wrap').style.display = 'none';
          document.getElementById('receipt-prize-name').textContent = this.prize;
          document.getElementById('receipt-coupon-code').textContent = this.couponId;
          document.getElementById('receipt-customer-name').textContent = name;
          document.getElementById('receipt-customer-phone').textContent = phone;
          document.getElementById('scratch-saved-wrap').style.display = 'block';
          
          this.stopConfetti();
        } catch (error) {
          console.error(error);
        }
      });
    }
  },

  revealPrize() {
    const resultContainer = document.getElementById('gift-result-container');
    if (!resultContainer) return;
    
    resultContainer.style.display = 'block';
    
    if (this.prize) {
      resultContainer.innerHTML = `
        <span class="material-icons-round" style="font-size: 5rem; color: #f59e0b; margin-bottom: 1rem;">emoji_events</span>
        <div style="font-size: 1.5rem; font-weight: 900; color: #C8102E;">${this.prize}</div>
      `;
      this.triggerConfetti();
      document.getElementById('scratch-lead-form-wrap').style.display = 'block';
    } else {
      resultContainer.innerHTML = `
        <span class="material-icons-round" style="font-size: 5rem; color: #9ca3af; margin-bottom: 1rem;">sentiment_dissatisfied</span>
        <div style="font-size: 1.5rem; font-weight: 800; color: #1A1A2E;">Yine Bekleriz</div>
      `;
      document.getElementById('scratch-failure-wrap').style.display = 'block';
    }
  },

  triggerConfetti() {
    const container = document.getElementById('scratch-confetti-container');
    if (!container) return;
    this.confettiActive = true;
    
    const colors = ['#C8102E', '#1A1A2E', '#FFD700', '#2E8B57', '#4682B4'];
    
    for (let i = 0; i < 60; i++) {
      const p = document.createElement('div');
      p.className = 'confetti-particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      p.style.width = Math.random() * 8 + 4 + 'px';
      p.style.height = Math.random() * 8 + 4 + 'px';
      p.style.animationDelay = Math.random() * 2 + 's';
      p.style.animationDuration = Math.random() * 3 + 2 + 's';
      container.appendChild(p);
    }
  },

  stopConfetti() {
    const container = document.getElementById('scratch-confetti-container');
    if (container) container.innerHTML = '';
    this.confettiActive = false;
  },

  destroy() {
    this.stopConfetti();
  }
};
