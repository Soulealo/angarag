// ═══════════════════════════════════════
// nav.js — Sidebar Navigation & Panel Router
// ═══════════════════════════════════════

const NAV = {
  admin: [
    { section: 'Үндсэн' },
    { id: 'dashboard', icon: '◻', label: 'Хяналтын самбар' },
    { section: 'Дэлгүүр' },
    { id: 'products',   icon: '🛒', label: 'Бүтээгдэхүүн' },
    { id: 'categories', icon: '🏷️', label: 'Ангилал' },
    { id: 'payment-info', icon: '💳', label: 'Төлбөрийн мэдээлэл' },
    { section: 'Удирдлага' },
    { id: 'users',     icon: '👥', label: 'Хэрэглэгчид',  badge: 2 },
    { id: 'orders',    icon: '📋', label: 'Бүх захиалга' },
    { id: 'employees', icon: '👷', label: 'Ажилтнууд' },
    { section: 'Тайлан' },
    { id: 'reports',   icon: '📈', label: 'Тайлан' },
    { id: 'settings',  icon: '⚙️', label: 'Тохиргоо' },
  ],
  manager: [
    { section: 'Үндсэн' },
    { id: 'dashboard', icon: '◻', label: 'Хяналтын самбар' },
    { section: 'Ажил' },
    { id: 'orders',    icon: '📋', label: 'Захиалгууд', badge: 3 },
    { id: 'assign',    icon: '⚡', label: 'Хуваарилах' },
    { id: 'employees', icon: '👷', label: 'Ажилтнууд' },
    { section: 'Тайлан' },
    { id: 'reports',   icon: '📈', label: 'Тайлан' },
  ],
  electrician: [
    { section: 'Үндсэн' },
    { id: 'dashboard', icon: '◻', label: 'Миний самбар' },
    { section: 'Ажил' },
    { id: 'tasks',   icon: '⚡', label: 'Миний ажлууд', badge: 2 },
    { id: 'history', icon: '🕐', label: 'Түүх' },
    { section: 'Профайл' },
    { id: 'profile', icon: '👤', label: 'Профайл' },
  ],
  customer: [
    { section: 'Үндсэн' },
    { id: 'dashboard',  icon: '◻', label: 'Нүүр хуудас' },
    { section: 'Захиалга' },
    { id: 'new-order',  icon: '➕', label: 'Захиалга өгөх' },
    { id: 'my-orders',  icon: '📋', label: 'Миний захиалгууд' },
    { section: 'Тооцоо' },
    { id: 'payment',    icon: '💳', label: 'Төлбөр' },
    { id: 'reviews',    icon: '⭐', label: 'Үнэлгээ' },
  ],
};

function buildNav(role) {
  const items = NAV[role];
  let html = '';
  items.forEach(item => {
    if (item.section) {
      html += `<div class="nav-section-label">${item.section}</div>`;
    } else {
      html += `
        <div class="nav-item" id="nav-${item.id}" onclick="showPanel('${item.id}')">
          <div class="nav-icon-wrap">${item.icon}</div>
          <span style="flex:1">${item.label}</span>
          ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
        </div>`;
    }
  });
  document.getElementById('sidebar-nav').innerHTML = html;
}

async function showPanel(id) {
  STATE.activePanel = id;

  // Update active nav item
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navEl = document.getElementById('nav-' + id);
  if (navEl) navEl.classList.add('active');

  // Page titles per role
  const pages = {
    admin:       { dashboard: 'Хяналтын самбар', products: 'Бүтээгдэхүүн', categories: 'Ангилал', 'payment-info': 'Төлбөрийн мэдээлэл', users: 'Хэрэглэгч удирдлага', orders: 'Бүх захиалга', employees: 'Ажилтнууд', reports: 'Тайлан', settings: 'Тохиргоо' },
    manager:     { dashboard: 'Хяналтын самбар', orders: 'Захиалгууд', assign: 'Хуваарилах', employees: 'Ажилтнууд', reports: 'Тайлан' },
    electrician: { dashboard: 'Миний самбар', tasks: 'Миний ажлууд', history: 'Гүйцэтгэлийн түүх', profile: 'Профайл' },
    customer:    { dashboard: 'Нүүр хуудас', 'new-order': 'Захиалга өгөх', 'my-orders': 'Миний захиалгууд', payment: 'Төлбөр', reviews: 'Үнэлгээ' },
  };

  const title = (pages[STATE.role] || {})[id] || id;
  document.getElementById('topbar-title').textContent = title;
  document.getElementById('topbar-crumb').textContent = 'ДСЦТС › ' + title;

  // Route to the correct panel renderer
  const renders = {
    admin:       renderAdmin,
    manager:     renderManager,
    electrician: renderElectrician,
    customer:    renderCustomer,
  };

  const contentArea = document.getElementById('content-area');
  contentArea.innerHTML = '<div class="panel active"><div class="empty-state"><div class="empty-state-icon">⏳</div><div class="empty-state-title">Уншиж байна...</div></div></div>';

  try {
    if (typeof loadPanelData === 'function') {
      await loadPanelData(STATE.role, id);
    }

    contentArea.innerHTML = renders[STATE.role](id);
  } catch (error) {
    contentArea.innerHTML = `<div class="panel active"><div class="empty-state"><div class="empty-state-icon">⚠️</div><div class="empty-state-title">Мэдээлэл авахад алдаа гарлаа</div><div class="empty-state-sub">${error.message}</div></div></div>`;
  }

  if (id === 'reviews') initStars();
}
