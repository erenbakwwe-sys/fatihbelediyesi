// ─── Landing Page ─── Fatih Akıllı Sofra
// Full-width hero, 3-step process, info cards, scroll-reveal animations

export function render() {
  return `
    <!-- ═══════════ HERO SECTION ═══════════ -->
    <section class="landing-hero" style="
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      overflow: hidden;
    ">
      <div class="landing-hero__bg" style="
        position: absolute; inset: 0;
        background: url('/images/hero-bg.png') center/cover no-repeat;
        z-index: 0;
      "></div>
      <div class="landing-hero__overlay" style="
        position: absolute; inset: 0;
        background: linear-gradient(180deg, rgba(26,26,46,0.82) 0%, rgba(200,16,46,0.55) 100%);
        z-index: 1;
      "></div>

      <div class="landing-hero__content" style="position: relative; z-index: 2; max-width: 680px; padding: 2rem;">
        <img src="/images/fatih-belediyesi-logo.png" alt="Fatih Belediyesi" class="reveal"
             style="width: 160px; height: auto; object-fit: contain; margin-bottom: 1.5rem; filter: drop-shadow(0 4px 24px rgba(0,0,0,0.3));" />

        <h1 class="reveal" style="
          font-size: 3rem; font-weight: 800; color: #fff;
          margin-bottom: 0.5rem; letter-spacing: -0.5px;
          text-shadow: 0 2px 16px rgba(0,0,0,0.35);
        ">Fatih Akıllı Sofra</h1>

        <p class="reveal" style="
          font-size: 1.15rem; color: rgba(255,255,255,0.88);
          margin-bottom: 1.5rem; line-height: 1.6;
        ">M. Ergün Turan Başkanlığında Fatih Belediyesi Sosyal Tesisleri Akıllı Sipariş Sistemi</p>
 
        <p class="reveal" style="
          font-size: 0.97rem; color: rgba(255,255,255,0.72);
          margin-bottom: 2rem; line-height: 1.7;
          max-width: 540px; margin-left: auto; margin-right: auto;
          font-style: italic;
        ">Sayın Başkanımız M. Ergün Turan'ın liderliğinde Fatih Belediyesi olarak sunduğumuz bu dijital hizmetle, tesislerimizde çağın gerekliliklerine uygun akıllı, hızlı ve modern bir servis deneyimi sunuyoruz.</p>
 
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;" class="reveal">
          <button class="btn btn-primary btn-lg"
                  onclick="window.location.hash='#/menu'"
                  style="
            font-size: 1.1rem; padding: 1rem 2.8rem;
            border-radius: 60px; box-shadow: 0 8px 32px rgba(200,16,46,0.45);
            display: inline-flex; align-items: center; gap: 0.6rem;
          ">
            <span class="material-icons-round">restaurant_menu</span>
            Menüyü Gör
          </button>
          
          <button class="btn btn-lg"
                  onclick="window.location.hash='#/facilities'"
                  style="
            font-size: 1.1rem; padding: 1rem 2.8rem;
            border-radius: 60px; box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            background: #fff; color: var(--color-primary); border: 2px solid #fff;
            display: inline-flex; align-items: center; gap: 0.6rem;
          ">
            <span class="material-icons-round">map</span>
            Gel-Al Noktası Seç
          </button>
        </div>
 
        <div class="reveal" style="margin-top: 2.5rem;">
          <span class="material-icons-round" style="color: rgba(255,255,255,0.4); font-size: 2rem; animation: bounce-down 2s infinite;">expand_more</span>
        </div>
      </div>
    </section>
 
    <!-- ═══════════ 3-STEP PROCESS ═══════════ -->
    <section style="padding: 4rem 1.5rem; background: #f8f9fa;">
      <div class="container" style="max-width: 900px; margin: 0 auto;">
        <h2 class="text-center reveal" style="font-size: 1.8rem; font-weight: 700; color: #1A1A2E; margin-bottom: 0.5rem;">
          Nasıl Çalışır?
        </h2>
        <p class="text-center text-muted reveal" style="margin-bottom: 3rem; font-size: 1rem;">
          Üç kolay adımda siparişinizi verin
        </p>
 
        <div class="landing-steps" style="
          display: flex; justify-content: center; align-items: flex-start;
          gap: 0; flex-wrap: wrap; position: relative;
        ">
          <!-- Step 1 -->
          <div class="landing-step reveal" style="flex: 1; min-width: 200px; max-width: 260px; text-align: center; position: relative; padding: 0 1rem;">
            <div style="
              width: 72px; height: 72px; border-radius: 50%;
              background: linear-gradient(135deg, #C8102E, #e8334e);
              color: #fff; font-size: 1.6rem; font-weight: 800;
              display: flex; align-items: center; justify-content: center;
              margin: 0 auto 1rem; box-shadow: 0 6px 20px rgba(200,16,46,0.3);
            ">1</div>
            <div class="landing-step__line" style="
              position: absolute; top: 36px; left: calc(50% + 44px); width: calc(100% - 88px + 2rem);
              height: 3px; background: linear-gradient(90deg, #C8102E, #ddd);
              display: none;
            "></div>
            <span class="material-icons-round" style="font-size: 2.2rem; color: #C8102E; margin-bottom: 0.5rem;">qr_code_scanner</span>
            <h3 style="font-size: 1.1rem; font-weight: 700; color: #1A1A2E; margin-bottom: 0.4rem;">QR Tara</h3>
            <p class="text-muted" style="font-size: 0.88rem; line-height: 1.5;">Masanızdaki QR kodu telefonunuzla okutun</p>
          </div>
 
          <!-- Connector -->
          <div class="landing-connector reveal" style="
            display: flex; align-items: center; padding-top: 30px;
          ">
            <div style="width: 48px; height: 3px; background: linear-gradient(90deg, #C8102E, #e8334e); border-radius: 2px;"></div>
            <span class="material-icons-round" style="color: #C8102E; font-size: 1.2rem;">chevron_right</span>
          </div>
 
          <!-- Step 2 -->
          <div class="landing-step reveal" style="flex: 1; min-width: 200px; max-width: 260px; text-align: center; position: relative; padding: 0 1rem;">
            <div style="
              width: 72px; height: 72px; border-radius: 50%;
              background: linear-gradient(135deg, #C8102E, #e8334e);
              color: #fff; font-size: 1.6rem; font-weight: 800;
              display: flex; align-items: center; justify-content: center;
              margin: 0 auto 1rem; box-shadow: 0 6px 20px rgba(200,16,46,0.3);
            ">2</div>
            <span class="material-icons-round" style="font-size: 2.2rem; color: #C8102E; margin-bottom: 0.5rem;">touch_app</span>
            <h3 style="font-size: 1.1rem; font-weight: 700; color: #1A1A2E; margin-bottom: 0.4rem;">Sipariş Ver</h3>
            <p class="text-muted" style="font-size: 0.88rem; line-height: 1.5;">Dijital menüden istediğiniz ürünleri seçin</p>
          </div>
 
          <!-- Connector -->
          <div class="landing-connector reveal" style="
            display: flex; align-items: center; padding-top: 30px;
          ">
            <div style="width: 48px; height: 3px; background: linear-gradient(90deg, #C8102E, #e8334e); border-radius: 2px;"></div>
            <span class="material-icons-round" style="color: #C8102E; font-size: 1.2rem;">chevron_right</span>
          </div>
 
          <!-- Step 3 -->
          <div class="landing-step reveal" style="flex: 1; min-width: 200px; max-width: 260px; text-align: center; position: relative; padding: 0 1rem;">
            <div style="
              width: 72px; height: 72px; border-radius: 50%;
              background: linear-gradient(135deg, #C8102E, #e8334e);
              color: #fff; font-size: 1.6rem; font-weight: 800;
              display: flex; align-items: center; justify-content: center;
              margin: 0 auto 1rem; box-shadow: 0 6px 20px rgba(200,16,46,0.3);
            ">3</div>
            <span class="material-icons-round" style="font-size: 2.2rem; color: #C8102E; margin-bottom: 0.5rem;">delivery_dining</span>
            <h3 style="font-size: 1.1rem; font-weight: 700; color: #1A1A2E; margin-bottom: 0.4rem;">Masana Gelsin</h3>
            <p class="text-muted" style="font-size: 0.88rem; line-height: 1.5;">Siparişiniz hazırlanıp masanıza teslim edilsin</p>
          </div>
        </div>
      </div>
    </section>
 
    <!-- ═══════════ INFO CARDS ═══════════ -->
    <section style="padding: 4rem 1.5rem 6rem; background: #fff;">
      <div class="container" style="max-width: 900px; margin: 0 auto;">
        <h2 class="text-center reveal" style="font-size: 1.8rem; font-weight: 700; color: #1A1A2E; margin-bottom: 2.5rem;">
          Bize Ulaşın
        </h2>
 
        <div class="grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
          <!-- Adres -->
          <div class="card card-hover reveal" style="padding: 2rem; text-align: center; border-radius: 16px;">
            <div style="
              width: 56px; height: 56px; border-radius: 50%;
              background: rgba(200,16,46,0.1); color: #C8102E;
              display: flex; align-items: center; justify-content: center;
              margin: 0 auto 1rem; font-size: 1.5rem;
            ">
              <span class="material-icons-round">location_on</span>
            </div>
            <h3 style="font-size: 1.05rem; font-weight: 700; color: #1A1A2E; margin-bottom: 0.5rem;">Adres</h3>
            <p class="text-muted" style="font-size: 0.9rem; line-height: 1.5;">Fatih Belediyesi<br>Fatih / İstanbul</p>
          </div>
 
          <!-- İletişim -->
          <div class="card card-hover reveal" style="padding: 2rem; text-align: center; border-radius: 16px;">
            <div style="
              width: 56px; height: 56px; border-radius: 50%;
              background: rgba(200,16,46,0.1); color: #C8102E;
              display: flex; align-items: center; justify-content: center;
              margin: 0 auto 1rem; font-size: 1.5rem;
            ">
              <span class="material-icons-round">phone</span>
            </div>
            <h3 style="font-size: 1.05rem; font-weight: 700; color: #1A1A2E; margin-bottom: 0.5rem;">İletişim</h3>
            <p class="text-muted" style="font-size: 0.9rem; line-height: 1.5;">444 4 326<br>info@fatih.bel.tr</p>
          </div>
 
          <!-- Çalışma Saatleri -->
          <div class="card card-hover reveal" style="padding: 2rem; text-align: center; border-radius: 16px;">
            <div style="
              width: 56px; height: 56px; border-radius: 50%;
              background: rgba(200,16,46,0.1); color: #C8102E;
              display: flex; align-items: center; justify-content: center;
              margin: 0 auto 1rem; font-size: 1.5rem;
            ">
              <span class="material-icons-round">schedule</span>
            </div>
            <h3 style="font-size: 1.05rem; font-weight: 700; color: #1A1A2E; margin-bottom: 0.5rem;">Çalışma Saatleri</h3>
            <p class="text-muted" style="font-size: 0.9rem; line-height: 1.5;">Her Gün<br>10:00 – 22:00</p>
          </div>
        </div>
      </div>
    </section>

    <style>
      @keyframes bounce-down {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(10px); }
        60% { transform: translateY(5px); }
      }

      /* Scroll-reveal base */
      .reveal {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
                    transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
      }
      .reveal.revealed {
        opacity: 1;
        transform: translateY(0);
      }

      /* Responsive connectors */
      @media (max-width: 700px) {
        .landing-connector { display: none !important; }
        .landing-steps { flex-direction: column; align-items: center; gap: 2rem; }
      }
    </style>
  `;
}

export function init() {
  // ── Scroll-triggered reveal animations ──
  const reveals = document.querySelectorAll('.reveal');

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // Stagger animation by index
        const el = entry.target;
        const delay = idx * 80;
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

  // ── Immediately reveal elements that are already in viewport ──
  setTimeout(() => {
    reveals.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('revealed');
      }
    });
  }, 100);
}
