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

// Helper: race a promise against a timeout so nothing hangs
function withTimeout(promise, ms = 1500) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))
  ]);
}

class Store {
  constructor() {
    this.listeners = [];
    
    // Core state - IMMEDIATE OPTIMISTIC LOCAL LOADING for instant 0ms rendering
    this.state = {
      menu: INITIAL_MENU,
      tables: INITIAL_TABLES,
      orders: INITIAL_ORDERS,
      calls: INITIAL_CALLS,
      rewards: INITIAL_REWARDS,
      cart: this.loadCartFromStorage(),
      currentTable: this.parseTableFromUrl(),
      loading: false
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
  get cart() { return this.state.cart; }
  get currentTable() { return this.state.currentTable; }
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
    listener(this.state, null, null);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  emit(event = null, payload = null) {
    this.listeners.forEach(listener => {
      try { listener(this.state, event, payload); } catch(e) { console.error(e); }
    });
  }

  // ── LocalStorage Cart ───────────────────────────────────────
  loadCartFromStorage() {
    try {
      const stored = localStorage.getItem('fatih_akilli_sofra_cart');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  saveCartToStorage() {
    try {
      localStorage.setItem('fatih_akilli_sofra_cart', JSON.stringify(this.state.cart));
    } catch (e) {}
  }

  // ── URL Query Parser ────────────────────────────────────────
  parseTableFromUrl() {
    const searchParams = new URLSearchParams(window.location.search);
    let table = searchParams.get('table');
    
    if (!table) {
      const hash = window.location.hash;
      const match = hash.match(/[?&]table=([^&]+)/);
      table = match ? match[1] : null;
    }
    
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
          await this.seedCollection('menu', INITIAL_MENU).catch(() => {});
        } else {
          this.state.menu = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          this.emit();
        }
      }, () => {
        if (!menuFallbackUsed) {
          menuFallbackUsed = true;
          this.state.menu = INITIAL_MENU;
          this.emit();
        }
      });

      // Sync Tables
      onSnapshot(collection(db, 'tables'), async (snapshot) => {
        if (snapshot.empty) {
          await this.seedCollection('tables', INITIAL_TABLES).catch(() => {});
        } else {
          this.state.tables = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
            .sort((a, b) => a.tableNo - b.tableNo);
          this.emit();
        }
      }, () => {
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
          await this.seedCollection('orders', INITIAL_ORDERS).catch(() => {});
        } else {
          const newOrders = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          // Detect newly added orders for notification
          if (this.state.orders.length > 0 && newOrders.length > this.state.orders.length) {
            const added = newOrders.filter(n => !this.state.orders.find(o => o.id === n.id));
            added.forEach(o => this.emit('NEW_ORDER', o));
          }
          this.state.orders = newOrders;
          this.emit();
        }
      }, () => {
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
          await this.seedCollection('calls', INITIAL_CALLS).catch(() => {});
        } else {
          const newCalls = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          if (this.state.calls.length > 0 && newCalls.length > this.state.calls.length) {
            const added = newCalls.filter(n => !this.state.calls.find(o => o.id === n.id));
            added.forEach(c => this.emit('NEW_CALL', c));
          }
          this.state.calls = newCalls;
          this.emit();
        }
      }, () => {
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
          await this.seedCollection('rewards', INITIAL_REWARDS).catch(() => {});
        } else {
          this.state.rewards = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          this.emit();
        }
      }, () => {
        if (!rewardsFallbackUsed) {
          rewardsFallbackUsed = true;
          this.state.rewards = INITIAL_REWARDS;
          this.emit();
        }
      });

    } catch (error) {
      console.error('Firebase init failed:', error);
      this.state.menu = INITIAL_MENU;
      this.state.tables = INITIAL_TABLES;
      this.state.orders = INITIAL_ORDERS;
      this.state.calls = INITIAL_CALLS;
      this.state.rewards = INITIAL_REWARDS;
      this.emit();
    }
  }

  // Seeding helper
  async seedCollection(colName, defaultData) {
    try {
      const batch = writeBatch(db);
      defaultData.forEach(item => {
        const docRef = doc(collection(db, colName), item.id);
        const { id, ...data } = item;
        batch.set(docRef, data);
      });
      await withTimeout(batch.commit(), 3000);
    } catch (e) {
      console.warn(`Seeding ${colName} failed (offline mode):`, e.message);
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
    if (item) showToast(`${item.name} sepetten çıkarıldı.`, 'info');
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
  
  // 1. Place Order — ALWAYS succeeds (local first, Firebase in background)
  async placeOrder(orderId, paymentMethod, note = '') {
    if (this.state.cart.length === 0) return null;

    const orderData = {
      tableNo: this.state.currentTable || 1,
      items: [...this.state.cart],
      note: note,
      subtotal: this.getCartTotal(),
      total: this.getCartTotal(),
      paymentMethod: paymentMethod,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // 1) Update local state IMMEDIATELY (optimistic)
    this.state.orders.unshift({ id: orderId, ...orderData });

    // 2) Update table status locally
    if (this.state.currentTable) {
      const table = this.state.tables.find(t => t.tableNo === this.state.currentTable);
      if (table) table.status = 'dining';
    }

    // 3) Clear cart
    this.clearCart();
    this.emit('NEW_ORDER', { id: orderId, ...orderData });
    showToast('Siparişiniz başarıyla mutfağa iletildi!');

    // 4) Try Firebase in background (non-blocking)
    withTimeout(setDoc(doc(db, 'orders', orderId), orderData)).catch(e => {
      console.warn('Firebase order save failed (offline):', e.message);
    });

    if (this.state.currentTable) {
      const table = this.state.tables.find(t => t.tableNo === this.state.currentTable);
      if (table) {
        withTimeout(updateDoc(doc(db, 'tables', table.id), { status: 'dining' })).catch(() => {});
      }
    }

    return orderId;
  }

  // 2. Waiter Call — ALWAYS succeeds
  async addCall(type = 'garson') {
    const tableNo = this.state.currentTable;
    if (!tableNo) {
      showToast('Masa numarası bulunamadı. Lütfen QR kodu okutun.', 'error');
      return;
    }

    const callData = {
      tableNo: tableNo,
      type: type,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const localId = 'call-' + Date.now();

    // 1) Update local state IMMEDIATELY
    this.state.calls.unshift({ id: localId, ...callData });
    
    // Update table status locally
    const table = this.state.tables.find(t => t.tableNo === tableNo);
    if (table && table.status !== 'dining') {
      table.status = 'calling';
    }

    const typeText = type === 'garson' ? 'Garson' : 'Hesap';
    showToast(`${typeText} çağrısı gönderildi!`);
    this.emit('NEW_CALL', { id: localId, ...callData });

    // 2) Try Firebase in background
    withTimeout(addDoc(collection(db, 'calls'), callData)).catch(e => {
      console.warn('Firebase call save failed (offline):', e.message);
    });

    if (table && table.status !== 'dining') {
      withTimeout(updateDoc(doc(db, 'tables', table.id), { status: 'calling' })).catch(() => {});
    }
  }

  async completeCall(callId) {
    // Local first
    const call = this.state.calls.find(c => c.id === callId);
    this.state.calls = this.state.calls.filter(c => c.id !== callId);

    if (call) {
      const remainingCalls = this.state.calls.filter(c => c.tableNo === call.tableNo);
      if (remainingCalls.length === 0) {
        const table = this.state.tables.find(t => t.tableNo === call.tableNo);
        if (table) table.status = 'empty';
      }
    }

    this.emit();
    showToast('Çağrı tamamlandı.', 'success');

    // Firebase in background
    withTimeout(deleteDoc(doc(db, 'calls', callId))).catch(() => {});
    if (call) {
      const remainingCalls = this.state.calls.filter(c => c.tableNo === call.tableNo);
      if (remainingCalls.length === 0) {
        const table = this.state.tables.find(t => t.tableNo === call.tableNo);
        if (table) {
          withTimeout(updateDoc(doc(db, 'tables', table.id), { status: 'empty' })).catch(() => {});
        }
      }
    }
  }

  // 3. Admin Menu Management — all optimistic local-first
  async addMenuItem(item) {
    // Local first
    this.state.menu.push({ ...item, active: true });
    this.emit();
    showToast('Yeni menü ürünü eklendi.', 'success');

    // Firebase background
    withTimeout(setDoc(doc(db, 'menu', item.id), { ...item, active: true })).catch(e => {
      console.warn('Firebase addMenuItem failed:', e.message);
    });
  }

  async updateMenuItem(itemId, data) {
    // Local first
    const idx = this.state.menu.findIndex(m => m.id === itemId);
    if (idx !== -1) {
      this.state.menu[idx] = { ...this.state.menu[idx], ...data };
      this.emit();
    }
    showToast('Menü ürünü güncellendi.', 'success');

    // Firebase background
    withTimeout(updateDoc(doc(db, 'menu', itemId), data)).catch(e => {
      console.warn('Firebase updateMenuItem failed:', e.message);
    });
  }

  async deleteMenuItem(itemId) {
    // Local first
    this.state.menu = this.state.menu.filter(m => m.id !== itemId);
    this.emit();
    showToast('Ürün menüden kaldırıldı.', 'info');

    // Firebase background
    withTimeout(deleteDoc(doc(db, 'menu', itemId))).catch(e => {
      console.warn('Firebase deleteMenuItem failed:', e.message);
    });
  }

  // 4. Admin Table Operations
  async addTable(tableNo, nfcTagId) {
    const newTable = {
      id: `t${tableNo}`,
      tableNo: parseInt(tableNo, 10),
      nfcTagId: nfcTagId || `NFC-FATIH-T${String(tableNo).padStart(2, '0')}`,
      status: 'empty',
      active: true
    };

    // Local first
    this.state.tables.push(newTable);
    this.state.tables.sort((a, b) => a.tableNo - b.tableNo);
    this.emit();
    showToast(`Masa ${tableNo} başarıyla eklendi.`, 'success');

    // Firebase background
    const { id, ...data } = newTable;
    withTimeout(setDoc(doc(db, 'tables', id), data)).catch(e => {
      console.warn('Firebase addTable failed:', e.message);
    });
  }

  async toggleTableActive(tableId, active) {
    // Local first
    const table = this.state.tables.find(t => t.id === tableId);
    if (table) {
      table.active = active;
      this.emit();
    }
    showToast('Masa durumu güncellendi.', 'success');

    // Firebase background
    withTimeout(updateDoc(doc(db, 'tables', tableId), { active })).catch(() => {});
  }

  // 5. Admin Order Actions
  async updateOrderStatus(orderId, status) {
    // Local first
    const order = this.state.orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      if (status === 'delivered') {
        const table = this.state.tables.find(t => t.tableNo === order.tableNo);
        if (table) table.status = 'empty';
      }
    }
    this.emit();

    const statusTexts = { pending: 'Beklemede', preparing: 'Hazırlanıyor', delivered: 'Teslim Edildi' };
    showToast(`Sipariş durumu: ${statusTexts[status]}`, 'success');

    // Firebase background
    withTimeout(updateDoc(doc(db, 'orders', orderId), { status })).catch(() => {});
    if (status === 'delivered' && order) {
      const table = this.state.tables.find(t => t.tableNo === order.tableNo);
      if (table) {
        withTimeout(updateDoc(doc(db, 'tables', table.id), { status: 'empty' })).catch(() => {});
      }
    }
  }

  // 6. Digital Rewards
  async addReward(rewardId, rewardData) {
    const fullReward = {
      ...rewardData,
      id: rewardId,
      code: rewardId,
      createdAt: new Date().toISOString()
    };

    // Local first
    this.state.rewards.unshift(fullReward);
    this.emit();
    showToast('Kupon kodunuz kaydedildi!', 'success');

    // Firebase background
    withTimeout(setDoc(doc(db, 'rewards', rewardId), fullReward)).catch(() => {});
  }

  async markRewardUsed(rewardId) {
    // Local first
    const reward = this.state.rewards.find(r => r.id === rewardId);
    if (reward) reward.used = true;
    this.emit();
    showToast('Ödül kullanıldı olarak işaretlendi.', 'success');

    // Firebase background
    withTimeout(updateDoc(doc(db, 'rewards', rewardId), { used: true })).catch(() => {});
  }
}

// Global Singleton
const store = new Store();
export default store;
export { store };
