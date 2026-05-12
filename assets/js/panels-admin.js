// ═══════════════════════════════════════
// panels-admin.js — Admin Panel Renderers
// ═══════════════════════════════════════

async function loadPanelData(role, panel) {
  if (role !== 'admin') return;

  if (panel === 'dashboard') {
    const data = await API.apiRequest('/admin/dashboard', { headers: API.authHeaders() });
    ADMIN_STATS = data.stats || ADMIN_STATS;
  }

  if (panel === 'products') {
    const [productsData, categoriesData] = await Promise.all([
      API.apiRequest('/products/admin/all?includeInactive=true', { headers: API.authHeaders() }),
      API.apiRequest('/categories/admin/all?includeInactive=true', { headers: API.authHeaders() })
    ]);
    ADMIN_PRODUCTS = productsData.products || [];
    ADMIN_CATEGORIES = categoriesData.categories || [];
  }

  if (panel === 'categories') {
    const data = await API.apiRequest('/categories/admin/all?includeInactive=true', { headers: API.authHeaders() });
    ADMIN_CATEGORIES = data.categories || [];
  }

  if (panel === 'orders') {
    const data = await API.apiRequest('/orders', { headers: API.authHeaders() });
    ADMIN_ORDERS = data.orders || [];
  }

  if (panel === 'payment-info') {
    const data = await API.apiRequest('/admin/payment-info', { headers: API.authHeaders() });
    ADMIN_PAYMENT_INFO = data.paymentInfo || null;
  }
}

function safe(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function csv(value) {
  return Array.isArray(value) ? value.join(', ') : '';
}

function productCategoryName(product) {
  return product.category?.name || '—';
}

function orderStatusLabel(status) {
  const labels = {
    pending: 'Хүлээгдэж байна',
    confirmed: 'Баталгаажсан',
    processing: 'Бэлтгэгдэж байна',
    shipped: 'Хүргэлтэд',
    delivered: 'Хүргэгдсэн',
    cancelled: 'Цуцлагдсан'
  };
  return labels[status] || status;
}

function adminOrderRows() {
  if (!ADMIN_ORDERS.length) {
    return '<tr><td colspan="7" style="text-align:center;color:var(--text-tertiary);padding:26px">Захиалга алга байна</td></tr>';
  }

  return ADMIN_ORDERS.map(order => `
    <tr>
      <td><span style="font-size:12px;font-weight:700;color:var(--text-secondary)">${safe(order._id.slice(-8).toUpperCase())}</span></td>
      <td>
        <div style="font-weight:700;font-size:13.5px">${safe(order.customerName)}</div>
        <div style="font-size:12px;color:var(--text-tertiary)">${safe(order.email)} · ${safe(order.phone)}</div>
      </td>
      <td style="font-size:13px;color:var(--text-secondary);max-width:220px">${safe(order.address)}</td>
      <td style="font-size:13px">${order.items.map(item => `${safe(item.name)} × ${item.quantity}`).join('<br>')}</td>
      <td style="font-weight:800">${fmtPrice(order.totalAmount)}</td>
      <td>
        <select class="form-input" style="width:auto;min-width:150px" onchange="updateOrderStatus('${order._id}', this.value)">
          ${['pending','confirmed','processing','shipped','delivered','cancelled'].map(status =>
            `<option value="${status}" ${order.status === status ? 'selected' : ''}>${orderStatusLabel(status)}</option>`
          ).join('')}
        </select>
      </td>
      <td style="font-size:12.5px;color:var(--text-tertiary)">${new Date(order.createdAt).toLocaleDateString('mn-MN')}</td>
    </tr>`).join('');
}

function renderAdmin(panel) {

  if (panel === 'dashboard') return `
    <div class="panel active">
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-card-top">
            <div class="stat-icon" style="background:#F5F3FF">🛡️</div>
            <span class="stat-trend up">↑ 8%</span>
          </div>
          <div class="stat-value">${ADMIN_STATS.orders.toLocaleString()}</div>
          <div class="stat-label">Нийт захиалга</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-top">
            <div class="stat-icon" style="background:#EFF4FF">⚡</div>
            <span class="stat-trend neutral">Одоо</span>
          </div>
          <div class="stat-value">${ADMIN_STATS.products.toLocaleString()}</div>
          <div class="stat-label">Бүтээгдэхүүн</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-top">
            <div class="stat-icon" style="background:#ECFDF5">👷</div>
            <span class="stat-trend up">+1</span>
          </div>
          <div class="stat-value">${ADMIN_STATS.categories.toLocaleString()}</div>
          <div class="stat-label">Ангилал</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-top">
            <div class="stat-icon" style="background:#FFFBEB">💰</div>
            <span class="stat-trend up">↑ 14%</span>
          </div>
          <div class="stat-value">${fmtPrice(ADMIN_STATS.revenue)}</div>
          <div class="stat-label">Нийт орлого</div>
        </div>
      </div>

      <div class="two-col section-gap">
        <div>
          <div class="section-header">
            <span class="section-title">7 хоногийн захиалга</span>
            <button class="section-action">Дэлгэрэнгүй</button>
          </div>
          <div class="card" style="padding:20px">
            <div class="chart-area">
              ${[42,68,55,88,71,94,100].map((h,i) =>
                `<div class="chart-col">
                  <div class="chart-bar ${i===6?'chart-bar-active':'chart-bar-passive'}" style="height:${h}%"></div>
                  <span class="chart-day">${['Да','Мя','Лх','Пү','Ба','Бя','Ня'][i]}</span>
                </div>`).join('')}
            </div>
          </div>
        </div>
        <div>
          <div class="section-header">
            <span class="section-title">Шинэ мэдэгдлүүд</span>
            <button class="section-action">Бүгдийг харах</button>
          </div>
          <div class="card">
            <div class="notif-item unread">
              <div class="notif-icon-wrap" style="background:#EFF4FF">📋</div>
              <div>
                <div class="notif-content-title">Шинэ захиалга #4820</div>
                <div class="notif-content-body">Б.Болд — Залгуур 3ш солих</div>
                <div class="notif-time">2 минутын өмнө</div>
              </div>
            </div>
            <div class="notif-item unread">
              <div class="notif-icon-wrap" style="background:#ECFDF5">✅</div>
              <div>
                <div class="notif-content-title">#4819 захиалга дууссан</div>
                <div class="notif-content-body">Э.Эрдэнэ — LED гэрэл суулгах</div>
                <div class="notif-time">15 минутын өмнө</div>
              </div>
            </div>
            <div class="notif-item">
              <div class="notif-icon-wrap" style="background:#F5F3FF">👤</div>
              <div>
                <div class="notif-content-title">Шинэ хэрэглэгч бүртгэгдлээ</div>
                <div class="notif-content-body">Г.Нармандах — и-мэйл баталгаажсан</div>
                <div class="notif-time">1 цагийн өмнө</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="section-header">
        <span class="section-title">Сүүлийн захиалгууд</span>
        <button class="section-action" onclick="showPanel('orders')">Бүгдийг харах →</button>
      </div>
      ${ordersTable(ORDERS.slice(0, 4))}
    </div>`;

  if (panel === 'products') return `
    <div class="panel active">
      <div class="toolbar">
        <div class="search-bar">
          <span>🔍</span>
          <input placeholder="Бүтээгдэхүүн хайх...">
        </div>
        <a class="btn btn-secondary" href="/products.html" target="_blank" style="text-decoration:none">Сайт харах</a>
        <button class="btn btn-primary" onclick="openProductModal()"><span>+</span> Бүтээгдэхүүн нэмэх</button>
      </div>
      <div class="card">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Бүтээгдэхүүн</th><th>Ангилал</th><th>Үнэ</th><th>Үлдэгдэл</th>
                <th>Сонголтууд</th><th>Материал</th><th>Төлөв</th><th>Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              ${ADMIN_PRODUCTS.length ? ADMIN_PRODUCTS.map(product => `
                <tr>
                  <td>
                    <div style="display:flex;align-items:center;gap:10px">
                      <div style="width:44px;height:44px;border-radius:8px;background:#F3F4F6;overflow:hidden;display:grid;place-items:center">
                        ${product.imageUrl ? `<img src="${safe(product.imageUrl)}" alt="" style="width:100%;height:100%;object-fit:cover">` : '🛒'}
                      </div>
                      <div>
                        <div style="font-weight:800;font-size:13.5px">${safe(product.name)}</div>
                        <div style="font-size:12px;color:var(--text-tertiary)">${safe(product.slug)}</div>
                      </div>
                    </div>
                  </td>
                  <td style="font-size:13px">${safe(productCategoryName(product))}</td>
                  <td style="font-weight:800">${fmtPrice(product.price)}</td>
                  <td style="font-weight:700">${product.stock}</td>
                  <td style="font-size:12.5px;color:var(--text-secondary)">
                    ${safe(csv(product.colors)) || '—'}<br>${safe(csv(product.sizes)) || '—'}
                  </td>
                  <td style="font-size:13px">${safe(product.material) || '—'}</td>
                  <td>${product.isActive ? '<span class="pill pill-green">Идэвхтэй</span>' : '<span class="pill pill-gray">Идэвхгүй</span>'}</td>
                  <td>
                    <div style="display:flex;gap:6px">
                      <button class="btn btn-secondary btn-sm" onclick="openProductModal('${product._id}')">Засах</button>
                      <button class="btn btn-danger btn-sm" onclick="deleteProduct('${product._id}')">Устгах</button>
                    </div>
                  </td>
                </tr>`).join('') : '<tr><td colspan="8" style="text-align:center;color:var(--text-tertiary);padding:28px">Бүтээгдэхүүн алга байна</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    </div>`;

  if (panel === 'categories') return `
    <div class="panel active">
      <div class="toolbar">
        <div class="search-bar">
          <span>🔍</span>
          <input placeholder="Ангилал хайх...">
        </div>
        <button class="btn btn-primary" onclick="openCategoryModal()"><span>+</span> Ангилал нэмэх</button>
      </div>
      <div class="card">
        <div class="table-container">
          <table>
            <thead><tr><th>Нэр</th><th>Slug</th><th>Тайлбар</th><th>Зураг</th><th>Төлөв</th><th>Үйлдэл</th></tr></thead>
            <tbody>
              ${ADMIN_CATEGORIES.length ? ADMIN_CATEGORIES.map(category => `
                <tr>
                  <td style="font-weight:800">${safe(category.name)}</td>
                  <td style="font-size:12.5px;color:var(--text-tertiary)">${safe(category.slug)}</td>
                  <td style="font-size:13px;color:var(--text-secondary);max-width:320px">${safe(category.description) || '—'}</td>
                  <td style="font-size:12.5px;color:var(--text-tertiary);max-width:220px;overflow:hidden;text-overflow:ellipsis">${safe(category.imageUrl) || '—'}</td>
                  <td>${category.isActive ? '<span class="pill pill-green">Идэвхтэй</span>' : '<span class="pill pill-gray">Идэвхгүй</span>'}</td>
                  <td>
                    <div style="display:flex;gap:6px">
                      <button class="btn btn-secondary btn-sm" onclick="openCategoryModal('${category._id}')">Засах</button>
                      <button class="btn btn-danger btn-sm" onclick="deleteCategory('${category._id}')">Устгах</button>
                    </div>
                  </td>
                </tr>`).join('') : '<tr><td colspan="6" style="text-align:center;color:var(--text-tertiary);padding:28px">Ангилал алга байна</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    </div>`;

  if (panel === 'payment-info') return `
    <div class="panel active">
      <div class="section-header"><span class="section-title">Банк / төлбөрийн мэдээлэл</span></div>
      <div class="card" style="padding:24px">
        <form onsubmit="submitPaymentInfo(event)">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Банкны нэр</label>
              <input class="form-input" name="bankName" value="${safe(ADMIN_PAYMENT_INFO?.bankName)}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Данс эзэмшигч</label>
              <input class="form-input" name="accountName" value="${safe(ADMIN_PAYMENT_INFO?.accountName)}" required>
            </div>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Дансны дугаар</label>
              <input class="form-input" name="accountNumber" value="${safe(ADMIN_PAYMENT_INFO?.accountNumber)}" required>
            </div>
            <div class="form-group">
              <label class="form-label">IBAN</label>
              <input class="form-input" name="iban" value="${safe(ADMIN_PAYMENT_INFO?.iban)}">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">QPay merchant ID</label>
            <input class="form-input" name="qpayMerchantId" value="${safe(ADMIN_PAYMENT_INFO?.qpayMerchantId)}">
          </div>
          <div class="form-group">
            <label class="form-label">Төлбөрийн заавар</label>
            <textarea class="form-input" name="instructions" rows="3">${safe(ADMIN_PAYMENT_INFO?.instructions)}</textarea>
          </div>
          <label style="display:flex;align-items:center;gap:8px;margin-bottom:18px;font-size:13px;color:var(--text-secondary)">
            <input type="checkbox" name="isActive" ${ADMIN_PAYMENT_INFO?.isActive === false ? '' : 'checked'}> Идэвхтэй
          </label>
          <button class="btn btn-primary" type="submit">Хадгалах</button>
        </form>
      </div>
    </div>`;

  if (panel === 'users') return `
    <div class="panel active">
      <div class="toolbar">
        <div class="search-bar">
          <span>🔍</span>
          <input placeholder="Нэр, и-мэйл, ID-гаар хайх...">
        </div>
        <button class="btn btn-secondary"><span>⬇</span> Татаж авах</button>
        <button class="btn btn-primary" onclick="openAddUserModal()"><span>+</span> Шинэ ажилтан</button>
      </div>
      <div class="card">
        <table>
          <thead>
            <tr>
              <th>Ажилтан</th><th>Үүрэг</th><th>Утас</th>
              <th>Гүйцэтгэсэн ажил</th><th>Үнэлгээ</th><th>Төлөв</th><th>Үйлдэл</th>
            </tr>
          </thead>
          <tbody>
            ${EMPLOYEES.map(e => `
              <tr>
                <td>
                  <div style="display:flex;align-items:center;gap:10px">
                    <div class="avatar" style="background:${e.color}">${e.initial}</div>
                    <div>
                      <div style="font-weight:700;font-size:13.5px">${e.name}</div>
                      <div style="font-size:12px;color:var(--text-tertiary)">${e.email}</div>
                    </div>
                  </div>
                </td>
                <td><span style="font-size:13px">${e.role}</span></td>
                <td style="font-size:13px;color:var(--text-secondary)">${e.phone}</td>
                <td style="font-weight:700;font-size:14px">${e.jobs}</td>
                <td>
                  ${e.rating
                    ? `<div class="rating-display"><span style="color:#F59E0B">★</span> <span class="rating-num">${e.rating}</span></div>`
                    : '<span style="color:var(--text-tertiary);font-size:12px">—</span>'}
                </td>
                <td>${empStatusPill(e.status)}</td>
                <td>
                  <div style="display:flex;gap:6px">
                    <button class="btn btn-secondary btn-sm" onclick="showToast('Засварлах хуудас нээгдлээ','success','✏️')">Засах</button>
                    <button class="btn btn-danger btn-sm" onclick="confirmDelete('${e.name}')">Устгах</button>
                  </div>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;

  if (panel === 'orders') return `
    <div class="panel active">
      <div class="toolbar">
        <div class="search-bar">
          <span>🔍</span>
          <input placeholder="Захиалга хайх...">
        </div>
        <a class="btn btn-secondary" href="/checkout.html" target="_blank" style="text-decoration:none">Checkout харах</a>
      </div>
      <div class="card">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Дугаар</th><th>Хэрэглэгч</th><th>Хаяг</th><th>Бараа</th><th>Дүн</th><th>Төлөв</th><th>Огноо</th>
              </tr>
            </thead>
            <tbody>${adminOrderRows()}</tbody>
          </table>
        </div>
      </div>
    </div>`;

  if (panel === 'employees') return `
    <div class="panel active">
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-card-top"><div class="stat-icon" style="background:#ECFDF5">✅</div><span class="stat-trend neutral">Нийт</span></div>
          <div class="stat-value">5</div><div class="stat-label">Нийт ажилтан</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-top"><div class="stat-icon" style="background:#EFF4FF">⚡</div><span class="stat-trend neutral">Одоо</span></div>
          <div class="stat-value">2</div><div class="stat-label">Ажилд байгаа</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-top"><div class="stat-icon" style="background:#ECFDF5">🟢</div><span class="stat-trend up">+1</span></div>
          <div class="stat-value">3</div><div class="stat-label">Чөлөөтэй</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-top"><div class="stat-icon" style="background:#FFFBEB">⭐</div></div>
          <div class="stat-value">4.5</div><div class="stat-label">Дундаж үнэлгээ</div>
        </div>
      </div>
      <div class="section-header">
        <span class="section-title">Ажилтнуудын жагсаалт</span>
        <button class="btn btn-primary btn-sm" onclick="openAddUserModal()">+ Нэмэх</button>
      </div>
      <div class="card">
        ${EMPLOYEES.map(e => `
          <div class="emp-row">
            <div class="avatar" style="background:${e.color};width:40px;height:40px;font-size:15px">${e.initial}</div>
            <div class="emp-info">
              <div class="emp-name">${e.name}</div>
              <div class="emp-role">${e.role} · ${e.phone}</div>
            </div>
            <div style="display:flex;align-items:center;gap:12px">
              ${e.rating ? `<div class="rating-display"><span style="color:#F59E0B">★</span><span class="rating-num">${e.rating}</span></div>` : ''}
              <span style="font-size:13px;color:var(--text-secondary)">${e.jobs} ажил</span>
              ${empStatusPill(e.status)}
            </div>
          </div>`).join('')}
      </div>
    </div>`;

  if (panel === 'reports') return `
    <div class="panel active">
      <div class="toolbar">
        <select class="form-input" style="width:auto">
          <option>2026 оны 04-р сар</option>
          <option>2026 оны 03-р сар</option>
          <option>2026 оны 02-р сар</option>
        </select>
        <button class="btn btn-primary" onclick="showToast('PDF татаж байна...','success','📄')">📄 PDF татах</button>
        <button class="btn btn-secondary" onclick="showToast('Excel татаж байна...','success','📊')">📊 Excel</button>
      </div>
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-card-top"><div class="stat-icon" style="background:#EFF4FF">📋</div><span class="stat-trend up">↑12%</span></div>
          <div class="stat-value">247</div><div class="stat-label">Нийт захиалга</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-top"><div class="stat-icon" style="background:#ECFDF5">✅</div><span class="stat-trend up">↑9%</span></div>
          <div class="stat-value">198</div><div class="stat-label">Дууссан</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-top"><div class="stat-icon" style="background:#FEF2F2">❌</div><span class="stat-trend down">↓2%</span></div>
          <div class="stat-value">12</div><div class="stat-label">Цуцлагдсан</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-top"><div class="stat-icon" style="background:#FFFBEB">💰</div><span class="stat-trend up">↑14%</span></div>
          <div class="stat-value">8.4M₮</div><div class="stat-label">Орлого</div>
        </div>
      </div>
      <div class="section-header"><span class="section-title">Засварчны гүйцэтгэл</span></div>
      <div class="card">
        <table>
          <thead><tr><th>Нэр</th><th>Дууссан ажил</th><th>Орлого</th><th>Үнэлгээ</th><th>Гүйцэтгэл</th></tr></thead>
          <tbody>
            ${EMPLOYEES.filter(e => e.rating).map(e => `
              <tr>
                <td>
                  <div style="display:flex;align-items:center;gap:9px">
                    <div class="avatar" style="background:${e.color}">${e.initial}</div>
                    <span style="font-weight:600">${e.name}</span>
                  </div>
                </td>
                <td style="font-weight:700">${e.jobs}</td>
                <td style="font-weight:700">₮${(e.jobs * 45000).toLocaleString()}</td>
                <td><div class="rating-display"><span style="color:#F59E0B">★</span><span class="rating-num">${e.rating}</span></div></td>
                <td style="min-width:120px">
                  <div class="progress-wrap"><div class="progress-fill" style="width:${e.rating / 5 * 100}%"></div></div>
                  <span style="font-size:11px;color:var(--text-tertiary)">${Math.round(e.rating / 5 * 100)}%</span>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;

  if (panel === 'settings') return `
    <div class="panel active">
      <div class="two-col">
        <div>
          <div class="section-header"><span class="section-title">Байгууллагын мэдээлэл</span></div>
          <div class="card" style="padding:24px;margin-bottom:20px">
            <div class="form-group">
              <label class="form-label">Байгууллагын нэр</label>
              <input class="form-input" value="Дархан Сэлэнгийн Цахилгаан Түгээх Сүлжээ">
            </div>
            <div class="form-grid">
              <div class="form-group"><label class="form-label">Утас</label><input class="form-input" value="(01372) 22-4455"></div>
              <div class="form-group"><label class="form-label">И-мэйл</label><input class="form-input" value="info@dscts.mn"></div>
            </div>
            <div class="form-group"><label class="form-label">Хаяг</label><input class="form-input" value="Дархан-Уул аймаг, Дархан хот"></div>
            <button class="btn btn-primary" onclick="showToast('Мэдээлэл хадгалагдлаа','success','✅')">Хадгалах</button>
          </div>
        </div>
        <div>
          <div class="section-header"><span class="section-title">Аюулгүй байдал</span></div>
          <div class="card" style="padding:24px">
            <div class="form-group">
              <label class="form-label">Two-Factor Auth (2FA)</label>
              <select class="form-input"><option>Идэвхтэй</option><option>Идэвхгүй</option></select>
            </div>
            <div class="form-group">
              <label class="form-label">Нэвтрэлтийн хязгаар</label>
              <input class="form-input" value="5 удаа">
            </div>
            <div class="form-group">
              <label class="form-label">Сессийн хугацаа</label>
              <select class="form-input"><option>30 минут</option><option>1 цаг</option><option>8 цаг</option></select>
            </div>
            <button class="btn btn-primary" onclick="showToast('Тохиргоо хадгалагдлаа','success','🔒')">Хадгалах</button>
          </div>
        </div>
      </div>
    </div>`;

  return '<div class="panel active"><div class="empty-state"><div class="empty-state-icon">🔨</div><div class="empty-state-title">Бэлтгэгдэж байна</div><div class="empty-state-sub">Энэ хэсэг удахгүй нэмэгдэнэ</div></div></div>';
}

function openProductModal(productId) {
  const product = ADMIN_PRODUCTS.find(item => item._id === productId) || {};
  const isEdit = Boolean(productId);

  openModal(`
    <form onsubmit="submitProductForm(event, '${productId || ''}')">
      <div class="modal-header">
        <div>
          <div class="modal-title">${isEdit ? 'Бүтээгдэхүүн засах' : 'Бүтээгдэхүүн нэмэх'}</div>
          <div class="modal-sub">Үнэ, үлдэгдэл, зураг, хувилбарууд</div>
        </div>
        <button class="modal-close" type="button" onclick="closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-grid">
          <div class="form-group"><label class="form-label">Нэр</label><input class="form-input" name="name" value="${safe(product.name)}" required></div>
          <div class="form-group"><label class="form-label">Slug</label><input class="form-input" name="slug" value="${safe(product.slug)}"></div>
        </div>
        <div class="form-grid">
          <div class="form-group"><label class="form-label">Үнэ</label><input class="form-input" name="price" type="number" min="0" value="${product.price || 0}" required></div>
          <div class="form-group"><label class="form-label">Үлдэгдэл</label><input class="form-input" name="stock" type="number" min="0" value="${product.stock || 0}"></div>
        </div>
        <div class="form-group">
          <label class="form-label">Ангилал</label>
          <select class="form-input" name="category">
            <option value="">— Сонгоно уу —</option>
            ${ADMIN_CATEGORIES.map(category => `
              <option value="${category._id}" ${product.category?._id === category._id || product.category === category._id ? 'selected' : ''}>${safe(category.name)}</option>
            `).join('')}
          </select>
        </div>
        <div class="form-group"><label class="form-label">Зургийн URL</label><input class="form-input" name="imageUrl" value="${safe(product.imageUrl)}"></div>
        <div class="form-grid">
          <div class="form-group"><label class="form-label">Өнгө</label><input class="form-input" name="colors" value="${safe(csv(product.colors))}" placeholder="black, white"></div>
          <div class="form-group"><label class="form-label">Хэмжээ</label><input class="form-input" name="sizes" value="${safe(csv(product.sizes))}" placeholder="S, M, L"></div>
        </div>
        <div class="form-group"><label class="form-label">Материал</label><input class="form-input" name="material" value="${safe(product.material)}"></div>
        <div class="form-group"><label class="form-label">Тайлбар</label><textarea class="form-input" name="description" rows="3">${safe(product.description)}</textarea></div>
        <label style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text-secondary)">
          <input type="checkbox" name="isActive" ${product.isActive === false ? '' : 'checked'}> Сайт дээр харуулах
        </label>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" type="button" onclick="closeModal()">Болих</button>
        <button class="btn btn-primary" type="submit">Хадгалах</button>
      </div>
    </form>`);
}

function splitList(value) {
  return String(value || '').split(',').map(item => item.trim()).filter(Boolean);
}

async function submitProductForm(event, productId) {
  event.preventDefault();
  const form = event.target;
  const payload = {
    name: form.name.value.trim(),
    slug: form.slug.value.trim(),
    price: Number(form.price.value || 0),
    stock: Number(form.stock.value || 0),
    category: form.category.value || null,
    imageUrl: form.imageUrl.value.trim(),
    colors: splitList(form.colors.value),
    sizes: splitList(form.sizes.value),
    material: form.material.value.trim(),
    description: form.description.value.trim(),
    isActive: form.isActive.checked
  };

  await API.apiRequest(productId ? `/products/${productId}` : '/products', {
    method: productId ? 'PUT' : 'POST',
    headers: API.authHeaders(),
    body: payload
  });

  closeModal();
  showToast('Бүтээгдэхүүн хадгалагдлаа', 'success', '✅');
  showPanel('products');
}

async function deleteProduct(productId) {
  if (!window.confirm('Энэ бүтээгдэхүүнийг устгах уу?')) return;
  await API.apiRequest(`/products/${productId}`, {
    method: 'DELETE',
    headers: API.authHeaders()
  });
  showToast('Бүтээгдэхүүн устгагдлаа', 'success', '🗑️');
  showPanel('products');
}

function openCategoryModal(categoryId) {
  const category = ADMIN_CATEGORIES.find(item => item._id === categoryId) || {};
  const isEdit = Boolean(categoryId);

  openModal(`
    <form onsubmit="submitCategoryForm(event, '${categoryId || ''}')">
      <div class="modal-header">
        <div>
          <div class="modal-title">${isEdit ? 'Ангилал засах' : 'Ангилал нэмэх'}</div>
          <div class="modal-sub">Бүтээгдэхүүний ангиллын мэдээлэл</div>
        </div>
        <button class="modal-close" type="button" onclick="closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-grid">
          <div class="form-group"><label class="form-label">Нэр</label><input class="form-input" name="name" value="${safe(category.name)}" required></div>
          <div class="form-group"><label class="form-label">Slug</label><input class="form-input" name="slug" value="${safe(category.slug)}"></div>
        </div>
        <div class="form-group"><label class="form-label">Зургийн URL</label><input class="form-input" name="imageUrl" value="${safe(category.imageUrl)}"></div>
        <div class="form-group"><label class="form-label">Тайлбар</label><textarea class="form-input" name="description" rows="3">${safe(category.description)}</textarea></div>
        <label style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text-secondary)">
          <input type="checkbox" name="isActive" ${category.isActive === false ? '' : 'checked'}> Идэвхтэй
        </label>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" type="button" onclick="closeModal()">Болих</button>
        <button class="btn btn-primary" type="submit">Хадгалах</button>
      </div>
    </form>`);
}

async function submitCategoryForm(event, categoryId) {
  event.preventDefault();
  const form = event.target;
  const payload = {
    name: form.name.value.trim(),
    slug: form.slug.value.trim(),
    imageUrl: form.imageUrl.value.trim(),
    description: form.description.value.trim(),
    isActive: form.isActive.checked
  };

  await API.apiRequest(categoryId ? `/categories/${categoryId}` : '/categories', {
    method: categoryId ? 'PUT' : 'POST',
    headers: API.authHeaders(),
    body: payload
  });

  closeModal();
  showToast('Ангилал хадгалагдлаа', 'success', '✅');
  showPanel('categories');
}

async function deleteCategory(categoryId) {
  if (!window.confirm('Энэ ангиллыг устгах уу?')) return;
  await API.apiRequest(`/categories/${categoryId}`, {
    method: 'DELETE',
    headers: API.authHeaders()
  });
  showToast('Ангилал устгагдлаа', 'success', '🗑️');
  showPanel('categories');
}

async function updateOrderStatus(orderId, status) {
  await API.apiRequest(`/orders/${orderId}/status`, {
    method: 'PUT',
    headers: API.authHeaders(),
    body: { status }
  });
  showToast('Захиалгын төлөв шинэчлэгдлээ', 'success', '✅');
  showPanel('orders');
}

async function submitPaymentInfo(event) {
  event.preventDefault();
  const form = event.target;
  const payload = {
    bankName: form.bankName.value.trim(),
    accountName: form.accountName.value.trim(),
    accountNumber: form.accountNumber.value.trim(),
    iban: form.iban.value.trim(),
    qpayMerchantId: form.qpayMerchantId.value.trim(),
    instructions: form.instructions.value.trim(),
    isActive: form.isActive.checked
  };

  await API.apiRequest('/admin/payment-info', {
    method: 'PUT',
    headers: API.authHeaders(),
    body: payload
  });

  showToast('Төлбөрийн мэдээлэл хадгалагдлаа', 'success', '✅');
  showPanel('payment-info');
}
