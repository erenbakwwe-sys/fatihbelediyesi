// ─── Landing Page ─── Fatih Akıllı Sofra
// Compact mobile-first hero, 3-step process, info cards

export function render() {
  return `
    <!-- ═══════════ HERO SECTION (compact) ═══════════ -->
    <section class="landing-hero" style="
      position: relative;
      min-height: 55vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      overflow: hidden;
    ">
      <div style="
        position: absolute; inset: 0;
        background: url('/images/hero-bg.png') center/cover no-repeat;
        z-index: 0;
      "></div>
      <div style="
        position: absolute; inset: 0;
        background: linear-gradient(180deg, rgba(26,26,46,0.85) 0%, rgba(200,16,46,0.5) 100%);
        z-index: 1;
      "></div>

      <div style="position: relative; z-index: 2; max-width: 520px; padding: 1.5rem;">
        <img src="/images/fatih-belediyesi-logo.png" alt="Fatih Belediyesi" class="reveal"
             style="width: 90px; height: auto; object-fit: contain; margin-bottom: 1rem; filter: drop-shadow(0 4px 16px rgba(0,0,0,0.3));" />

        <h1 class="reveal" style="
          font-size: 2rem; font-weight: 800; color: #fff;
          margin-bottom: 0.4rem; letter-spacing: -0.5px;
        ">Fatih Akıllı Sofra</h1>

        <p class="reveal" style="
          font-size: 0.9rem; color: rgba(255,255,255,0.75);
          margin-bottom: 1.2rem; line-height: 1.5;
        ">M. Ergün Turan Başkanlığında<br>Fatih Belediyesi Dijital Hizmetleri</p>

        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;" class="reveal">
          <button onclick="window.location.hash='#/menu'" style="
            font-size: 14px; padding: 12px 28px;
            border-radius: 50px; border: none; cursor: pointer;
            background: #C8102E; color: #fff; font-weight: 700;
            display: inline-flex; align-items: center; gap: 6px;
            box-shadow: 0 6px 20px rgba(200,16,46,0.4);
            transition: all 0.2s; font-family: inherit;
          ">
            <span class="material-icons-round" style="font-size: 18px;">restaurant_menu</span>
            Menüyü Gör
          </button>
          
          <button onclick="window.location.hash='#/facilities'" style="
            font-size: 14px; padding: 12px 28px;
            border-radius: 50px; border: 2px solid #fff; cursor: pointer;
            background: transparent; color: #fff; font-weight: 700;
            display: inline-flex; align-items: center; gap: 6px;
            transition: all 0.2s; font-family: inherit;
          ">
            <span class="material-icons-round" style="font-size: 18px;">map</span>
            Gel-Al
          </button>
        </div>
      </div>
    </section>

    <!-- ═══════════ 3-STEP PROCESS ═══════════ -->
    <section style="padding: 2.5rem 1rem; background: #f5f6f8;">
      <div style="max-width: 600px; margin: 0 auto;">
        <h2 class="reveal" style="font-size: 1.3rem; font-weight: 700; color: #1A1A2E; text-align: center; margin-bottom: 0.3rem;">
          Nasıl Çalışır?
        </h2>
        <p class="reveal" style="text-align: center; color: #999; font-size: 13px; margin-bottom: 2rem;">
          Üç kolay adımda siparişinizi verin
        </p>

        <div style="display: flex; justify-content: center; align-items: flex-start; gap: 0; flex-wrap: wrap;">
          <!-- Step 1 -->
          <div class="reveal" style="flex: 1; min-width: 140px; max-width: 180px; text-align: center; padding: 0 8px;">
            <div style="
              width: 48px; height: 48px; border-radius: 50%;
              background: linear-gradient(135deg, #C8102E, #e8334e);
              color: #fff; font-size: 1.1rem; font-weight: 800;
              display: flex; align-items: center; justify-content: center;
              margin: 0 auto 8px; box-shadow: 0 4px 12px rgba(200,16,46,0.3);
            ">1</div>
            <span class="material-icons-round" style="font-size: 1.5rem; color: #C8102E; margin-bottom: 4px;">qr_code_scanner</span>
            <h3 style="font-size: 14px; font-weight: 700; color: #1A1A2E; margin-bottom: 4px;">QR Tara</h3>
            <p style="color: #999; font-size: 12px; line-height: 1.4;">Masanızdaki QR kodu okutun</p>
          </div>

          <!-- Connector -->
          <div class="landing-connector reveal" style="display: flex; align-items: center; padding-top: 20px;">
            <span class="material-icons-round" style="color: #C8102E; font-size: 16px;">chevron_right</span>
          </div>

          <!-- Step 2 -->
          <div class="reveal" style="flex: 1; min-width: 140px; max-width: 180px; text-align: center; padding: 0 8px;">
            <div style="
              width: 48px; height: 48px; border-radius: 50%;
              background: linear-gradient(135deg, #C8102E, #e8334e);
              color: #fff; font-size: 1.1rem; font-weight: 800;
              display: flex; align-items: center; justify-content: center;
              margin: 0 auto 8px; box-shadow: 0 4px 12px rgba(200,16,46,0.3);
            ">2</div>
            <span class="material-icons-round" style="font-size: 1.5rem; color: #C8102E; margin-bottom: 4px;">touch_app</span>
            <h3 style="font-size: 14px; font-weight: 700; color: #1A1A2E; margin-bottom: 4px;">Sipariş Ver</h3>
            <p style="color: #999; font-size: 12px; line-height: 1.4;">Menüden ürünlerinizi seçin</p>
          </div>

          <!-- Connector -->
          <div class="landing-connector reveal" style="display: flex; align-items: center; padding-top: 20px;">
            <span class="material-icons-round" style="color: #C8102E; font-size: 16px;">chevron_right</span>
          </div>

          <!-- Step 3 -->
          <div class="reveal" style="flex: 1; min-width: 140px; max-width: 180px; text-align: center; padding: 0 8px;">
            <div style="
              width: 48px; height: 48px; border-radius: 50%;
              background: linear-gradient(135deg, #C8102E, #e8334e);
              color: #fff; font-size: 1.1rem; font-weight: 800;
              display: flex; align-items: center; justify-content: center;
              margin: 0 auto 8px; box-shadow: 0 4px 12px rgba(200,16,46,0.3);
            ">3</div>
            <span class="material-icons-round" style="font-size: 1.5rem; color: #C8102E; margin-bottom: 4px;">delivery_dining</span>
            <h3 style="font-size: 14px; font-weight: 700; color: #1A1A2E; margin-bottom: 4px;">Masana Gelsin</h3>
            <p style="color: #999; font-size: 12px; line-height: 1.4;">Siparişiniz masanıza gelsin</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════ INFO CARDS ═══════════ -->
    <section style="padding: 2rem 1rem 5rem; background: #fff;">
      <div style="max-width: 600px; margin: 0 auto;">
        <h2 class="reveal" style="font-size: 1.3rem; font-weight: 700; color: #1A1A2E; text-align: center; margin-bottom: 1.5rem;">
          Bize Ulaşın
        </h2>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px;">
          <!-- Adres -->
          <div class="reveal" style="padding: 1.2rem; text-align: center; border-radius: 14px; background: #f5f6f8;">
            <div style="
              width: 40px; height: 40px; border-radius: 50%;
              background: rgba(200,16,46,0.1); color: #C8102E;
              display: flex; align-items: center; justify-content: center;
              margin: 0 auto 8px;
            ">
              <span class="material-icons-round" style="font-size: 20px;">location_on</span>
            </div>
            <h3 style="font-size: 13px; font-weight: 700; color: #1A1A2E; margin-bottom: 4px;">Adres</h3>
            <p style="color: #999; font-size: 12px; line-height: 1.4;">Fatih / İstanbul</p>
          </div>

          <!-- İletişim -->
          <div class="reveal" style="padding: 1.2rem; text-align: center; border-radius: 14px; background: #f5f6f8;">
            <div style="
              width: 40px; height: 40px; border-radius: 50%;
              background: rgba(200,16,46,0.1); color: #C8102E;
              display: flex; align-items: center; justify-content: center;
              margin: 0 auto 8px;
            ">
              <span class="material-icons-round" style="font-size: 20px;">phone</span>
            </div>
            <h3 style="font-size: 13px; font-weight: 700; color: #1A1A2E; margin-bottom: 4px;">İletişim</h3>
            <p style="color: #999; font-size: 12px; line-height: 1.4;">444 4 326</p>
          </div>

          <!-- Saatler -->
          <div class="reveal" style="padding: 1.2rem; text-align: center; border-radius: 14px; background: #f5f6f8;">
            <div style="
              width: 40px; height: 40px; border-radius: 50%;
              background: rgba(200,16,46,0.1); color: #C8102E;
              display: flex; align-items: center; justify-content: center;
              margin: 0 auto 8px;
            ">
              <span class="material-icons-round" style="font-size: 20px;">schedule</span>
            </div>
            <h3 style="font-size: 13px; font-weight: 700; color: #1A1A2E; margin-bottom: 4px;">Saatler</h3>
            <p style="color: #999; font-size: 12px; line-height: 1.4;">10:00 – 22:00</p>
          </div>
        </div>
      </div>
    </section>

    <style>
      .reveal {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
                    transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
      }
      .reveal.revealed {
        opacity: 1;
        transform: translateY(0);
      }
      @media (max-width: 500px) {
        .landing-connector { display: none !important; }
      }
    </style>
  `;
}

export function init() {
  const reveals = document.querySelectorAll('.reveal');

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -30px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = idx * 60;
        setTimeout(() => {
          el.classList.add('revealed');
        }, delay);
        revealObserver.unobserve(el);
      }
    });
  }, observerOptions);

  reveals.forEach((el) => {
    revealObserver.observe(el);
  });

  // Immediately reveal elements already in viewport
  setTimeout(() => {
    reveals.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('revealed');
      }
    });
  }, 100);
}
