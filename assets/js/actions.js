// ═══════════════════════════════════════
// actions.js — Button Actions & Form Handlers
// ═══════════════════════════════════════

function openAddUserModal() {
  openModal(`
    <div class="modal-header">
      <div>
        <div class="modal-title">Шинэ ажилтан нэмэх</div>
        <div class="modal-sub">Системд бүртгэх ажилтны мэдээлэл</div>
      </div>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-grid">
        <div class="form-group"><label class="form-label">Овог</label><input class="form-input" placeholder="Овог"></div>
        <div class="form-group"><label class="form-label">Нэр</label><input class="form-input" placeholder="Нэр"></div>
      </div>
      <div class="form-group">
        <label class="form-label">Үүрэг</label>
        <select class="form-input"><option>Цахилгаанчин</option><option>Менежер</option></select>
      </div>
      <div class="form-grid">
        <div class="form-group"><label class="form-label">Утас</label><input class="form-input" placeholder="9900 0000" type="tel"></div>
        <div class="form-group"><label class="form-label">И-мэйл</label><input class="form-input" placeholder="name@dscts.mn" type="email"></div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Болих</button>
      <button class="btn btn-primary" onclick="closeModal();showToast('Ажилтан амжилттай бүртгэгдлээ!','success','✅')">Бүртгэх</button>
    </div>`);
}

function openAssignModal(orderId) {
  const o = ORDERS.find(x => x.id === orderId);
  openModal(`
    <div class="modal-header">
      <div>
        <div class="modal-title">Захиалга хуваарилах</div>
        <div class="modal-sub">${orderId} — ${o ? o.issue : ''}</div>
      </div>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label class="form-label">Цахилгаанчин сонгох</label>
        <select class="form-input">
          ${EMPLOYEES.filter(e => e.role === 'Цахилгаанчин').map(e =>
            `<option>${e.name} · ${empStatusLabel(e.status)} · ⭐${e.rating}</option>`
          ).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Тэмдэглэл</label>
        <textarea class="form-input" placeholder="Нэмэлт зааварчилгаа..." rows="2"></textarea>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Болих</button>
      <button class="btn btn-primary" onclick="closeModal();showToast('Захиалга амжилттай хуваарилагдлаа!','success','✅')">Хуваарилах →</button>
    </div>`);
}

function confirmDelete(name) {
  openModal(`
    <div class="modal-header">
      <div>
        <div class="modal-title">Устгах уу?</div>
        <div class="modal-sub"><strong>${name}</strong>-г системээс устгах гэж байна.</div>
      </div>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div style="background:var(--red-light);border:1px solid #FECACA;border-radius:var(--radius-sm);padding:14px;font-size:13.5px;color:var(--red)">
        ⚠️ Энэ үйлдлийг буцаах боломжгүй. Ажилтны бүх мэдээлэл устана.
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Болих</button>
      <button class="btn btn-danger" onclick="closeModal();showToast('${name} устгагдлаа','error','🗑️')">Устгах</button>
    </div>`);
}

function doAssign(orderId) {
  showToast('Захиалга амжилттай хуваарилагдлаа!', 'success', '✅');
}

function submitOrder() {
  const t = document.getElementById('issue-type');
  if (t && !t.value) {
    showToast('Асуудлын төрлийг сонгоно уу', 'warning', '⚠️');
    return;
  }
  showToast('Захиалга амжилттай илгээгдлээ!', 'success', '✅');
  setTimeout(() => showPanel('my-orders'), 1400);
}
