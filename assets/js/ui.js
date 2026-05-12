// ═══════════════════════════════════════
// ui.js — Modal, Toast & Star Rating UI
// ═══════════════════════════════════════

// ─── Modal ───────────────────────────

function openModal(html) {
  document.getElementById('modal-box').innerHTML = html;
  document.getElementById('modal-overlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}

function handleOverlayClick(e) {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
}

// ─── Toast ───────────────────────────

function showToast(msg, type = 'success', icon = '✅') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${msg}</span>`;
  container.appendChild(toast);

  // Trigger animation on next frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('visible'));
  });

  // Auto-dismiss after 3.2 seconds
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

// Make toast globally available for inline onclick handlers
window.showToast = showToast;

// ─── Star Rating ─────────────────────

function initStars() {
  document.querySelectorAll('.star').forEach(star => {
    star.style.color = '#D1D5DB';
  });
}

function setRating(group, val) {
  const stars = document.querySelectorAll(`#stars-${group} .star`);
  stars.forEach((s, i) => {
    s.style.color = i < val ? '#F59E0B' : '#D1D5DB';
  });
}
