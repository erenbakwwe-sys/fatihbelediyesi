import { store } from '../store.js';

const facilities = [
  { id: 'catladikapi', name: 'Çatladıkapı Sosyal Tesisleri', lat: 41.0028, lng: 28.9743 },
  { id: 'topkapi', name: 'Topkapı Sosyal Tesisleri', lat: 41.0185, lng: 28.9242 },
  { id: 'ayvansaray', name: 'Ayvansaray Sosyal Tesisleri', lat: 41.0401, lng: 28.9431 },
  { id: 'yedikule', name: 'Yedikule Hisarı Tesisleri', lat: 40.9937, lng: 28.9208 },
  { id: 'sultanahmet', name: 'Sultanahmet Meydan Kafe', lat: 41.0054, lng: 28.9768 },
  { id: 'karagumruk', name: 'Karagümrük Sosyal Tesisi', lat: 41.0289, lng: 28.9378 }
];

export function render() {
  return `
    <div class="facilities-page" style="height: calc(100vh - 60px); display: flex; flex-direction: column;">
      <div style="padding: 1rem 1.5rem; background: linear-gradient(135deg, #1A1A2E 0%, #2a2a4e 100%); color: #fff; z-index: 10;">
        <h1 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 0.2rem; display: flex; align-items: center; gap: 8px;">
          <span class="material-icons-round">map</span> Sosyal Tesisler
        </h1>
        <p style="color: rgba(255,255,255,0.7); font-size: 0.9rem;">
          Gel-Al sipariş vermek için size en yakın tesisi seçin.
        </p>
      </div>
      
      <div id="map-container" style="flex: 1; width: 100%; position: relative; z-index: 1;"></div>
    </div>
  `;
}

export function init() {
  if (typeof L === 'undefined') {
    setTimeout(init, 200);
    return;
  }

  const map = L.map('map-container').setView([41.0122, 28.9515], 13); // Center of Fatih

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; Fatih Belediyesi',
    maxZoom: 19
  }).addTo(map);

  // Fatih Belediyesi Icon
  const customIcon = L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="background: var(--color-primary); color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(200,16,46,0.4); border: 2px solid white;">
        <span class="material-icons-round" style="font-size: 20px;">restaurant</span>
      </div>
      <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid var(--color-primary); margin: -2px auto 0;"></div>
    `,
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -40]
  });

  facilities.forEach(facility => {
    const marker = L.marker([facility.lat, facility.lng], { icon: customIcon }).addTo(map);
    
    const popupContent = `
      <div style="text-align: center; min-width: 180px; padding: 5px;">
        <h3 style="font-size: 1rem; font-weight: 700; color: #1A1A2E; margin-bottom: 5px;">${facility.name}</h3>
        <p style="font-size: 0.8rem; color: #666; margin-bottom: 15px;">Fatih, İstanbul</p>
        <button class="btn btn-primary btn-sm" onclick="window.location.hash='#/menu?facility=${facility.id}'" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 5px;">
          <span class="material-icons-round" style="font-size: 16px;">shopping_bag</span> Gel-Al Sipariş Ver
        </button>
      </div>
    `;
    
    marker.bindPopup(popupContent, {
      closeButton: false,
      className: 'custom-popup'
    });
  });

  // Try to locate user
  map.locate({setView: false, maxZoom: 15});
  
  map.on('locationfound', (e) => {
    const userIcon = L.divIcon({
      className: 'user-marker',
      html: `<div style="width: 16px; height: 16px; background: #2563eb; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(37,99,235,0.6);"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });
    
    L.marker(e.latlng, { icon: userIcon }).addTo(map)
      .bindPopup('<div style="font-weight: 600;">Konumunuz</div>').openPopup();
      
    map.setView(e.latlng, 14);
  });
}
