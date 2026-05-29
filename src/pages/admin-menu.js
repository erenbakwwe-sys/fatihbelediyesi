import { store } from '../store.js';
import { formatPrice, showToast, generateId } from '../utils.js';

let activeCategory = 'all';
let editingItem = null;

function getCategories() {
  return store.categories || [];
}

function getFilteredMenu() {
  const menu = store.menu || [];
  if (activeCategory === 'all') return menu;
  return menu.filter(item => item.category === activeCategory);
}

export function render() {
  const categories = getCategories();
  const menuItems = getFilteredMenu();
  const categoryMap = { starters: 'Başlangıçlar', mains: 'Ana Yemekler', kebabs: 'Kebaplar', desserts: 'Tatlılar', drinks: 'İçecekler' };

  return `
    <div class="admin-page admin-menu">
      <div class="page-header">
        <h1><span class="material-icons-round">restaurant_menu</span> Menü Yönetimi</h1>
        <div class="page-header-actions">
          <button class="btn btn-primary" id="btnAddItem">
            <span class="material-icons-round">add</span>
            Yeni Ürün Ekle
          </button>
        </div>
      </div>

      <!-- Category Filter Tabs -->
      <div class="filter-bar">
        <button class="filter-btn ${activeCategory === 'all' ? 'active' : ''}" data-category="all">
          Tümü <span class="filter-count">${(store.menu || []).length}</span>
        </button>
        ${categories.map(cat => {
          const count = (store.menu || []).filter(i => i.category === cat.id).length;
          return `
            <button class="filter-btn ${activeCategory === cat.id ? 'active' : ''}" data-category="${cat.id}">
              ${cat.name} <span class="filter-count">${count}</span>
            </button>
          `;
        }).join('')}
      </div>

      <!-- Menu Items Grid -->
      <div class="menu-grid">
        ${menuItems.length === 0 ? `
          <div class="empty-state">
            <span class="material-icons-round">fastfood</span>
            <h3>Ürün bulunamadı</h3>
            <p>${activeCategory !== 'all' ? 'Bu kategoride ürün yok.' : 'Henüz menüye ürün eklenmemiş.'}</p>
          </div>
        ` : menuItems.map(item => {
          const catLabel = categoryMap[item.category] || item.category || 'Diğer';
          return `
            <div class="menu-item-card ${item.active === false ? 'inactive' : ''}" data-item-id="${item.id}">
              <div class="menu-item-image">
                ${item.image ? `<img src="${item.image}" alt="${item.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />` : ''}
                <div class="menu-item-placeholder" ${item.image ? 'style="display:none"' : ''}>
                  <span class="material-icons-round">restaurant</span>
                </div>
                <div class="menu-item-category-tag">${catLabel}</div>
                ${item.active === false ? '<div class="inactive-overlay"><span>Pasif</span></div>' : ''}
              </div>
              <div class="menu-item-info">
                <h3 class="menu-item-name">${item.name}</h3>
                <p class="menu-item-desc">${item.description || 'Açıklama yok'}</p>
                <div class="menu-item-footer">
                  <span class="menu-item-price">${formatPrice ? formatPrice(item.price) : item.price + ' ₺'}</span>
                  <div class="menu-item-actions">
                    <label class="toggle-switch" title="${item.active !== false ? 'Aktif' : 'Pasif'}">
                      <input type="checkbox" ${item.active !== false ? 'checked' : ''} data-toggle-item="${item.id}" />
                      <span class="toggle-slider"></span>
                    </label>
                    <button class="btn btn-sm btn-outline" data-edit-item="${item.id}" title="Düzenle">
                      <span class="material-icons-round">edit</span>
                    </button>
                    <button class="btn btn-sm btn-danger" data-delete-item="${item.id}" title="Sil">
                      <span class="material-icons-round">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Add/Edit Modal -->
      <div class="modal-overlay" id="menuModal" style="display:none;">
        <div class="modal">
          <div class="modal-header">
            <h2 id="modalTitle">
              <span class="material-icons-round">add_circle</span>
              Yeni Ürün Ekle
            </h2>
            <button class="btn btn-sm btn-outline" id="btnCloseModal">
              <span class="material-icons-round">close</span>
            </button>
          </div>
          <div class="modal-body">
            <form id="menuItemForm">
              <div class="form-group">
                <label class="form-label">Ürün Adı *</label>
                <input type="text" class="form-input" id="itemName" placeholder="Ürün adını girin" required />
              </div>
              <div class="form-group">
                <label class="form-label">Açıklama</label>
                <textarea class="form-textarea" id="itemDescription" placeholder="Ürün açıklaması..." rows="3"></textarea>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Fiyat (₺) *</label>
                  <input type="number" class="form-input" id="itemPrice" placeholder="0.00" step="0.01" min="0" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Kategori *</label>
                  <select class="form-select" id="itemCategory" required>
                    <option value="">Kategori seçin</option>
                    ${categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('')}
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Görsel URL</label>
                <input type="url" class="form-input" id="itemImage" placeholder="https://ornek.com/gorsel.jpg" />
              </div>
              <div class="form-group">
                <label class="form-label">Durum</label>
                <label class="toggle-switch-label">
                  <input type="checkbox" id="itemActive" checked />
                  <span class="toggle-slider"></span>
                  <span class="toggle-text" id="activeText">Aktif</span>
                </label>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" id="btnCancelModal">İptal</button>
            <button class="btn btn-primary" id="btnSaveItem">
              <span class="material-icons-round">save</span>
              Kaydet
            </button>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div class="modal-overlay" id="deleteModal" style="display:none;">
        <div class="modal modal-sm">
          <div class="modal-header">
            <h2><span class="material-icons-round" style="color:#C8102E;">warning</span> Ürünü Sil</h2>
          </div>
          <div class="modal-body">
            <p class="delete-confirm-text">Bu ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p>
            <p class="delete-item-name" id="deleteItemName"></p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" id="btnCancelDelete">İptal</button>
            <button class="btn btn-danger" id="btnConfirmDelete">
              <span class="material-icons-round">delete</span>
              Sil
            </button>
          </div>
        </div>
      </div>
    </div>

    <style>
      .admin-menu .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
        gap: 1rem;
      }
      .admin-menu .page-header h1 {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.5rem;
        color: #1A1A2E;
        margin: 0;
      }
      .admin-menu .category-manager {
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        margin-bottom: 1.5rem;
        overflow: hidden;
      }
      .admin-menu .category-manager .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.25rem;
        border-bottom: 1px solid #f0f0f0;
        flex-wrap: wrap;
        gap: 0.75rem;
      }
      .admin-menu .category-manager h3 {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 0;
        font-size: 1rem;
        color: #1A1A2E;
      }
      .admin-menu .category-add-form {
        display: flex;
        gap: 0.5rem;
      }
      .admin-menu .category-add-form .form-input {
        width: 200px;
        padding: 0.4rem 0.75rem;
        border: 1px solid #ddd;
        border-radius: 8px;
        font-size: 0.85rem;
      }

      .admin-menu .filter-bar {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
      }
      .admin-menu .filter-btn {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.5rem 1rem;
        border: 2px solid #e0e0e0;
        background: #fff;
        border-radius: 10px;
        font-size: 0.85rem;
        font-weight: 500;
        color: #666;
        cursor: pointer;
        transition: all 0.2s;
      }
      .admin-menu .filter-btn:hover { border-color: #C8102E; color: #C8102E; }
      .admin-menu .filter-btn.active {
        background: #C8102E;
        border-color: #C8102E;
        color: #fff;
      }
      .admin-menu .filter-count {
        min-width: 20px;
        height: 20px;
        border-radius: 10px;
        font-size: 0.7rem;
        font-weight: 700;
        background: #e0e0e0;
        color: #666;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0 0.3rem;
      }
      .admin-menu .filter-btn.active .filter-count {
        background: rgba(255,255,255,0.3);
        color: #fff;
      }

      .admin-menu .menu-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1.25rem;
      }
      .admin-menu .menu-item-card {
        background: #fff;
        border-radius: 14px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.06);
        overflow: hidden;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      .admin-menu .menu-item-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0,0,0,0.1);
      }
      .admin-menu .menu-item-card.inactive { opacity: 0.65; }

      .admin-menu .menu-item-image {
        position: relative;
        height: 160px;
        background: #f5f5f5;
        overflow: hidden;
      }
      .admin-menu .menu-item-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .admin-menu .menu-item-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #f5f5f5, #e0e0e0);
      }
      .admin-menu .menu-item-placeholder .material-icons-round {
        font-size: 40px;
        color: #ccc;
      }
      .admin-menu .menu-item-category-tag {
        position: absolute;
        top: 8px;
        left: 8px;
        background: rgba(26, 26, 46, 0.8);
        color: #fff;
        padding: 0.2rem 0.6rem;
        border-radius: 6px;
        font-size: 0.7rem;
        font-weight: 600;
      }
      .admin-menu .inactive-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .admin-menu .inactive-overlay span {
        background: #C8102E;
        color: #fff;
        padding: 0.3rem 1rem;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 600;
      }

      .admin-menu .menu-item-info { padding: 1rem 1.25rem; }
      .admin-menu .menu-item-name {
        margin: 0 0 0.25rem;
        font-size: 1.05rem;
        color: #1A1A2E;
      }
      .admin-menu .menu-item-desc {
        margin: 0 0 0.75rem;
        font-size: 0.8rem;
        color: #999;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .admin-menu .menu-item-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .admin-menu .menu-item-price {
        font-size: 1.2rem;
        font-weight: 700;
        color: #C8102E;
      }
      .admin-menu .menu-item-actions {
        display: flex;
        align-items: center;
        gap: 0.35rem;
      }
      .admin-menu .menu-item-actions .btn-sm {
        padding: 0.3rem;
        min-width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        border: 1px solid #e0e0e0;
        background: #fff;
        cursor: pointer;
        transition: all 0.2s;
      }
      .admin-menu .menu-item-actions .btn-sm:hover { background: #f5f5f5; }
      .admin-menu .menu-item-actions .btn-sm .material-icons-round { font-size: 16px; }
      .admin-menu .menu-item-actions .btn-danger { border-color: #ffcdd2; color: #C8102E; }
      .admin-menu .menu-item-actions .btn-danger:hover { background: #ffebee; }

      /* Toggle Switch */
      .admin-menu .toggle-switch,
      .admin-menu .toggle-switch-label {
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
      }
      .admin-menu .toggle-switch input,
      .admin-menu .toggle-switch-label input {
        opacity: 0;
        width: 0;
        height: 0;
        position: absolute;
      }
      .admin-menu .toggle-slider {
        width: 38px;
        height: 20px;
        background: #ccc;
        border-radius: 10px;
        position: relative;
        transition: background 0.3s;
        flex-shrink: 0;
      }
      .admin-menu .toggle-slider::after {
        content: '';
        position: absolute;
        width: 16px;
        height: 16px;
        background: #fff;
        border-radius: 50%;
        top: 2px;
        left: 2px;
        transition: transform 0.3s;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
      }
      .admin-menu input:checked + .toggle-slider { background: #4caf50; }
      .admin-menu input:checked + .toggle-slider::after { transform: translateX(18px); }

      /* Modal */
      .admin-menu .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 1rem;
        animation: fadeIn 0.2s;
      }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      .admin-menu .modal {
        background: #fff;
        border-radius: 16px;
        width: 100%;
        max-width: 520px;
        max-height: 90vh;
        overflow-y: auto;
        animation: slideUp 0.3s;
      }
      .admin-menu .modal-sm { max-width: 400px; }
      @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      .admin-menu .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.25rem 1.5rem;
        border-bottom: 1px solid #f0f0f0;
      }
      .admin-menu .modal-header h2 {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 0;
        font-size: 1.15rem;
        color: #1A1A2E;
      }
      .admin-menu .modal-body { padding: 1.5rem; }
      .admin-menu .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
        padding: 1rem 1.5rem;
        border-top: 1px solid #f0f0f0;
      }
      .admin-menu .form-group { margin-bottom: 1rem; }
      .admin-menu .form-label {
        display: block;
        margin-bottom: 0.35rem;
        font-size: 0.85rem;
        font-weight: 600;
        color: #444;
      }
      .admin-menu .form-input,
      .admin-menu .form-textarea,
      .admin-menu .form-select {
        width: 100%;
        padding: 0.6rem 0.85rem;
        border: 1.5px solid #ddd;
        border-radius: 8px;
        font-size: 0.9rem;
        transition: border-color 0.2s;
        background: #fff;
        box-sizing: border-box;
      }
      .admin-menu .form-input:focus,
      .admin-menu .form-textarea:focus,
      .admin-menu .form-select:focus {
        outline: none;
        border-color: #C8102E;
        box-shadow: 0 0 0 3px rgba(200,16,46,0.1);
      }
      .admin-menu .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }
      .admin-menu .btn {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.55rem 1.25rem;
        border-radius: 8px;
        font-size: 0.9rem;
        font-weight: 600;
        border: none;
        cursor: pointer;
        transition: all 0.2s;
      }
      .admin-menu .btn-primary { background: #C8102E; color: #fff; }
      .admin-menu .btn-primary:hover { background: #a00d25; }
      .admin-menu .btn-outline { background: #fff; border: 1.5px solid #ddd; color: #666; }
      .admin-menu .btn-outline:hover { background: #f5f5f5; }
      .admin-menu .btn-danger { background: #C8102E; color: #fff; }
      .admin-menu .btn-danger:hover { background: #a00d25; }
      .admin-menu .btn-sm { font-size: 0.8rem; padding: 0.35rem 0.75rem; }

      .admin-menu .delete-confirm-text { color: #666; margin: 0 0 0.5rem; }
      .admin-menu .delete-item-name {
        font-weight: 700;
        color: #1A1A2E;
        font-size: 1.1rem;
        margin: 0;
      }

      .admin-menu .empty-state {
        text-align: center;
        padding: 4rem 2rem;
        color: #aaa;
        grid-column: 1 / -1;
      }
      .admin-menu .empty-state .material-icons-round {
        font-size: 56px;
        margin-bottom: 1rem;
        color: #ddd;
      }
      .admin-menu .empty-state h3 { margin: 0 0 0.5rem; color: #888; }
    </style>
  `;
}

export function init() {
  let deleteTargetId = null;

  const modal = document.getElementById('menuModal');
  const deleteModal = document.getElementById('deleteModal');

  function openModal(item = null) {
    editingItem = item;
    const title = document.getElementById('modalTitle');
    if (item) {
      title.innerHTML = '<span class="material-icons-round">edit</span> Ürünü Düzenle';
      document.getElementById('itemName').value = item.name || '';
      document.getElementById('itemDescription').value = item.description || '';
      document.getElementById('itemPrice').value = item.price || '';
      document.getElementById('itemCategory').value = item.category || '';
      document.getElementById('itemImage').value = item.image || '';
      document.getElementById('itemActive').checked = item.active !== false;
    } else {
      title.innerHTML = '<span class="material-icons-round">add_circle</span> Yeni Ürün Ekle';
      document.getElementById('menuItemForm').reset();
      document.getElementById('itemActive').checked = true;
    }
    updateActiveText();
    modal.style.display = 'flex';
  }

  function closeModal() {
    modal.style.display = 'none';
    editingItem = null;
  }

  function updateActiveText() {
    const activeText = document.getElementById('activeText');
    const checkbox = document.getElementById('itemActive');
    if (activeText && checkbox) {
      activeText.textContent = checkbox.checked ? 'Aktif' : 'Pasif';
    }
  }

  function reRender() {
    const container = document.querySelector('.admin-menu');
    if (container) {
      container.outerHTML = render();
      init();
    }
  }

  // Add item button
  const btnAdd = document.getElementById('btnAddItem');
  if (btnAdd) btnAdd.addEventListener('click', () => openModal());

  // Close/Cancel modal
  const btnClose = document.getElementById('btnCloseModal');
  const btnCancel = document.getElementById('btnCancelModal');
  if (btnClose) btnClose.addEventListener('click', closeModal);
  if (btnCancel) btnCancel.addEventListener('click', closeModal);

  // Active toggle text
  const itemActive = document.getElementById('itemActive');
  if (itemActive) itemActive.addEventListener('change', updateActiveText);

  // Save item
  const btnSave = document.getElementById('btnSaveItem');
  if (btnSave) {
    btnSave.addEventListener('click', () => {
      const name = document.getElementById('itemName').value.trim();
      const description = document.getElementById('itemDescription').value.trim();
      const price = parseFloat(document.getElementById('itemPrice').value);
      const category = document.getElementById('itemCategory').value;
      const image = document.getElementById('itemImage').value.trim();
      const active = document.getElementById('itemActive').checked;

      if (!name || !price || !category) {
        showToast && showToast('Lütfen zorunlu alanları doldurun', 'error');
        return;
      }

      const itemData = { name, description, price, category, image, active };

      if (editingItem) {
        store.updateMenuItem(editingItem.id, itemData);
      } else {
        const newItem = { id: generateId('MENU'), ...itemData };
        store.addMenuItem(newItem);
      }

      closeModal();
      // Small delay to let store update before re-render
      setTimeout(() => reRender(), 50);
    });
  }

  // Category filter tabs
  document.querySelectorAll('.admin-menu .filter-btn[data-category]').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategory = btn.dataset.category;
      reRender();
    });
  });

  // Toggle active/inactive
  document.querySelectorAll('[data-toggle-item]').forEach(toggle => {
    toggle.addEventListener('change', () => {
      const id = toggle.dataset.toggleItem;
      store.updateMenuItem(id, { active: toggle.checked });
    });
  });

  // Edit buttons
  document.querySelectorAll('[data-edit-item]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.editItem;
      const menu = store.menu || [];
      const item = menu.find(i => i.id === id);
      if (item) openModal(item);
    });
  });

  // Delete buttons
  document.querySelectorAll('[data-delete-item]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.deleteItem;
      const menu = store.menu || [];
      const item = menu.find(i => i.id === id);
      deleteTargetId = id;
      const nameEl = document.getElementById('deleteItemName');
      if (nameEl) nameEl.textContent = item ? item.name : '';
      deleteModal.style.display = 'flex';
    });
  });

  // Cancel delete
  const btnCancelDel = document.getElementById('btnCancelDelete');
  if (btnCancelDel) {
    btnCancelDel.addEventListener('click', () => {
      deleteModal.style.display = 'none';
      deleteTargetId = null;
    });
  }

  // Confirm delete
  const btnConfirmDel = document.getElementById('btnConfirmDelete');
  if (btnConfirmDel) {
    btnConfirmDel.addEventListener('click', () => {
      if (deleteTargetId) {
        store.deleteMenuItem(deleteTargetId);
      }
      deleteModal.style.display = 'none';
      deleteTargetId = null;
      setTimeout(() => reRender(), 50);
    });
  }

  // Add category
  const btnAddCat = document.getElementById('btnAddCategory');
  if (btnAddCat) {
    btnAddCat.addEventListener('click', () => {
      const input = document.getElementById('newCategoryInput');
      const name = input ? input.value.trim() : '';
      if (!name) {
        showToast && showToast('Kategori adı girin', 'error');
        return;
      }
      const cats = getCategories();
      if (cats.includes(name)) {
        showToast && showToast('Bu kategori zaten var', 'error');
        return;
      }
      if (store.categories) {
        store.categories.push(name);
      } else {
        store.categories = [...getCategories(), name];
      }
      showToast && showToast('Kategori eklendi', 'success');
      reRender();
    });
  }

  // Close modals on overlay click
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
  if (deleteModal) {
    deleteModal.addEventListener('click', (e) => {
      if (e.target === deleteModal) {
        deleteModal.style.display = 'none';
        deleteTargetId = null;
      }
    });
  }
}
