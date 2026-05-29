/* ============================================================
   FATIH AKILLI SOFRA — Seed / Demo Data
   ============================================================ */

export const INITIAL_CATEGORIES = [
  { id: 'all', name: 'Tümü', icon: 'restaurant' },
  { id: 'starters', name: 'Başlangıçlar', icon: 'soup_kitchen' },
  { id: 'mains', name: 'Ana Yemekler', icon: 'restaurant_menu' },
  { id: 'kebabs', name: 'Kebaplar', icon: 'kebab_dining' },
  { id: 'desserts', name: 'Tatlılar', icon: 'cake' },
  { id: 'drinks', name: 'İçecekler', icon: 'local_drink' }
];

export const INITIAL_MENU = [
  {
    id: 'm1',
    name: 'Mercimek Çorbası',
    description: 'Sıcak tereyağı sosu, limon dilimi ve kıtır ekmekler ile sunulan geleneksel mercimek çorbası.',
    price: 75,
    category: 'starters',
    image: '/images/mercimek-corbasi.png',
    active: true,
    featured: true
  },
  {
    id: 'm2',
    name: 'İçli Köfte (2 Adet)',
    description: 'Dışı çıtır bulgur kaplama, içi baharatlı kıyma, soğan ve ceviz dolgulu geleneksel lezzet.',
    price: 90,
    category: 'starters',
    image: '/images/icli-kofte.png',
    active: true,
    featured: false
  },
  {
    id: 'm3',
    name: 'Karışık Çoban Salatası',
    description: 'Taze domates, salatalık, biber, soğan, maydanoz, sızma zeytinyağı ve nar ekşisi sosu ile.',
    price: 65,
    category: 'starters',
    image: '/images/karisik-salata.png',
    active: true,
    featured: false
  },
  {
    id: 'm4',
    name: 'Humus',
    description: 'Tahin, sarımsak, kimyon ve sızma zeytinyağı ile hazırlanan pürüzsüz nohut ezmesi.',
    price: 70,
    category: 'starters',
    image: '/images/humus.png', // Fallback or generated
    active: true,
    featured: false
  },
  {
    id: 'm5',
    name: 'Izgara Köfte',
    description: 'Özel baharatlı köfte, yanında tereyağlı pirinç pilavı, közlenmiş biber ve domates ile.',
    price: 180,
    category: 'mains',
    image: '/images/izgara-kofte.png',
    active: true,
    featured: true
  },
  {
    id: 'm6',
    name: 'Kıymalı Kaşarlı Pide',
    description: 'Karadeniz usulü ince çıtır hamur üzerinde özel kıyma harcı ve erimiş kaşar peyniri.',
    price: 165,
    category: 'mains',
    image: '/images/pide.png',
    active: true,
    featured: false
  },
  {
    id: 'm7',
    name: 'Izgara Tavuk Kanat',
    description: 'Özel marinasyonlu tavuk kanatları, patates kızartması ve pilav eşliğinde sunulur.',
    price: 175,
    category: 'mains',
    image: '/images/tavuk-kanat.png',
    active: true,
    featured: false
  },
  {
    id: 'm8',
    name: 'Adana Kebap',
    description: 'Zırh kıymasından hazırlanan acılı kebap, lavaş, közlenmiş sebzeler ve sumaklı soğan salatası eşliğinde.',
    price: 220,
    category: 'kebabs',
    image: '/images/adana-kebab.png',
    active: true,
    featured: true
  },
  {
    id: 'm9',
    name: 'Ali Nazik Kebabı',
    description: 'Közlenmiş patlıcanlı süzme yoğurt yatağında tereyağlı lokum gibi kuzu eti dilimleri.',
    price: 245,
    category: 'kebabs',
    image: '/images/ali-nazik.png',
    active: true,
    featured: true
  },
  {
    id: 'm10',
    name: 'Lahmacun (2 Adet)',
    description: 'Taş fırında pişen çıtır çıtır ince hamur, yanında limon, maydanoz ve domates ile.',
    price: 110,
    category: 'kebabs',
    image: '/images/lahmacun.png',
    active: true,
    featured: false
  },
  {
    id: 'm11',
    name: 'Geleneksel Fıstıklı Baklava',
    description: 'Antep fıstıklı çıtır katlar, şerbetli ve tam kıvamında 3 dilim geleneksel baklava.',
    price: 120,
    category: 'desserts',
    image: '/images/baklava.png',
    active: true,
    featured: true
  },
  {
    id: 'm12',
    name: 'Hatay Usulü Künefe',
    description: 'Sıcak ve şerbetli, içi tel tel uzayan özel künefe peyniri ve üzeri Antep fıstığı ile süslenmiş.',
    price: 130,
    category: 'desserts',
    image: '/images/kunefe.png',
    active: true,
    featured: true
  },
  {
    id: 'm13',
    name: 'Fırın Sütlaç',
    description: 'Taş kasede fırınlanmış karamelize üst yüzeyiyle hafif ve soğuk sütlü tatlı.',
    price: 85,
    category: 'desserts',
    image: '/images/sutlac.png',
    active: true,
    featured: false
  },
  {
    id: 'm14',
    name: 'Yayık Ayranı',
    description: 'Bol köpüklü, soğuk ve ferahlatıcı geleneksel Türk ayranı.',
    price: 30,
    category: 'drinks',
    image: '/images/ayran.png',
    active: true,
    featured: false
  },
  {
    id: 'm15',
    name: 'Taze Limonata',
    description: 'Nane yaprakları ve limon dilimleri ile hazırlanan buz gibi ev yapımı limonata.',
    price: 45,
    category: 'drinks',
    image: '/images/limonata.png',
    active: true,
    featured: false
  },
  {
    id: 'm16',
    name: 'Türk Kahvesi',
    description: 'Bakır cezvede yavaş pişen bol köpüklü kahve, yanında Fatih çikolatası ve su ile.',
    price: 50,
    category: 'drinks',
    image: '/images/turk-kahvesi.png',
    active: true,
    featured: false
  },
  {
    id: 'm17',
    name: 'Demleme Türk Çayı',
    description: 'İnce belli cam bardakta taze demlenmiş tavşan kanı Türk çayı.',
    price: 20,
    category: 'drinks',
    image: '/images/cay.png',
    active: true,
    featured: false
  },
  {
    id: 'm18',
    name: 'Ezogelin Çorbası',
    description: 'Kırmızı mercimek, bulgur ve pirinç ile hazırlanan, tereyağlı nane ve pul biber soslu geleneksel çorba.',
    price: 75,
    category: 'starters',
    image: '/images/mercimek-corbasi.png',
    active: true,
    featured: false
  },
  {
    id: 'm19',
    name: 'Fatih Güveç',
    description: 'Sıcak hünkar beğendi yatağında servis edilen, güveçte ağır ateşte pişmiş kuzu eti.',
    price: 260,
    category: 'mains',
    image: '/images/ali-nazik.png',
    active: true,
    featured: true
  },
  {
    id: 'm20',
    name: 'İskender Kebap',
    description: 'Yaprak döner dilimleri, tırnak pide yatağında, domates sosu ve eritilmiş sıcak organik tereyağı eşliğinde.',
    price: 275,
    category: 'kebabs',
    image: '/images/adana-kebab.png',
    active: true,
    featured: true
  },
  {
    id: 'm21',
    name: 'Fıstıklı Katmer',
    description: 'Gaziantep usulü ince katmer hamuru içerisinde taze kaymak ve bol çekilmiş yeşil fıstık.',
    price: 145,
    category: 'desserts',
    image: '/images/kunefe.png',
    active: true,
    featured: false
  },
  {
    id: 'm22',
    name: 'Kemalpaşa Tatlısı',
    description: 'Şerbetli peynir tatlısı, yanında taze manda kaymağı ve tahin sosu ile.',
    price: 95,
    category: 'desserts',
    image: '/images/sutlac.png',
    active: true,
    featured: false
  },
  {
    id: 'm23',
    name: 'Organik Şalgam Suyu',
    description: 'Adana usulü acılı veya acısız, cam şişede servis edilen serinletici şalgam suyu.',
    price: 35,
    category: 'drinks',
    image: '/images/ayran.png',
    active: true,
    featured: false
  }
];

export const INITIAL_TABLES = Array.from({ length: 12 }, (_, i) => ({
  id: `t${i + 1}`,
  tableNo: i + 1,
  nfcTagId: `NFC-FATIH-T${String(i + 1).padStart(2, '0')}`,
  status: 'empty', // 'empty', 'dining', 'calling'
  active: true
}));

export const INITIAL_ORDERS = [
  {
    id: 'APO-784102',
    tableNo: 3,
    items: [
      { id: 'm1', name: 'Mercimek Çorbası', price: 75, quantity: 2 },
      { id: 'm8', name: 'Adana Kebap', price: 220, quantity: 2 },
      { id: 'm14', name: 'Yayık Ayranı', price: 30, quantity: 2 }
    ],
    note: 'Kebabı bol soğanlı ve lavaşlı gönderin lütfen.',
    subtotal: 650,
    total: 650,
    paymentMethod: 'nfc',
    status: 'delivered',
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
  },
  {
    id: 'APO-391482',
    tableNo: 5,
    items: [
      { id: 'm5', name: 'Izgara Köfte', price: 180, quantity: 1 },
      { id: 'm10', name: 'Lahmacun (2 Adet)', price: 110, quantity: 1 },
      { id: 'm15', name: 'Taze Limonata', price: 45, quantity: 2 }
    ],
    note: '',
    subtotal: 380,
    total: 380,
    paymentMethod: 'card',
    status: 'preparing',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString()
  },
  {
    id: 'APO-511482',
    tableNo: 2,
    items: [
      { id: 'm9', name: 'Ali Nazik Kebabı', price: 245, quantity: 1 },
      { id: 'm13', name: 'Fırın Sütlaç', price: 85, quantity: 1 },
      { id: 'm16', name: 'Türk Kahvesi', price: 50, quantity: 1 }
    ],
    note: 'Kahve orta şekerli olsun.',
    subtotal: 380,
    total: 380,
    paymentMethod: 'cash',
    status: 'pending',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  }
];

export const INITIAL_CALLS = [
  {
    id: 'call-1',
    tableNo: 4,
    type: 'garson', // 'garson', 'hesap_nakit', 'hesap_nfc'
    status: 'pending',
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString()
  },
  {
    id: 'call-2',
    tableNo: 7,
    type: 'hesap_nakit',
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString()
  }
];

export const INITIAL_REWARDS = [
  {
    id: 'APO-511482', // Match user requested mock
    code: 'APO-511482',
    tableNo: 2,
    customerName: 'Ahmet Yılmaz',
    customerPhone: '05356985478',
    customerEmail: 'fjfjfkfdj@gmail.com',
    customerBirthday: '1996-05-23',
    prizeName: 'Bedava Baklava Tabağı',
    used: false,
    createdAt: '2026-05-23T16:41:00Z'
  },
  {
    id: 'APO-918239',
    code: 'APO-918239',
    tableNo: 5,
    customerName: 'Fatma Kara',
    customerPhone: '05423698745',
    customerEmail: 'fatmakara@gmail.com',
    customerBirthday: '1990-10-12',
    prizeName: '%20 İndirim Kuponu',
    used: true,
    createdAt: '2026-05-25T14:32:00Z'
  }
];

export const PRIZE_POOL = [
  'Bedava Baklava Tabağı',
  'Bedava Türk Kahvesi',
  '%20 İndirim Kuponu',
  'Bedava Künefe',
  'Bedava Ayran'
];
