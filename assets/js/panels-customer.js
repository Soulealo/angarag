// ═══════════════════════════════════════
// panels-customer.js — Customer Panel Renderers
// ═══════════════════════════════════════

function renderCustomer(panel) {

  if (panel === 'dashboard') return `
    <div class="panel active">
      <div style="margin-bottom:24px">
        <h2 style="font-size:22px;font-weight:800;letter-spacing:-0.4px;margin-bottom:4px">Сайн байна уу, О.Анар 👋</h2>
        <p style="color:var(--text-secondary);font-size:14px">Цахилгааны асуудал гарсан уу? Хоёрхон товшилтоор захиалга өгнө үү.</p>
      </div>

      <div class="map-card">
        <div class="map-pin" style="font-size:20px">📍</div>
        <div class="map-pin" style="font-size:16px">📍</div>
        <div class="map-pin" style="font-size:18px">📍</div>
        <div class="map-overlay">🗺️ Ойролцоох 3 цахилгаанчин байна</div>
      </div>

      <div class="quick-actions">
        <div class="quick-action" onclick="showPanel('new-order')">
          <div class="quick-action-icon">⚡</div>
          <div class="quick-action-label">Захиалга өгөх</div>
        </div>
        <div class="quick-action" onclick="showPanel('my-orders')">
          <div class="quick-action-icon">📋</div>
          <div class="quick-action-label">Миний захиалга</div>
        </div>
        <div class="quick-action" onclick="showPanel('payment')">
          <div class="quick-action-icon">💳</div>
          <div class="quick-action-label">Төлбөр</div>
        </div>
        <div class="quick-action" onclick="showPanel('reviews')">
          <div class="quick-action-icon">⭐</div>
          <div class="quick-action-label">Үнэлгээ</div>
        </div>
      </div>

      ${MY_ORDERS.filter(o => o.status === 'active').length > 0 ? `
        <div class="section-header"><span class="section-title">Идэвхтэй захиалга</span></div>
        ${MY_ORDERS.filter(o => o.status === 'active').map(o => `
          <div class="list-card" onclick="showPanel('my-orders')">
            <div class="list-card-header">
              <div>
                <div class="list-card-id">${o.id}</div>
                <div class="list-card-title">${o.issue}</div>
              </div>
              ${statusPill(o.status)}
            </div>
            <div class="list-card-meta" style="margin-bottom:12px">
              <div class="list-card-meta-item">⚡ ${o.electrician}</div>
              <div class="list-card-meta-item">🕐 ${o.time}</div>
            </div>
            <label class="form-label" style="font-size:11px;font-weight:500;color:var(--text-tertiary)">ЯВЦ</label>
            <div class="progress-wrap"><div class="progress-fill" style="width:${o.progress}%"></div></div>
            <div style="font-size:12px;color:var(--text-secondary);margin-top:6px">Цахилгаанчин ирж байна...</div>
          </div>`).join('')}` : ''}
    </div>`;

  if (panel === 'new-order') return `
    <div class="panel active">
      <div class="steps" style="margin-bottom:28px">
        <div class="step active"><div class="step-circle">1</div><div class="step-label">Мэдээлэл</div></div>
        <div class="step"><div class="step-circle">2</div><div class="step-label">Цаг товлох</div></div>
        <div class="step"><div class="step-circle">3</div><div class="step-label">Баталгаажуулах</div></div>
      </div>
      <div class="two-col">
        <div>
          <div class="card" style="padding:24px">
            <div class="section-header"><span class="section-title">Асуудлын мэдээлэл</span></div>
            <div class="form-group">
              <label class="form-label">Асуудлын төрөл</label>
              <select class="form-input" id="issue-type">
                <option value="">— Сонгоно уу —</option>
                <option>Цахилгаан тасарсан</option>
                <option>Залгуур солих</option>
                <option>Унтраалга солих</option>
                <option>LED гэрэл суулгах</option>
                <option>Тоолуур шалгуулах</option>
                <option>Утас үнэртэж байна</option>
                <option>Бусад</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Дэлгэрэнгүй тайлбар</label>
              <textarea class="form-input" placeholder="Асуудлыг дэлгэрэнгүй бичнэ үү..."></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Байршил / Хаяг</label>
              <input class="form-input" placeholder="Хороо, байр, тоот" value="3-р хороо, 14-р байр, 51-р тоот">
            </div>
            <div class="form-group">
              <label class="form-label">Утасны дугаар</label>
              <input class="form-input" placeholder="9900 0000" type="tel" value="99001122">
            </div>
          </div>
        </div>
        <div>
          <div class="card" style="padding:24px;margin-bottom:16px">
            <div class="section-header"><span class="section-title">Цаг товлох</span></div>
            <div class="form-grid">
              <div class="form-group"><label class="form-label">Огноо</label><input class="form-input" type="date" value="2026-04-15"></div>
              <div class="form-group"><label class="form-label">Цаг</label><input class="form-input" type="time" value="10:00"></div>
            </div>
            <div class="form-group">
              <label class="form-label">Төлбөрийн хэлбэр</label>
              <select class="form-input">
                <option>QPay (QR код)</option>
                <option>Карт</option>
                <option>Интернет банк</option>
                <option>Бэлэн мөнгө</option>
              </select>
            </div>
          </div>
          <div class="card" style="padding:20px;background:var(--role-accent-light);border-color:color-mix(in srgb,var(--role-accent) 30%,transparent)">
            <div style="font-size:13px;color:var(--text-secondary);margin-bottom:4px">Ойролцоох үнэ</div>
            <div style="font-size:26px;font-weight:800;letter-spacing:-0.5px">₮30,000 – ₮80,000</div>
            <div style="font-size:12px;color:var(--text-tertiary);margin-top:4px">Асуудлын хүндрэлээс хамаарна</div>
          </div>
          <button class="btn btn-primary" style="width:100%;justify-content:center;margin-top:16px;padding:14px;font-size:15px" onclick="submitOrder()">
            Захиалга илгээх →
          </button>
        </div>
      </div>
    </div>`;

  if (panel === 'my-orders') return `
    <div class="panel active">
      <div class="section-header">
        <span class="section-title">Миний захиалгууд</span>
        <button class="btn btn-primary btn-sm" onclick="showPanel('new-order')">+ Шинэ захиалга</button>
      </div>
      ${MY_ORDERS.map(o => `
        <div class="list-card">
          <div class="list-card-header">
            <div>
              <div class="list-card-id">${o.id}</div>
              <div class="list-card-title">${o.issue}</div>
            </div>
            ${statusPill(o.status)}
          </div>
          <div class="list-card-meta" style="margin-bottom:12px">
            <div class="list-card-meta-item">⚡ ${o.electrician}</div>
            <div class="list-card-meta-item">📅 ${o.date} · ${o.time}</div>
          </div>
          ${o.status === 'active' ? `
            <div class="progress-wrap" style="margin-bottom:6px"><div class="progress-fill" style="width:${o.progress}%"></div></div>
            <div style="font-size:12px;color:var(--text-secondary)">Явц: ${o.progress}% · Цахилгаанчин ирж байна</div>` : ''}
          <div class="list-card-footer">
            <div class="price-tag">${fmtPrice(o.price)}</div>
            <div style="display:flex;gap:8px">
              ${o.status === 'active' ? `<button class="btn btn-danger btn-sm" onclick="showToast('Цуцлах хүсэлт илгээгдлээ','error','❌')">Цуцлах</button>` : ''}
              ${o.status === 'done'   ? `<button class="btn btn-secondary btn-sm" onclick="showPanel('reviews')">⭐ Үнэлгээ</button>` : ''}
            </div>
          </div>
        </div>`).join('')}
    </div>`;

  if (panel === 'payment') return `
    <div class="panel active">
      <div class="summary-card">
        <div class="summary-card-label">Нийт төлсөн дүн</div>
        <div class="summary-card-value">₮115,000</div>
        <div class="summary-card-sub">2026 оны 04-р сарын байдлаар · 2 гүйлгээ</div>
      </div>
      <div class="toolbar">
        <select class="form-input" style="width:auto">
          <option>Бүх гүйлгээ</option><option>Төлөгдсөн</option><option>Хүлээгдэж байна</option>
        </select>
        <button class="btn btn-secondary" onclick="showToast('Баримт татаж байна...','success','📄')">📄 Баримт татах</button>
      </div>
      <div class="card">
        <table>
          <thead>
            <tr><th>Дугаар</th><th>Үйлчилгээ</th><th>Огноо</th><th>Дүн</th><th>Хэлбэр</th><th>Төлөв</th></tr>
          </thead>
          <tbody>
            ${MY_ORDERS.filter(o => o.price).map(o => `
              <tr>
                <td style="font-size:12px;font-weight:700;color:var(--text-secondary);font-feature-settings:'tnum'">${o.id}</td>
                <td style="font-weight:500">${o.issue}</td>
                <td style="font-size:13px;color:var(--text-secondary)">${o.date}</td>
                <td style="font-weight:800">${fmtPrice(o.price)}</td>
                <td style="font-size:13px">QPay</td>
                <td>${o.status === 'done'
                  ? '<span class="pill pill-green">Төлөгдсөн</span>'
                  : '<span class="pill pill-amber">Хүлээгдэж байна</span>'}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;

  if (panel === 'reviews') return `
    <div class="panel active">
      <div class="section-header"><span class="section-title">Үнэлгээ өгөх</span></div>
      ${MY_ORDERS.filter(o => o.status === 'done').map((o, i) => `
        <div class="list-card" style="cursor:default">
          <div class="list-card-header">
            <div>
              <div class="list-card-id">${o.id}</div>
              <div class="list-card-title">${o.issue}</div>
              <div class="list-card-meta" style="margin-top:6px">
                <div class="list-card-meta-item">⚡ ${o.electrician}</div>
                <div class="list-card-meta-item">📅 ${o.date}</div>
              </div>
            </div>
            <span class="pill pill-green">Дууссан</span>
          </div>
          <div class="divider" style="margin:16px 0"></div>
          <div style="margin-bottom:12px">
            <div class="form-label" style="margin-bottom:10px">Засварчны үнэлгээ</div>
            <div class="stars" id="stars-${i}">
              ${[1,2,3,4,5].map(s =>
                `<span class="star" data-group="${i}" data-val="${s}" onclick="setRating(${i},${s})">★</span>`
              ).join('')}
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Сэтгэгдэл</label>
            <textarea class="form-input" rows="2" placeholder="Үйлчилгээний талаар сэтгэгдлээ бичнэ үү..."></textarea>
          </div>
          <button class="btn btn-primary btn-sm" onclick="showToast('⭐ Үнэлгээ амжилттай илгээгдлээ!','success','⭐')">Илгээх</button>
        </div>`).join('')}
    </div>`;

  return '<div class="panel active"><div class="empty-state"><div class="empty-state-icon">🔨</div><div class="empty-state-title">Бэлтгэгдэж байна</div></div></div>';
}
