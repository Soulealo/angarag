// ═══════════════════════════════════════
// helpers.js — Shared Utility Functions
// ═══════════════════════════════════════

/** Returns a colored status pill HTML string */
function statusPill(s) {
  const map = {
    active:    ['pill-blue',  'Ажилд байна'],
    pending:   ['pill-amber', 'Хүлээгдэж байна'],
    done:      ['pill-green', 'Дууссан'],
    cancelled: ['pill-red',   'Цуцлагдсан'],
  };
  const [cls, label] = map[s] || ['pill-gray', s];
  return `<span class="pill ${cls}">${label}</span>`;
}

/** Returns a colored employee availability pill HTML string */
function empStatusPill(s) {
  return s === 'busy'
    ? `<span class="pill pill-blue">Ажилд байна</span>`
    : `<span class="pill pill-green">Чөлөөтэй</span>`;
}

/** Returns a human-readable employee status label */
function empStatusLabel(s) {
  return s === 'busy' ? 'Ажилд байна' : 'Чөлөөтэй';
}

/** Formats a price in Mongolian Tugrik */
function fmtPrice(p) {
  return p ? '₮' + p.toLocaleString() : '—';
}

/** Renders a full orders table from an array of order objects */
function ordersTable(list) {
  return `
    <div class="card">
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Дугаар</th>
              <th>Хэрэглэгч</th>
              <th>Асуудал</th>
              <th>Байршил</th>
              <th>Огноо / Цаг</th>
              <th>Засварчин</th>
              <th>Төлөв</th>
              <th>Үнэ</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(o => `
              <tr>
                <td><span style="font-size:12px;font-weight:700;color:var(--text-secondary);font-feature-settings:'tnum'">${o.id}</span></td>
                <td>
                  <div style="display:flex;align-items:center;gap:9px">
                    <div class="avatar" style="background:var(--role-accent);font-size:11px">${o.customer[0]}</div>
                    <span style="font-weight:600">${o.customer}</span>
                  </div>
                </td>
                <td style="max-width:180px"><span style="font-weight:500">${o.issue}</span></td>
                <td style="font-size:12.5px;color:var(--text-secondary);max-width:180px">${o.location}</td>
                <td style="font-size:12.5px;white-space:nowrap">
                  ${o.date}<br>
                  <span style="color:var(--text-tertiary)">${o.time}</span>
                </td>
                <td>
                  <div style="display:flex;align-items:center;gap:7px">
                    <div class="avatar" style="background:${o.electrician !== '—' ? '#6B7280' : '#D1D5DB'};font-size:10px;width:26px;height:26px">${o.elecInitial}</div>
                    <span style="font-size:13px">${o.electrician}</span>
                  </div>
                </td>
                <td>${statusPill(o.status)}</td>
                <td><span style="font-weight:700;font-size:13.5px">${fmtPrice(o.price)}</span></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
}
