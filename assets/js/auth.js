// ═══════════════════════════════════════
// auth.js — JWT Login, Logout, App State
// ═══════════════════════════════════════

let STATE = {
  role: null,
  selectedRole: null,
  activePanel: null,
  ratingValue: 0,
  user: null
};

const DEMO_EMAILS = {
  admin: 'admin@example.com',
  manager: 'manager@example.com',
  electrician: 'electrician@example.com',
  customer: 'user@example.com'
};

function currentPageName() {
  return window.location.pathname.split('/').pop() || 'index.html';
}

function selectRole(role, el) {
  STATE.selectedRole = role;
  document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  document.getElementById('login-user-input').value = DEMO_EMAILS[role] || '';
}

function showRegisterForm() {
  document.getElementById('auth-title').textContent = 'Бүртгэл үүсгэх';
  document.getElementById('auth-subtitle').textContent = 'Шинэ хэрэглэгчийн бүртгэл үүсгэнэ үү';
  document.getElementById('login-panel').style.display = 'none';
  document.getElementById('register-panel').style.display = 'block';
}

function showLoginForm() {
  document.getElementById('auth-title').textContent = 'Нэвтрэх';
  document.getElementById('auth-subtitle').textContent = 'Бүртгэлтэй и-мэйл, нууц үгээ оруулна уу';
  document.getElementById('register-panel').style.display = 'none';
  document.getElementById('login-panel').style.display = 'block';
}

function roleForUser(user) {
  return API.hasAdminAccess(user) ? 'admin' : 'customer';
}

function applyUserToShell(user) {
  const role = roleForUser(user);
  const roleConfig = ROLES[role] || ROLES.customer;
  const initial = (user.name || user.email || 'U').charAt(0).toUpperCase();

  STATE.role = role;
  STATE.user = user;

  document.documentElement.style.setProperty('--role-accent', roleConfig.accent);
  document.documentElement.style.setProperty('--role-accent-light', roleConfig.accentLight);

  document.getElementById('sb-avatar').textContent = initial;
  document.getElementById('sb-avatar').style.background = roleConfig.accent;
  document.getElementById('sb-name').textContent = user.name || user.email;
  document.getElementById('sb-role').textContent = API.hasAdminAccess(user) ? 'Админ' : 'Хэрэглэгч';
  document.getElementById('topbar-avatar').textContent = initial;
  document.getElementById('topbar-avatar').style.background = roleConfig.accent;
  document.getElementById('sb-icon').style.background = roleConfig.accent;

  buildNav(role);

  document.getElementById('screen-login').style.display = 'none';
  document.getElementById('screen-app').style.display = 'block';
}

function showAccessDenied() {
  document.getElementById('screen-login').style.display = 'none';
  document.getElementById('screen-app').style.display = 'none';
  document.body.innerHTML = `
    <main style="min-height:100vh;display:grid;place-items:center;background:#F8FAFC;padding:24px;font-family:'Plus Jakarta Sans',sans-serif">
      <section style="max-width:460px;width:100%;background:#fff;border:1px solid #E5E7EB;border-radius:12px;padding:28px;box-shadow:0 18px 45px rgba(15,23,42,.08)">
        <div style="font-size:30px;margin-bottom:12px">⛔</div>
        <h1 style="font-size:24px;margin:0 0 8px;color:#111827">Хандах эрхгүй</h1>
        <p style="color:#6B7280;line-height:1.6;margin:0 0 18px">Энэ хуудас зөвхөн админ эсвэл бүрэн эрхтэй хэрэглэгчдэд нээлттэй.</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <a href="/index.html" style="text-decoration:none;background:#111827;color:#fff;border-radius:8px;padding:10px 14px;font-weight:700">Нүүр хуудас</a>
          <a href="/login.html" style="text-decoration:none;border:1px solid #D1D5DB;color:#111827;border-radius:8px;padding:10px 14px;font-weight:700">Дахин нэвтрэх</a>
        </div>
      </section>
    </main>`;
}

async function hydrateSession() {
  const page = currentPageName();
  const token = API.getToken();

  if (!token) {
    document.getElementById('screen-login').style.display = 'flex';
    document.getElementById('screen-app').style.display = 'none';
    if (page === 'admin.html') window.location.replace('/login.html?next=/admin.html');
    return;
  }

  try {
    const user = await API.getCurrentUser();
    const canAdmin = API.hasAdminAccess(user);

    if (page === 'login.html') {
      window.location.replace(canAdmin ? '/admin.html' : '/index.html');
      return;
    }

    if (page === 'admin.html' && !canAdmin) {
      showAccessDenied();
      return;
    }

    applyUserToShell(user);
    showPanel('dashboard');
  } catch (error) {
    API.clearSession();
    document.getElementById('screen-login').style.display = 'flex';
    document.getElementById('screen-app').style.display = 'none';
    if (page === 'admin.html') window.location.replace('/login.html?next=/admin.html');
  }
}

async function doLogin() {
  const email = document.getElementById('login-user-input').value.trim();
  const password = document.getElementById('login-pass-input').value;

  if (!email) { showToast('И-мэйл хаягаа оруулна уу', 'warning', '⚠️'); return; }
  if (!password) { showToast('Нууц үгээ оруулна уу', 'warning', '⚠️'); return; }

  try {
    const { token, user } = await API.apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password }
    });

    API.setSession(token, user);

    const params = new URLSearchParams(window.location.search);
    const next = params.get('next');
    const canAdmin = API.hasAdminAccess(user);

    if (next === '/admin.html' && !canAdmin) {
      showAccessDenied();
      return;
    }

    window.location.href = canAdmin ? '/admin.html' : '/index.html';
  } catch (error) {
    showToast(error.message || 'Нэвтрэхэд алдаа гарлаа', 'error', '❌');
  }
}

async function doRegister() {
  const name = document.getElementById('register-name-input').value.trim();
  const email = document.getElementById('register-email-input').value.trim();
  const password = document.getElementById('register-pass-input').value;
  const confirmPassword = document.getElementById('register-pass-confirm-input').value;

  if (!name) { showToast('Нэрээ оруулна уу', 'warning', '⚠️'); return; }
  if (!email) { showToast('И-мэйл хаягаа оруулна уу', 'warning', '⚠️'); return; }
  if (password.length < 8) { showToast('Нууц үг 8-аас дээш тэмдэгт байх ёстой', 'warning', '⚠️'); return; }
  if (password !== confirmPassword) { showToast('Нууц үг таарахгүй байна', 'warning', '⚠️'); return; }

  try {
    const { token, user } = await API.apiRequest('/auth/register', {
      method: 'POST',
      body: { name, email, password }
    });

    API.setSession(token, user);
    showToast('Бүртгэл амжилттай үүслээ', 'success', '✅');
    window.location.href = '/index.html';
  } catch (error) {
    showToast(error.message || 'Бүртгэл үүсгэхэд алдаа гарлаа', 'error', '❌');
  }
}

function doLogout() {
  API.clearSession();
  STATE.role = null;
  STATE.selectedRole = null;
  window.location.href = '/login.html';
}

document.addEventListener('DOMContentLoaded', hydrateSession);
