# 🏛️ Fatih Akıllı Sofra

**Fatih Akıllı Sofra**, Fatih Belediyesi Sosyal Tesisleri için tasarlanmış ve belediyenin kurumsal kimliğiyle tamamen uyumlu akıllı restoran otomasyon ve dijital sipariş sistemidir. 

Fatih Belediyesi Bilgi İşlem Müdürlüğü öncülüğünde hayata geçirilen bu proje, tesislerdeki hizmet kalitesini artırmak, servis sürelerini en aza indirmek ve modern bir dijital deneyim sunmak amacıyla geliştirilmiştir.

---

## 🌟 Önemli Özellikler

### 🍲 Müşteri Arayüzü (Customer Panel)
- **Dinamik Dijital Menü:** Kategori filtreleme (Çorbalar, Ana Yemekler, Kebaplar, Tatlılar, İçecekler) ve anlık yemek arama.
- **Akıllı Sepet Yönetimi:** Kolayca ürün ekleme/çıkarma, pürüzsüz miktar güncellemeleri ve özel mutfak notları yazabilme.
- **Gelişmiş Ödeme Simülatörü:** 
  - **Temassız NFC Ödeme** (Önerilen yöntem, pulsing dalga animasyonlu simülasyon)
  - Kredi / Banka Kartı ödemesi
  - Nakit Ödeme (Garson onaylı)
- **Dijital Kazı-Kazan (Scratch-Card):** Sipariş sonrasında HTML5 Canvas tabanlı, konfeti efektli kazı-kazan oyunu ile ödül kazanma şansı ve kupon kodu üretimi.
- **Gerçek Zamanlı Sipariş Takibi:** Siparişin mutfaktaki durumunu (Bekliyor ➜ Hazırlanıyor ➜ Teslim Edildi) anlık gösteren reaktif zaman tüneli.
- **Garson Çağırma Konsolu:** Tek tıkla masaya garson veya hesap talebi gönderebilme.

### 👑 Yönetici Paneli (Admin Panel)
- **Dashboard:** Günlük sipariş, toplam ciro, aktif masalar ve bekleyen çağrıları gösteren gerçek zamanlı metrik kartları ve son siparişler tablosu.
- **Sipariş Yönetimi:** Mutfak ekranı üzerinden gelen siparişleri onaylama ve hazırlama durumuna geçirme.
- **Menü Yönetimi:** Ürün ekleme, silme, fiyat güncelleme, açıklama değiştirme ve aktif/pasif etme paneli.
- **Masa & QR Kod Yönetimi:** Dinamik vektör QR kod çizdirme (ESM/CJS uyumlu), indirilebilir SVG çıktıları alma ve her masaya özel NFC Tag ID eşleştirme.
- **Çağrı Konsolu:** Müşterilerden gelen garson/hesap çağrılarını sesli (Web Audio API) ve görsel uyarılarla takip etme ekranı.
- **Finans & Analiz:** Haftalık/Aylık ciroları gösteren CSS bar grafikleri ve en çok satan ürün istatistikleri.
- **Ödül & Müşteri Takibi:** Kazı-kazan talihlilerinin aranabilir tablosu ve modal bazlı e-posta/push kampanya yönetim araçları.

---

## 🛠️ Teknoloji Yığını

- **Core:** Single Page Application (SPA) mimarisinde Vanilla JS.
- **Tasarım & Animasyon:** Fatih Belediyesi kurumsal renk paleti (#C8102E Kırmızı, #1A1A2E Lacivert) ile özel tasarlanmış modern Vanilla CSS.
- **Gerçek Zamanlı Veri (Real-time DB):** **Firebase Firestore** real-time onSnapshot dinleyicileri.
- **Derleme Aracı:** **Vite** (hızlı ve hafif paketleme).
- **Kare Kod:** Vektörel SVG üreten `qrcode-generator`.

---

## 🚀 Kurulum ve Çalıştırma

### 1. Depoyu Klonlayın
```bash
git clone https://github.com/erenbakwwe-sys/fatihbelediyesi.git
cd fatihbelediyesi
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Yerel Sunucuyu Başlatın
```bash
npm run dev
```
Uygulama yerel olarak `http://localhost:5173/` adresinde çalışacaktır.

### 4. Üretim Derlemesi Alın (Production Build)
```bash
npm run build
```

---

## 🌐 Vercel Deploy Kılavuzu

Proje **Vercel** üzerinde tek tıkla barındırılmaya tamamen hazırdır:

1. **Vercel Dashboard**'a gidin ve **"Add New Project"** butonuna tıklayın.
2. GitHub hesabınızı bağlayıp bu depoyu (**fatihbelediyesi**) seçin.
3. Vercel projenin bir Vite projesi olduğunu otomatik olarak tanıyacaktır.
4. **Deploy** butonuna basarak canlıya alabilirsiniz! 🎉
