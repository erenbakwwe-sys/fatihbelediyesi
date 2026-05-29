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
      <section class="scratch-card-section container reveal">
        <div class="scratch-card-wrapper card">
          <div class="card-header text-center">
            <h2 class="scratch-title">Mutfaktan Sürpriz Hediye!</h2>
            <p class="scratch-subtitle">Fatih Belediyesi öncülüğünde, Akıllı Sofra siparişinize özel Kazı-Kazan hakkı kazandınız.</p>
          </div>
          
          <div class="card-body">
            <!-- Confetti Overlay Container -->
            <div id="scratch-confetti-container" class="confetti-container"></div>
            
            <div class="scratch-game-area">
              <!-- Scratch Canvas Card -->
              <div class="scratch-canvas-container" id="canvas-container">
                <!-- Underneath content (what is revealed) -->
                <div class="scratch-underneath" id="scratch-result">
                  <div class="result-placeholder">Yükleniyor...</div>
                </div>
                <canvas id="scratch-canvas" width="360" height="220"></canvas>
              </div>
              
              <div class="scratch-instruction text-center" id="scratch-instruction">
                <span class="material-icons-round">draw</span>
                <span>Kartın üzerini parmağınız veya mouse ile kazıyarak hediyenizi bulun!</span>
              </div>
            </div>

            <!-- Lead Capture Form (Initially Hidden) -->
            <div id="scratch-lead-form-wrap" class="scratch-lead-form-container" style="display: none;">
              <div class="lead-header text-center">
                <span class="material-icons-round reward-icon text-primary">emoji_events</span>
                <h3 id="reward-celebration-title">Tebrikler!</h3>
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
            <div id="scratch-failure-wrap" class="scratch-failure-container text-center" style="display: none;">
              <span class="material-icons-round sad-icon text-muted">sentiment_dissatisfied</span>
              <h3>Şansınız Yaver Gitmedi!</h3>
              <p>Masa ${store.state.currentTable || 1} için bu seferlik bir hediye çıkmadı. Afiyet olsun!</p>
              <a href="#/menu" class="btn btn-primary" style="margin-top: 20px;">
                <span class="material-icons-round">restaurant_menu</span>
                <span>Menüye Dön</span>
              </a>
            </div>

            <!-- Saved Reward Receipt Area (Initially Hidden) -->
            <div id="scratch-saved-wrap" class="scratch-saved-container text-center" style="display: none;">
              <span class="material-icons-round success-icon text-success">check_circle</span>
              <h3>Kuponunuz Kaydedildi!</h3>
              <p style="margin-bottom: 20px;">Bu kupon kodu Fatih Belediyesi Akıllı Sofra sisteminde adınıza tanımlanmıştır. Servis görevlisine göstererek hediyenizi talep edebilirsiniz.</p>
              
              <div class="promo-coupon-card">
                <div class="coupon-title" id="receipt-prize-name">Hediye Adı</div>
                <div class="coupon-code-wrap">
                  <span class="coupon-label">KUPON KODU</span>
                  <div class="coupon-code" id="receipt-coupon-code">APO-XXXXXX</div>
                </div>
                <div class="coupon-details">
                  <span id="receipt-customer-name">İsim Soyad</span> • <span id="receipt-customer-phone">Telefon</span>
                </div>
              </div>

              <a href="#/" class="btn btn-primary" style="margin-top: 30px;">
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
    this.scratched = false;
    this.prize = null;
    this.couponId = generateId('APO');
    
    // 1. Determine Win/Loss (40% win rate)
    const isWinner = Math.random() < 0.4;
    
    if (isWinner) {
      // Pick random prize
      const randomIdx = Math.floor(Math.random() * PRIZE_POOL.length);
      this.prize = PRIZE_POOL[randomIdx];
    }

    // 2. Render underneath result content
    const resultElement = document.getElementById('scratch-result');
    if (resultElement) {
      if (this.prize) {
        resultElement.innerHTML = `
          <div class="scratch-win-reveal">
            <span class="material-icons-round gold-star bounce">emoji_events</span>
            <div class="reveal-prize-title">Tebrikler!</div>
            <div class="reveal-prize-name">${this.prize}</div>
          </div>
        `;
      } else {
        resultElement.innerHTML = `
          <div class="scratch-lose-reveal">
            <span class="material-icons-round silver-star">sentiment_neutral</span>
            <div class="reveal-prize-title">Teşekkürler!</div>
            <div class="reveal-prize-name">Yine Deneyin</div>
          </div>
        `;
      }
    }

    // 3. Initialize Canvas
    const canvas = document.getElementById('scratch-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Draw silver/gray overlay coating
    this.drawCoating(canvas, ctx);

    // Scratch event bindings
    let isDrawing = false;

    const getMousePos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const scratch = (e) => {
      if (!isDrawing || this.scratched) return;
      e.preventDefault();

      const pos = getMousePos(e);
      
      // Use 'destination-out' to clear the canvas on path
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 25, 0, Math.PI * 2);
      ctx.fill();

      // Check scratch percent periodically
      this.checkScratchPercent(canvas, ctx);
    };

    const startScratch = (e) => {
      isDrawing = true;
      scratch(e);
    };

    const stopScratch = () => {
      isDrawing = false;
    };

    // Mouse events
    canvas.addEventListener('mousedown', startScratch);
    canvas.addEventListener('mousemove', scratch);
    window.addEventListener('mouseup', stopScratch);

    // Touch events
    canvas.addEventListener('touchstart', startScratch);
    canvas.addEventListener('touchmove', scratch);
    window.addEventListener('touchend', stopScratch);

    // 4. Form Submit handler
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
          
          // Hide form, show receipt
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

  drawCoating(canvas, ctx) {
    ctx.globalCompositeOperation = 'source-over';
    
    // Premium Metallic Gradient coating
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#B0B0B0');
    grad.addColorStop(0.3, '#E0E0E0');
    grad.addColorStop(0.5, '#A0A0A0');
    grad.addColorStop(0.7, '#D8D8D8');
    grad.addColorStop(1, '#8C8C8C');
    
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle patterns (Fatih Belediyesi theme touch)
    ctx.fillStyle = 'rgba(200, 16, 46, 0.08)'; // #C8102E red transparent
    for (let i = 0; i < canvas.width; i += 20) {
      for (let j = 0; j < canvas.height; j += 20) {
        ctx.fillRect(i, j, 4, 4);
      }
    }

    // Top text coating
    ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#1A1A2E'; // secondary dark color
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('FATİH BELEDİYESİ', canvas.width / 2, canvas.height / 2 - 20);
    
    ctx.font = 'bold 16px "Inter", sans-serif';
    ctx.fillStyle = '#C8102E'; // #C8102E primary red
    ctx.fillText('KAZI KAZAN SOFRA', canvas.width / 2, canvas.height / 2 + 10);
    
    ctx.font = '500 11px "Inter", sans-serif';
    ctx.fillStyle = '#666';
    ctx.fillText('HEDİYENİZİ BULMAK İÇİN KAZIYIN', canvas.width / 2, canvas.height / 2 + 35);
  },

  checkScratchPercent(canvas, ctx) {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    let transparentCount = 0;

    // Check transparency in alpha channel
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) {
        transparentCount++;
      }
    }

    const percent = (transparentCount / (pixels.length / 4)) * 100;
    
    // Automatically trigger reveal once scrolled/scratched past 50%
    if (percent > 50 && !this.scratched) {
      this.scratched = true;
      this.revealCard(canvas);
    }
  },

  revealCard(canvas) {
    // Elegant fade out canvas animation
    canvas.style.transition = 'opacity 0.6s ease';
    canvas.style.opacity = '0';
    
    setTimeout(() => {
      canvas.style.display = 'none';
      const instruction = document.getElementById('scratch-instruction');
      if (instruction) instruction.style.display = 'none';

      // 1. Check Win or Loss
      if (this.prize) {
        // Trigger Winner Celebration Confetti
        this.triggerConfetti();
        document.getElementById('scratch-lead-form-wrap').style.display = 'block';
        document.getElementById('reward-celebration-title').innerHTML = `Tebrikler! ${this.prize} Kazandınız!`;
      } else {
        document.getElementById('scratch-failure-wrap').style.display = 'block';
      }
    }, 600);
  },

  // Confetti Animation Engine (CSS-only dynamic bubbles)
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
    if (container) {
      container.innerHTML = '';
    }
    this.confettiActive = false;
  },

  destroy() {
    this.stopConfetti();
  }
};
