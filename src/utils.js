/* ============================================================
   FATIH AKILLI SOFRA — Utility Functions
   ============================================================ */

/**
 * Formats a numeric price into a Turkish Lira string (e.g. 250 -> ₺250)
 * @param {number} amount 
 * @returns {string}
 */
export function formatPrice(amount) {
  const value = typeof amount === 'number' ? amount : parseFloat(amount || 0);
  return `₺${value.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

/**
 * Formats a Date object or timestamp into DD.MM.YYYY
 * @param {Date|string|number} date 
 * @returns {string}
 */
export function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

/**
 * Formats a Date object or timestamp into HH:MM
 * @param {Date|string|number} date 
 * @returns {string}
 */
export function formatTime(date) {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Formats a Date object or timestamp into DD.MM.YYYY HH:MM
 * @param {Date|string|number} date 
 * @returns {string}
 */
export function formatDateTime(date) {
  if (!date) return '';
  return `${formatDate(date)} ${formatTime(date)}`;
}

/**
 * Generates a unique ID with a specified prefix (e.g., "APO-511482")
 * @param {string} prefix 
 * @returns {string}
 */
export function generateId(prefix = 'APO') {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${randomNum}`;
}

/**
 * Creates and displays a premium animated Toast Notification.
 * It uses the #toast-container element in index.html.
 * @param {string} message 
 * @param {'success'|'error'|'info'|'warning'} type 
 */
export function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type} slideInRight`;
  
  let icon = 'info';
  if (type === 'success') icon = 'check_circle';
  if (type === 'error') icon = 'error';
  if (type === 'warning') icon = 'warning';

  toast.innerHTML = `
    <span class="material-icons-round toast-icon">${icon}</span>
    <span class="toast-message">${escapeHtml(message)}</span>
    <span class="material-icons-round toast-close" onclick="this.parentElement.remove()">close</span>
  `;

  container.appendChild(toast);

  // Auto-remove toast after 4 seconds with fade-out
  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.5s forwards';
    setTimeout(() => {
      toast.remove();
    }, 500);
  }, 4000);
}

/**
 * Counts up a number element dynamically from 0 to a target value.
 * @param {HTMLElement} element 
 * @param {number} target 
 * @param {number} duration ms
 */
export function animateNumber(element, target, duration = 1000) {
  if (!element) return;
  const start = 0;
  const end = parseInt(target, 10) || 0;
  if (start === end) {
    element.textContent = end;
    return;
  }
  
  const startTime = performance.now();

  function updateNumber(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // EaseOutQuad
    const ease = progress * (2 - progress);
    const current = Math.floor(ease * (end - start) + start);
    
    element.textContent = current.toLocaleString('tr-TR');
    
    if (progress < 1) {
      requestAnimationFrame(updateNumber);
    } else {
      element.textContent = end.toLocaleString('tr-TR');
    }
  }

  requestAnimationFrame(updateNumber);
}

/**
 * Standard debounce implementation.
 * @param {Function} fn 
 * @param {number} delay 
 * @returns {Function}
 */
export function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Escapes HTML characters to prevent XSS.
 * @param {string} str 
 * @returns {string}
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Returns a human-friendly relative time (e.g., "5 dk önce")
 * @param {Date|string|number} date 
 * @returns {string}
 */
export function timeAgo(date) {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const seconds = Math.floor((new Date() - d) / 1000);
  if (seconds < 0) return 'şimdi';
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return `${interval} yıl önce`;
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return `${interval} ay önce`;
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `${interval} gün önce`;
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `${interval} saat önce`;
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return `${interval} dk önce`;
  
  return 'şimdi';
}
