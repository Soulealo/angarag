// ═══════════════════════════════════════
// panels-electrician.js — Electrician Panel Renderers
// ═══════════════════════════════════════

function renderElectrician(panel) {
  const myTasks = ORDERS.filter(o => o.electrician === 'Д.Мөнх');

  if (panel === 'dashboard') return `
    <div class="panel active">
      <div class="summary-card">
        <div class="summary-card-label">Өнөөдрийн ачаалал</div>
        <div class="summary-card-value">2 ажил</div>
        <div class="summary-card-sub">2026 оны 04-р сарын 14 · Дархан хот</div>
      </div>
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-card-top"><div class="stat-icon" style="background:#ECFDF5">✅</div><span class="stat-trend up">↑3</span></div>
          <div class="stat-value">12</div><div class="stat-label">Энэ сарын ажил</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-top"><div class="stat-icon" style="background:#FFFBEB">⭐</div></div>
          <div class="stat-value">4.8</div><div class="stat-label">Миний үнэлгээ</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-top"><div class="stat-icon" style="background:#ECFDF5">💰</div></div>
          <div class="stat-value">540K₮</div><div class="stat-label">Энэ сарын орлого</div>
        </div>
      </div>
      <div class="section-header"><span class="section-title">Өнөөдрийн ажлууд</span></div>
      ${myTasks.filter(o => o.status === 'active').map(o => `
        <div class="list-card">
          <div class="list-card-header">
            <div>
              <div class="list-card-id">${o.id}</div>
              <div class="list-card-title">${o.issue}</div>
            </div>
            ${statusPill(o.status)}
          </div>
          <div class="list-card-meta" style="margin-bottom:14px">
            <div class="list-card-meta-item">📍 ${o.location}</div>
            <div class="list-card-meta-item">👤 ${o.customer}</div>
            <div class="list-card-meta-item">🕐 ${o.time}</div>
          </div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-primary btn-sm" onclick="showToast('✅ ${o.id} — Дуусгасан тэмдэглэгдлээ!','success','✅')">Дуусгах</button>
            <button class="btn btn-secondary btn-sm" onclick="showToast('📝 Тайлан нэмэгдлээ','success','📝')">Тайлан нэмэх</button>
            <button class="btn btn-ghost btn-sm" onclick="showToast('🗺️ Газрын зураг нээгдлээ','success','🗺️')">🗺️ Байршил</button>
          </div>
        </div>`).join('')}
    </div>`;

  if (panel === 'tasks') return `
    <div class="panel active">
      <div class="section-header">
        <span class="section-title">Бүх оноогдсон ажлууд</span>
        <span class="pill pill-blue">${myTasks.length} нийт</span>
      </div>
      ${myTasks.map(o => `
        <div class="list-card">
          <div class="list-card-header">
            <div>
              <div class="list-card-id">${o.id}</div>
              <div class="list-card-title">${o.issue}</div>
            </div>
            ${statusPill(o.status)}
          </div>
          <div class="list-card-meta" style="margin-bottom:12px">
            <div class="list-card-meta-item">📍 ${o.location}</div>
            <div class="list-card-meta-item">👤 ${o.customer}</div>
            <div class="list-card-meta-item">📅 ${o.date} · ${o.time}</div>
          </div>
          ${o.price ? `<div class="price-tag">${fmtPrice(o.price)}</div>` : ''}
          ${o.status === 'active' ? `
            <div class="divider" style="margin:12px 0"></div>
            <div style="display:flex;gap:10px;align-items:flex-end">
              <div style="flex:1">
                <label class="form-label" style="font-size:12px">Явц шинэчлэх</label>
                <select class="form-input">
                  <option>Хүлээж авсан</option>
                  <option>Газар дээр очсон</option>
                  <option>Засвар хийж байна</option>
                  <option>Дууссан</option>
                </select>
              </div>
              <button class="btn btn-primary" onclick="showToast('Статус шинэчлэгдлээ','success','✅')">Шинэчлэх</button>
            </div>` : ''}
        </div>`).join('')}
    </div>`;

  if (panel === 'history') return `
    <div class="panel active">
      <div class="section-header"><span class="section-title">Гүйцэтгэлийн түүх</span></div>
      ${ordersTable(myTasks.filter(o => o.status === 'done'))}
    </div>`;

  if (panel === 'profile') return `
    <div class="panel active">
      <div class="two-col">
        <div>
          <div class="section-header"><span class="section-title">Профайл</span></div>
          <div class="card" style="padding:24px;margin-bottom:20px">
            <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px">
              <div class="avatar" style="background:var(--role-accent);width:60px;height:60px;font-size:22px">Д</div>
              <div>
                <div style="font-size:18px;font-weight:800;letter-spacing:-0.3px">Д.Мөнх</div>
                <div style="font-size:13px;color:var(--text-secondary)">Цахилгаанчин · EMP-001</div>
                <div class="rating-display" style="margin-top:4px"><span style="color:#F59E0B">★★★★★</span> <span class="rating-num">4.8</span></div>
              </div>
            </div>
            <div class="form-grid">
              <div class="form-group"><label class="form-label">Нэр</label><input class="form-input" value="Д.Мөнх"></div>
              <div class="form-group"><label class="form-label">Утас</label><input class="form-input" value="99887766"></div>
            </div>
            <div class="form-group"><label class="form-label">И-мэйл</label><input class="form-input" value="monkh@dscts.mn"></div>
            <div class="form-group"><label class="form-label">Хаяг</label><input class="form-input" value="Дархан, 3-р хороо"></div>
            <button class="btn btn-primary" onclick="showToast('Профайл шинэчлэгдлээ','success','✅')">Хадгалах</button>
          </div>
        </div>
        <div>
          <div class="section-header"><span class="section-title">Нууц үг солих</span></div>
          <div class="card" style="padding:24px">
            <div class="form-group"><label class="form-label">Одоогийн нууц үг</label><input class="form-input" type="password" placeholder="••••••••"></div>
            <div class="form-group"><label class="form-label">Шинэ нууц үг</label><input class="form-input" type="password" placeholder="••••••••"></div>
            <div class="form-group"><label class="form-label">Баталгаажуулах</label><input class="form-input" type="password" placeholder="••••••••"></div>
            <button class="btn btn-secondary" onclick="showToast('Нууц үг шинэчлэгдлээ','success','🔒')">Шинэчлэх</button>
          </div>
        </div>
      </div>
    </div>`;

  return '<div class="panel active"><div class="empty-state"><div class="empty-state-icon">🔨</div><div class="empty-state-title">Бэлтгэгдэж байна</div></div></div>';
}
