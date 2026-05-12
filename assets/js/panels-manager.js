// ═══════════════════════════════════════
// panels-manager.js — Manager Panel Renderers
// ═══════════════════════════════════════

function renderManager(panel) {

  if (panel === 'dashboard') return `
    <div class="panel active">
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-card-top"><div class="stat-icon" style="background:#FFFBEB">⏳</div><span class="stat-trend neutral">Шинэ</span></div>
          <div class="stat-value">3</div><div class="stat-label">Хүлээгдэж буй</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-top"><div class="stat-icon" style="background:#EFF4FF">⚡</div></div>
          <div class="stat-value">8</div><div class="stat-label">Явагдаж буй</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-top"><div class="stat-icon" style="background:#ECFDF5">✅</div><span class="stat-trend up">+5</span></div>
          <div class="stat-value">5</div><div class="stat-label">Өнөөдөр дууссан</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-top"><div class="stat-icon" style="background:#ECFDF5">🟢</div></div>
          <div class="stat-value">2</div><div class="stat-label">Чөлөөтэй ажилтан</div>
        </div>
      </div>

      <div class="section-header">
        <span class="section-title">Хуваарилах шаардлагатай захиалгууд</span>
        <button class="section-action" onclick="showPanel('assign')">Бүгдийг харах →</button>
      </div>
      ${ORDERS.filter(o => o.status === 'pending').map(o => `
        <div class="list-card" onclick="openAssignModal('${o.id}')">
          <div class="list-card-header">
            <div>
              <div class="list-card-id">${o.id}</div>
              <div class="list-card-title">${o.issue}</div>
            </div>
            <span class="pill pill-amber">Хуваарилагдаагүй</span>
          </div>
          <div class="list-card-meta">
            <div class="list-card-meta-item">📍 ${o.location}</div>
            <div class="list-card-meta-item">👤 ${o.customer}</div>
            <div class="list-card-meta-item">📅 ${o.date} · ${o.time}</div>
          </div>
          <div class="list-card-footer">
            <span style="font-size:13px;color:var(--text-secondary)">Дарж цахилгаанчин хуваарилна уу</span>
            <button class="btn btn-primary btn-sm" onclick="event.stopPropagation();openAssignModal('${o.id}')">Хуваарилах →</button>
          </div>
        </div>`).join('')}

      <div class="section-header" style="margin-top:8px">
        <span class="section-title">Явагдаж буй ажлууд</span>
      </div>
      ${ordersTable(ORDERS.filter(o => o.status === 'active'))}
    </div>`;

  if (panel === 'orders') return `
    <div class="panel active">
      <div class="toolbar">
        <div class="search-bar"><span>🔍</span><input placeholder="Захиалга хайх..."></div>
        <select class="form-input" style="width:auto">
          <option>Бүх төлөв</option><option>Хүлээгдэж байна</option>
          <option>Ажилд байна</option><option>Дууссан</option>
        </select>
        <button class="btn btn-secondary" onclick="showToast('PDF бэлтгэж байна...','success','📄')">📄 PDF</button>
      </div>
      ${ordersTable(ORDERS)}
    </div>`;

  if (panel === 'assign') return `
    <div class="panel active">
      <div class="section-header">
        <span class="section-title">Хуваарилах захиалгууд</span>
        <span class="pill pill-amber">${ORDERS.filter(o => o.status === 'pending').length} хүлээгдэж байна</span>
      </div>
      ${ORDERS.filter(o => o.status === 'pending').map(o => `
        <div class="list-card">
          <div class="list-card-header">
            <div>
              <div class="list-card-id">${o.id}</div>
              <div class="list-card-title">${o.issue}</div>
            </div>
            ${statusPill(o.status)}
          </div>
          <div class="list-card-meta" style="margin-bottom:16px">
            <div class="list-card-meta-item">📍 ${o.location}</div>
            <div class="list-card-meta-item">👤 ${o.customer}</div>
            <div class="list-card-meta-item">📅 ${o.date} ${o.time}</div>
          </div>
          <div style="display:flex;gap:10px;align-items:flex-end">
            <div style="flex:1">
              <label class="form-label" style="font-size:12px">Цахилгаанчин сонгох</label>
              <select class="form-input" id="sel-${o.id.slice(1)}">
                <option value="">— Сонгоно уу —</option>
                ${EMPLOYEES.filter(e => e.role === 'Цахилгаанчин').map(e =>
                  `<option>${e.name} · ${empStatusLabel(e.status)}</option>`).join('')}
              </select>
            </div>
            <button class="btn btn-primary" style="flex-shrink:0" onclick="doAssign('${o.id}')">Хуваарилах</button>
          </div>
        </div>`).join('')}
    </div>`;

  if (panel === 'employees') return renderAdmin('employees');
  if (panel === 'reports')   return renderAdmin('reports');

  return '<div class="panel active"><div class="empty-state"><div class="empty-state-icon">🔨</div><div class="empty-state-title">Бэлтгэгдэж байна</div></div></div>';
}
