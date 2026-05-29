/* ============================================================
   FATIH AKILLI SOFRA — Central Store (State Management)
   Firestore synchronization + offline fallback (localStorage)
   ============================================================ */

import {
  db,
  collection,
  doc,
  addDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  writeBatch
} from './firebase.js';

import {
  INITIAL_MENU,
  INITIAL_TABLES,
  INITIAL_ORDERS,
  INITIAL_CALLS,
  INITIAL_REWARDS
} from './data.js';

import { showToast } from './utils.js';

class Store {
  constructor() {
    this.listeners = [];
    
    // Core state
    this.state = {
      menu: [],
      tables: [],
      orders: [],
      calls: [],
      rewards: [],
      cart: this.loadCartFromStorage(),
      currentTable: this.parseTableFromUrl(),
      loading: true
    };

    // Initialize Store & Firestore sync
    this.init();
  }

  // ── Backward Compatibility Getters ──────────────────────────
  get menu() { return this.state.menu; }
  get tables() { return this.state.tables; }
  get orders() { return this.state.orders; }
  get calls() { return this.state.calls; }
  get rewards() { return this.state.rewards; }
  get categories() {
    return [
      { id: 'starters', name: 'Başlangıçlar', icon: 'soup_kitchen' },
      { id: 'mains', name: 'Ana Yemekler', icon: 'restaurant_menu' },
      { id: 'kebabs', name: 'Kebaplar', icon: 'kebab_dining' },
      { id: 'desserts', name: 'Tatlılar', icon: 'cake' },
      { id: 'drinks', name: 'İçecekler', icon: 'local_drink' }
    ];
  }

  // ── Pub/Sub Pattern ─────────────────────────────────────────
  subscribe(listener) {
    this.listeners.push(listener);
    // Immediately emit current state to new subscriber
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  emit() {
    this.listeners.forEach(listener => listener(this.state));
  }

  // ── LocalStorage Cart ───────────────────────────────────────
  loadCartFromStorage() {
    try {
      const stored = localStorage.getItem('fatih_akilli_sofra_cart');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Cart load failed:', e);
      return [];
    }
  }

  saveCartToStorage() {
    try {
      localStorage.setItem('fatih_akilli_sofra_cart', JSON.stringify(this.state.cart));
    } catch (e) {
      console.error('Cart save failed:', e);
    }
  }

  // ── URL Query Parser ────────────────────────────────────────
  parseTableFromUrl() {
    // Check both standard URL query and hash routing table param
    const searchParams = new URLSearchParams(window.location.search);
    let table = searchParams.get('table');
    
    if (!table) {
      const hash = window.location.hash;
      const match = hash.match(/[?&]table=([^&]+)/);
      table = match ? match[1] : null;
    }
    
    // Save/Read from session so page reloads don't lose table number
    if (table) {
      sessionStorage.setItem('fatih_active_table', table);
      return parseInt(table, 10);
    }
    
    const sessionTable = sessionStorage.getItem('fatih_active_table');
    return sessionTable ? parseInt(sessionTable, 10) : null;
  }

  setTable(tableNo) {
    this.state.currentTable = tableNo;
    if (tableNo) {
      sessionStorage.setItem('fatih_active_table', tableNo);
    } else {
      sessionStorage.removeItem('fatih_active_table');
    }
    this.emit();
  }

  // ── Database Initialization ─────────────────────────────────
  async init() {
    try {
      let menuFallbackUsed = false;
      let tablesFallbackUsed = false;
      let ordersFallbackUsed = false;
      let callsFallbackUsed = false;
      let rewardsFallbackUsed = false;

      // Sync Menu
      onSnapshot(collection(db, 'menu'), async (snapshot) => {
        if (snapshot.empty) {
          console.log('Menu collection is empty. Seeding defaults...');
          await this.seedCollection('menu', INITIAL_MENU);
        } else {
          this.state.menu = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          this.emit();
        }
      }, (error) => {
        console.warn('Menu snapshot permission denied or failed. Falling back to local data.', error);
        if (!menuFallbackUsed) {
          menuFallbackUsed = true;
          this.state.menu = INITIAL_MENU;
          this.emit();
        }
      });

      // Sync Tables
      onSnapshot(collection(db, 'tables'), async (snapshot) => {
        if (snapshot.empty) {
          console.log('Tables collection is empty. Seeding defaults...');
          await this.seedCollection('tables', INITIAL_TABLES);
        } else {
          this.state.tables = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => a.tableNo - b.tableNo);
          this.emit();
        }
      }, (error) => {
        console.warn('Tables snapshot permission denied or failed. Falling back to local data.', error);
        if (!tablesFallbackUsed) {
          tablesFallbackUsed = true;
          this.state.tables = INITIAL_TABLES;
          this.emit();
        }
      });

      // Sync Orders
      const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      onSnapshot(ordersQuery, async (snapshot) => {
        if (snapshot.empty) {
          console.log('Orders collection is empty. Seeding defaults...');
          await this.seedCollection('orders', INITIAL_ORDERS);
        } else {
          this.state.orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          this.emit();
        }
      }, (error) => {
        console.warn('Orders snapshot permission denied or failed. Falling back to local data.', error);
        if (!ordersFallbackUsed) {
          ordersFallbackUsed = true;
          this.state.orders = INITIAL_ORDERS;
          this.emit();
        }
      });

      // Sync Calls
      const callsQuery = query(collection(db, 'calls'), orderBy('createdAt', 'desc'));
      onSnapshot(callsQuery, async (snapshot) => {
        if (snapshot.empty) {
          console.log('Calls collection is empty. Seeding defaults...');
          await this.seedCollection('calls', INITIAL_CALLS);
        } else {
          this.state.calls = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          this.emit();
        }
      }, (error) => {
        console.warn('Calls snapshot permission denied or failed. Falling back to local data.', error);
        if (!callsFallbackUsed) {
          callsFallbackUsed = true;
          this.state.calls = INITIAL_CALLS;
          this.emit();
        }
      });

      // Sync Rewards
      const rewardsQuery = query(collection(db, 'rewards'), orderBy('createdAt', 'desc'));
      onSnapshot(rewardsQuery, async (snapshot) => {
        if (snapshot.empty) {
          console.log('Rewards collection is empty. Seeding defaults...');
          await this.seedCollection('rewards', INITIAL_REWARDS);
        } else {
          this.state.rewards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          this.emit();
        }
      }, (error) => {
        console.warn('Rewards snapshot permission denied or failed. Falling back to local data.', error);
        if (!rewardsFallbackUsed) {
          rewardsFallbackUsed = true;
          this.state.rewards = INITIAL_REWARDS;
          this.emit();
        }
      });

      this.state.loading = false;
      this.emit();

    } catch (error) {
      console.error('Firebase store initialization failed:', error);
      showToast('Veritabanı bağlantı hatası! Çevrimdışı modda çalışılıyor.', 'error');
      
      // Offline fallback
      this.state.menu = INITIAL_MENU;
      this.state.tables = INITIAL_TABLES;
      this.state.orders = INITIAL_ORDERS;
      this.state.calls = INITIAL_CALLS;
      this.state.rewards = INITIAL_REWARDS;
      this.state.loading = false;
      this.emit();
    }
  }

  // Seeding helper using batch
  async seedCollection(colName, defaultData) {
    try {
      const batch = writeBatch(db);
      defaultData.forEach(item => {
        const docRef = doc(collection(db, colName), item.id);
        const { id, ...data } = item;
        
        // Convert dates if needed
        if (data.createdAt && typeof data.createdAt === 'string') {
          // Keep ISO string or use serverTimestamp for newly added
        }
        
        batch.set(docRef, data);
      });
      await batch.commit();
      console.log(`${colName} successfully seeded in Firestore.`);
    } catch (e) {
      console.error(`Seeding failed for ${colName}:`, e);
    }
  }

  // ── Cart Operations ─────────────────────────────────────────
  addToCart(item, quantity = 1) {
    const existing = this.state.cart.find(c => c.id === item.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.state.cart.push({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: quantity
      });
    }
    this.saveCartToStorage();
    this.emit();
    showToast(`${item.name} sepete eklendi.`);
  }

  removeFromCart(itemId) {
    const item = this.state.cart.find(c => c.id === itemId);
    this.state.cart = this.state.cart.filter(c => c.id !== itemId);
    this.saveCartToStorage();
    this.emit();
    if (item) {
      showToast(`${item.name} sepetten çıkarıldı.`, 'info');
    }
  }

  updateQuantity(itemId, newQty) {
    const item = this.state.cart.find(c => c.id === itemId);
    if (!item) return;

    item.quantity = newQty;
    if (item.quantity <= 0) {
      this.removeFromCart(itemId);
    } else {
      this.saveCartToStorage();
      this.emit();
    }
  }

  clearCart() {
    this.state.cart = [];
    this.saveCartToStorage();
    this.emit();
  }

  getCartTotal() {
    return this.state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  // ── Firestore Write Operations ──────────────────────────────
  
  // 1. Place Order
  async placeOrder(orderId, paymentMethod, note = '') {
    if (this.state.cart.length === 0) return null;

    const orderData = {
      tableNo: this.state.currentTable || 1,
      items: this.state.cart,
      note: note,
      subtotal: this.getCartTotal(),
      total: this.getCartTotal(),
      paymentMethod: paymentMethod, // 'nfc', 'card', 'cash'
      status: 'pending', // 'pending', 'preparing', 'delivered'
      createdAt: new Date().toISOString()
    };

    try {
      // Use setDoc to preserve custom IDs like 'APO-XXXXXX'
      await setDoc(doc(db, 'orders', orderId), orderData);
      
      // Update Table status in Firestore to 'dining'
      if (this.state.currentTable) {
        const table = this.state.tables.find(t => t.tableNo === this.state.currentTable);
        if (table) {
          await updateDoc(doc(db, 'tables', table.id), { status: 'dining' });
        }
      }

      this.clearCart();
      showToast('Siparişiniz başarıyla mutfağa iletildi!');
      return orderId;
    } catch (e) {
      console.error('Order placing failed:', e);
      showToast('Sipariş gönderilemedi, lütfen tekrar deneyin.', 'error');
      throw e;
    }
  }

  // 2. Waiter Call Actions
  async addCall(type = 'garson') {
    const tableNo = this.state.currentTable;
    if (!tableNo) {
      showToast('Masa numarası bulunamadı. Lütfen QR kodu okutun.', 'error');
      return;
    }

    const callData = {
      tableNo: tableNo,
      type: type, // 'garson', 'hesap_nakit', 'hesap_nfc'
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, 'calls'), callData);
      
      // Update table state
      const table = this.state.tables.find(t => t.tableNo === tableNo);
      if (table) {
        await updateDoc(doc(db, 'tables', table.id), { status: 'calling' });
      }
      
      const typeText = type === 'garson' ? 'Garson' : 'Hesap';
      showToast(`${typeText} çağrısı gönderildi. Görevlimiz en kısa sürede masanıza ulaşacaktır.`);
    } catch (e) {
      console.error('Call failed:', e);
      showToast('Çağrı gönderilemedi, lütfen tekrar deneyin.', 'error');
    }
  }

  async completeCall(callId) {
    try {
      const call = this.state.calls.find(c => c.id === callId);
      await deleteDoc(doc(db, 'calls', callId));
      
      // Update table status if no pending calls remain for this table
      if (call) {
        const remainingCalls = this.state.calls.filter(c => c.tableNo === call.tableNo && c.id !== callId);
        if (remainingCalls.length === 0) {
          const table = this.state.tables.find(t => t.tableNo === call.tableNo);
          if (table) {
            await updateDoc(doc(db, 'tables', table.id), { status: 'empty' });
          }
        }
      }
      showToast('Çağrı tamamlandı olarak işaretlendi.', 'success');
    } catch (e) {
      console.error('Complete call failed:', e);
    }
  }

  // 3. Admin Menu Management
  async addMenuItem(item) {
    try {
      const docRef = doc(db, 'menu', item.id);
      await setDoc(docRef, { ...item, active: true });
      showToast('Yeni menü elemanı eklendi.', 'success');
    } catch (e) {
      console.error('Add menu item failed:', e);
      showToast('Ürün eklenemedi.', 'error');
    }
  }

  async updateMenuItem(itemId, data) {
    try {
      await updateDoc(doc(db, 'menu', itemId), data);
      showToast('Menü elemanı güncellendi.', 'success');
    } catch (e) {
      console.error('Update menu item failed:', e);
      showToast('Ürün güncellenemedi.', 'error');
    }
  }

  async deleteMenuItem(itemId) {
    try {
      await deleteDoc(doc(db, 'menu', itemId));
      showToast('Ürün menüden kaldırıldı.', 'info');
    } catch (e) {
      console.error('Delete menu item failed:', e);
      showToast('Ürün silinemedi.', 'error');
    }
  }

  // 4. Admin Table Operations
  async addTable(tableNo, nfcTagId) {
    try {
      const docRef = doc(collection(db, 'tables'), `t${tableNo}`);
      await setDoc(docRef, {
        tableNo: parseInt(tableNo, 10),
        nfcTagId: nfcTagId || `NFC-FATIH-T${String(tableNo).padStart(2, '0')}`,
        status: 'empty',
        active: true
      });
      showToast(`Masa ${tableNo} başarıyla sisteme eklendi.`, 'success');
    } catch (e) {
      console.error('Add table failed:', e);
      showToast('Masa eklenemedi.', 'error');
    }
  }

  async toggleTableActive(tableId, active) {
    try {
      await updateDoc(doc(db, 'tables', tableId), { active: active });
      showToast(`Masa durumu güncellendi.`, 'success');
    } catch (e) {
      console.error('Toggle table active failed:', e);
    }
  }

  // 5. Admin Order Actions
  async updateOrderStatus(orderId, status) {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: status });
      
      // If marked delivered, change table status back to empty after a while or directly
      if (status === 'delivered') {
        const order = this.state.orders.find(o => o.id === orderId);
        if (order) {
          const table = this.state.tables.find(t => t.tableNo === order.tableNo);
          if (table) {
            await updateDoc(doc(db, 'tables', table.id), { status: 'empty' });
          }
        }
      }
      
      const statusTexts = { pending: 'Beklemede', preparing: 'Hazırlanıyor', delivered: 'Teslim Edildi' };
      showToast(`Sipariş durumu güncellendi: ${statusTexts[status]}`, 'success');
    } catch (e) {
      console.error('Update status failed:', e);
      showToast('Sipariş durumu güncellenemedi.', 'error');
    }
  }

  // 6. Digital Rewards (Scratch-Card winners)
  async addReward(rewardId, rewardData) {
    try {
      await setDoc(doc(db, 'rewards', rewardId), {
        ...rewardData,
        id: rewardId,
        code: rewardId,
        createdAt: new Date().toISOString()
      });
      showToast('Kupon kodunuz başarıyla kaydedildi!', 'success');
    } catch (e) {
      console.error('Add reward failed:', e);
      showToast('Ödül kaydedilemedi.', 'error');
    }
  }

  async markRewardUsed(rewardId) {
    try {
      await updateDoc(doc(db, 'rewards', rewardId), { used: true });
      showToast('Ödül kullanıldı olarak işaretlendi.', 'success');
    } catch (e) {
      console.error('Mark reward used failed:', e);
    }
  }
}

// Global Singleton
const store = new Store();
export default store;
export { store };
