/* ============================================================
   FATIH AKILLI SOFRA — Garson Çağrıları Yönetim Sayfası
   Waiter desk console for active waiter and payment calls
   ============================================================ */

import store from '../store.js';
import { timeAgo, showToast } from '../utils.js';

export default {
  render() {
    return `
      <div class="admin-page admin-calls">
        <div class="page-header flex justify-between align-center" style="margin-bottom: 2rem;">
          <div>
            <h1><span class="material-icons-round text-primary pulse-animation">notifications_active</span> Masa Çağrı Ekranı</h1>
            <p class="page-subtitle" style="color:var(--text-muted); margin-top:5px;">Müşterilerin garson ve hesap taleplerinin anlık olarak izlenmesi.</p>
          </div>
          
          <div class="audio-control-panel flex align-center gap-10">
            <span class="material-icons-round text-muted" id="btn-toggle-sound" style="cursor:pointer; font-size:28px;">volume_up</span>
            <span style="font-size:12px; font-weight:600; color:var(--text-muted);">Zil Sesli Bildirim Açık</span>
          </div>
        </div>

        <div class="calls-console-wrap">
          <!-- Pending Calls Section -->
          <div class="card" style="margin-bottom: 30px;">
            <div class="card-header flex align-center justify-between" style="border-bottom:1px solid var(--border-color); padding: 15px 20px;">
              <h2 style="font-weight: 700; color: var(--text-dark); margin:0;">Aktif Çağrılar</h2>
              <span class="badge badge-danger" id="calls-active-count">0 Aktif</span>
            </div>
            <div class="card-body" id="active-calls-list" style="padding: 20px;">
              <div class="text-center" style="padding: 40px;">Yükleniyor...</div>
            </div>
          </div>
        </div>
      </div>

      <style>
        .call-card-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px 20px;
          border: 1px solid var(--border-color);
          border-radius: 10px;
          margin-bottom: 15px;
          background: #fff;
          border-left: 5px solid var(--primary-color);
          box-shadow: 0 2px 6px rgba(0,0,0,0.02);
          animation: slideUp 0.3s ease;
        }
        .call-card-item.hesap_nakit, .call-card-item.hesap_nfc {
          border-left-color: #2e7d32; /* green for payment */
        }
        .call-card-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .call-card-icon-wrap.garson { background: rgba(200,16,46,0.1); color: var(--primary-color); }
        .call-card-icon-wrap.hesap_nfc { background: rgba(46,125,50,0.1); color: #2e7d32; }
        .call-card-icon-wrap.hesap_nakit { background: rgba(251,140,0,0.1); color: #fb8c00; }
        
        .call-card-details {
          flex: 1;
          margin-left: 15px;
        }
        .call-card-table {
          font-size: 16px;
          font-weight: 800;
          color: var(--text-dark);
        }
        .call-card-type {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-muted);
          margin-top: 2px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .call-card-time {
          font-size: 12px;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 2px;
        }
        .pulse-animation {
          animation: ring-bell 1.5s infinite;
        }
        @keyframes ring-bell {
          0% { transform: scale(1); }
          10% { transform: scale(0.9) rotate(-3deg); }
          20% { transform: scale(0.9) rotate(-3deg); }
          30% { transform: scale(1.1) rotate(3deg); }
          40% { transform: scale(1.1) rotate(-3deg); }
          50% { transform: scale(1.1) rotate(3deg); }
          60% { transform: scale(1) rotate(0deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
      </style>
    `;
  },

  init() {
    this.soundEnabled = true;
    this.previousCallCount = 0;

    // Listen to changes in calls state
    this.unsubscribe = store.subscribe((state) => {
      this.updateCallsUI(state.calls);
    });

    // Sound toggle listener
    const soundBtn = document.getElementById('btn-toggle-sound');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        this.soundEnabled = !this.soundEnabled;
        if (this.soundEnabled) {
          soundBtn.textContent = 'volume_up';
          soundBtn.nextElementSibling.textContent = 'Zil Sesli Bildirim Açık';
        } else {
          soundBtn.textContent = 'volume_off';
          soundBtn.nextElementSibling.textContent = 'Zil Sesli Bildirim Sessiz';
        }
      });
    }

    // Initialize timer for dynamic timeago update
    this.timer = setInterval(() => {
      this.updateTimeAgos();
    }, 30000);
  },

  updateCallsUI(calls) {
    const pendingCalls = calls.filter(c => c.status === 'pending');
    
    // Play alert sound if a new call arrives
    if (pendingCalls.length > this.previousCallCount) {
      this.playAlertSound();
    }
    this.previousCallCount = pendingCalls.length;

    // Update active badge
    const badge = document.getElementById('calls-active-count');
    if (badge) {
      badge.textContent = `${pendingCalls.length} Aktif`;
      if (pendingCalls.length > 0) {
        badge.className = 'badge badge-danger';
      } else {
        badge.className = 'badge badge-success';
      }
    }

    // Render list
    const listWrap = document.getElementById('active-calls-list');
    if (listWrap) {
      if (pendingCalls.length === 0) {
        listWrap.innerHTML = `
          <div class="text-center text-muted" style="padding: 40px 10px;">
            <span class="material-icons-round" style="font-size: 48px; color: #ddd; margin-bottom: 10px;">check_circle</span>
            <h3 style="font-weight:700; color:#888;">Harika! Bekleyen Çağrı Yok</h3>
            <p style="font-size:13px; color:#aaa; margin:5px 0 0;">Şu anda masalardan gelen aktif bir servis çağrısı bulunmuyor.</p>
          </div>
        `;
      } else {
        listWrap.innerHTML = pendingCalls.map(call => this.renderCallItem(call)).join('');
        this.bindCallResolvers();
      }
    }
  },

  renderCallItem(call) {
    let icon = 'notifications';
    let label = 'Servis İstiyor';
    
    if (call.type === 'hesap_nfc') {
      icon = 'contactless';
      label = 'Hesap İstiyor (Kart/NFC)';
    } else if (call.type === 'hesap_nakit') {
      icon = 'payments';
      label = 'Hesap İstiyor (Nakit)';
    }

    return `
      <div class="call-card-item ${call.type}" id="call-item-${call.id}">
        <div class="call-card-icon-wrap ${call.type}">
          <span class="material-icons-round ${call.status === 'pending' ? 'pulse-animation' : ''}">${icon}</span>
        </div>
        
        <div class="call-card-details">
          <div class="call-card-table">Masa ${call.tableNo}</div>
          <div class="call-card-type">
            <span class="material-icons-round" style="font-size: 16px;">label</span>
            <span>${label}</span>
          </div>
          <div class="call-card-time" data-time="${call.createdAt}">
            <span class="material-icons-round" style="font-size: 14px;">schedule</span>
            <span class="time-text">${timeAgo(call.createdAt)}</span>
          </div>
        </div>

        <button class="btn btn-sm btn-primary btn-complete-call" data-id="${call.id}" style="font-size:12px; background:#2e7d32; border-color:#2e7d32;">
          <span class="material-icons-round" style="font-size:16px; margin-right:4px;">done</span>
          <span>Tamamlandı</span>
        </button>
      </div>
    `;
  },

  bindCallResolvers() {
    document.querySelectorAll('.btn-complete-call').forEach(btn => {
      btn.addEventListener('click', async () => {
        const callId = btn.getAttribute('data-id');
        
        // Visual fade out
        const item = document.getElementById(`call-item-${callId}`);
        if (item) {
          item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          item.style.opacity = '0';
          item.style.transform = 'translateY(-10px)';
        }
        
        setTimeout(async () => {
          await store.completeCall(callId);
        }, 300);
      });
    });
  },

  updateTimeAgos() {
    document.querySelectorAll('.call-card-time').forEach(el => {
      const time = el.getAttribute('data-time');
      const textSpan = el.querySelector('.time-text');
      if (time && textSpan) {
        textSpan.textContent = timeAgo(time);
      }
    });
  },

  playAlertSound() {
    if (!this.soundEnabled) return;
    
    // Synthesize premium retro notification chime using Web Audio API
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      const playTone = (freq, duration, delay) => {
        setTimeout(() => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
          
          gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
          
          osc.start();
          osc.stop(audioCtx.currentTime + duration);
        }, delay * 1000);
      };

      // Play double premium notification bell
      playTone(587.33, 0.4, 0);   // D5
      playTone(880.00, 0.6, 0.15); // A5
      
    } catch (e) {
      console.warn('Audio synthesis failed:', e);
    }
  },

  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
};
