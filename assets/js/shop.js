const CART_KEY = 'dscts_cart';

function money(value) {
  return value ? `₮${Number(value).toLocaleString()}` : '₮0';
}

function byId(id) {
  return document.getElementById(id);
}

function readCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = readCart().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('[data-cart-count]').forEach(el => {
    el.textContent = count;
  });
}

function productImage(product) {
  return product.imageUrl
    ? `<img src="${product.imageUrl}" alt="${product.name}">`
    : '<span>ДСЦТС</span>';
}

function categoryName(product) {
  return product.category?.name || 'Ангилалгүй';
}

async function loadProductsPage() {
  const grid = byId('product-grid');
  if (!grid) return;

  try {
    const [{ products }, { categories }] = await Promise.all([
      API.apiRequest('/products'),
      API.apiRequest('/categories')
    ]);

    const filter = byId('category-filter');
    if (filter) {
      filter.innerHTML = '<option value="">Бүх ангилал</option>' + categories.map(category =>
        `<option value="${category._id}">${category.name}</option>`
      ).join('');

      filter.addEventListener('change', () => renderProducts(products));
    }

    renderProducts(products);
  } catch (error) {
    grid.innerHTML = `<div class="empty-shop">Бүтээгдэхүүн уншихад алдаа гарлаа: ${error.message}</div>`;
  }
}

function renderProducts(products) {
  const grid = byId('product-grid');
  const filterValue = byId('category-filter')?.value || '';
  const visibleProducts = filterValue
    ? products.filter(product => product.category?._id === filterValue)
    : products;

  if (!visibleProducts.length) {
    grid.innerHTML = '<div class="empty-shop">Одоогоор бүтээгдэхүүн алга байна.</div>';
    return;
  }

  grid.innerHTML = visibleProducts.map(product => `
    <article class="product-card">
      <a class="product-media" href="/product-detail.html?id=${product._id}">${productImage(product)}</a>
      <div class="product-body">
        <a class="product-title" href="/product-detail.html?id=${product._id}">${product.name}</a>
        <div class="product-meta">${categoryName(product)} · ${product.stock} үлдэгдэл</div>
        <div class="product-footer">
          <div class="product-price">${money(product.price)}</div>
          <button class="btn btn-primary btn-sm" onclick="addProductToCart('${product._id}')">Сагслах</button>
        </div>
      </div>
    </article>
  `).join('');

  window.PRODUCT_CACHE = products;
}

async function loadProductDetailPage() {
  const detail = byId('product-detail');
  if (!detail) return;

  const id = new URLSearchParams(window.location.search).get('id');
  if (!id) {
    detail.innerHTML = '<div class="empty-shop">Бүтээгдэхүүн олдсонгүй.</div>';
    return;
  }

  try {
    const { product } = await API.apiRequest(`/products/${id}`);
    window.PRODUCT_CACHE = [product];
    detail.innerHTML = `
      <div class="detail-layout">
        <div class="detail-media">${productImage(product)}</div>
        <aside class="shop-panel">
          <div class="product-meta">${categoryName(product)}</div>
          <h1 style="font-size:28px;line-height:1.2;margin:8px 0 10px">${product.name}</h1>
          <div class="product-price" style="font-size:24px;margin-bottom:16px">${money(product.price)}</div>
          <p style="color:var(--text-secondary);line-height:1.7">${product.description || 'Тайлбар оруулаагүй байна.'}</p>
          <div style="display:grid;gap:8px;margin:16px 0;color:var(--text-secondary);font-size:13px">
            <div><strong>Өнгө:</strong> ${product.colors?.join(', ') || '—'}</div>
            <div><strong>Хэмжээ:</strong> ${product.sizes?.join(', ') || '—'}</div>
            <div><strong>Материал:</strong> ${product.material || '—'}</div>
            <div><strong>Үлдэгдэл:</strong> ${product.stock}</div>
          </div>
          <button class="btn btn-primary" style="width:100%;justify-content:center" onclick="addProductToCart('${product._id}')">Сагсанд нэмэх</button>
        </aside>
      </div>`;
  } catch (error) {
    detail.innerHTML = `<div class="empty-shop">Бүтээгдэхүүн уншихад алдаа гарлаа: ${error.message}</div>`;
  }
}

async function addProductToCart(productId) {
  let product = (window.PRODUCT_CACHE || []).find(item => item._id === productId);

  if (!product) {
    const data = await API.apiRequest(`/products/${productId}`);
    product = data.product;
  }

  const cart = readCart();
  const existing = cart.find(item => item.product === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      product: product._id,
      name: product.name,
      imageUrl: product.imageUrl,
      price: product.price,
      quantity: 1
    });
  }

  saveCart(cart);
  alert('Сагсанд нэмэгдлээ');
}

function renderCartPage() {
  const root = byId('cart-root');
  if (!root) return;

  const cart = readCart();
  if (!cart.length) {
    root.innerHTML = '<div class="shop-panel empty-shop">Сагс хоосон байна.</div>';
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  root.innerHTML = `
    <div class="checkout-layout">
      <section class="shop-panel">
        ${cart.map(item => `
          <div class="cart-row">
            <div class="cart-thumb">${item.imageUrl ? `<img src="${item.imageUrl}" alt="">` : 'ДСЦТС'}</div>
            <div>
              <div style="font-weight:800">${item.name}</div>
              <div style="font-size:13px;color:var(--text-secondary);margin:5px 0">${money(item.price)}</div>
              <button class="btn btn-secondary btn-sm" onclick="removeCartItem('${item.product}')">Устгах</button>
            </div>
            <div>
              <div class="qty-control">
                <button onclick="changeQuantity('${item.product}', -1)">−</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity('${item.product}', 1)">+</button>
              </div>
            </div>
          </div>
        `).join('')}
      </section>
      <aside class="shop-panel">
        <div style="font-size:13px;color:var(--text-secondary)">Нийт дүн</div>
        <div class="product-price" style="font-size:26px;margin:8px 0 18px">${money(total)}</div>
        <a class="btn btn-primary" href="/checkout.html" style="width:100%;justify-content:center;text-decoration:none">Захиалах</a>
      </aside>
    </div>`;
}

function changeQuantity(productId, delta) {
  const cart = readCart().map(item =>
    item.product === productId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
  );
  saveCart(cart);
  renderCartPage();
}

function removeCartItem(productId) {
  saveCart(readCart().filter(item => item.product !== productId));
  renderCartPage();
}

async function loadCheckoutPage() {
  const root = byId('checkout-root');
  if (!root) return;

  const cart = readCart();
  if (!cart.length) {
    root.innerHTML = '<div class="shop-panel empty-shop">Захиалах бүтээгдэхүүн алга байна.</div>';
    return;
  }

  let paymentInfo = null;
  try {
    const data = await API.apiRequest('/payment-info');
    paymentInfo = data.paymentInfo;
  } catch (error) {
    paymentInfo = null;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  root.innerHTML = `
    <div class="checkout-layout">
      <section class="shop-panel">
        <form onsubmit="submitCheckout(event)">
          <div class="form-grid">
            <div class="form-group"><label class="form-label">Нэр</label><input class="form-input" name="customerName" required></div>
            <div class="form-group"><label class="form-label">И-мэйл</label><input class="form-input" name="email" type="email" required></div>
          </div>
          <div class="form-grid">
            <div class="form-group"><label class="form-label">Утас</label><input class="form-input" name="phone" required></div>
            <div class="form-group"><label class="form-label">Төлбөр</label><select class="form-input" name="paymentMethod"><option value="bank_transfer">Банк</option><option value="qpay">QPay</option></select></div>
          </div>
          <div class="form-group"><label class="form-label">Хаяг</label><textarea class="form-input" name="address" rows="3" required></textarea></div>
          <div class="form-group"><label class="form-label">Тэмдэглэл</label><textarea class="form-input" name="notes" rows="2"></textarea></div>
          <button class="btn btn-primary" type="submit">Захиалга баталгаажуулах</button>
        </form>
      </section>
      <aside class="shop-panel">
        <div style="font-weight:800;margin-bottom:12px">Захиалгын дүн</div>
        ${cart.map(item => `<div style="display:flex;justify-content:space-between;gap:12px;margin-bottom:8px;font-size:13px"><span>${item.name} × ${item.quantity}</span><strong>${money(item.price * item.quantity)}</strong></div>`).join('')}
        <div class="divider" style="margin:14px 0"></div>
        <div style="display:flex;justify-content:space-between;align-items:center"><span>Нийт</span><strong class="product-price">${money(total)}</strong></div>
        ${paymentInfo ? `<div style="margin-top:18px;font-size:13px;color:var(--text-secondary);line-height:1.7"><strong>${paymentInfo.bankName}</strong><br>${paymentInfo.accountName}<br>${paymentInfo.accountNumber}<br>${paymentInfo.instructions || ''}</div>` : ''}
      </aside>
    </div>`;
}

async function submitCheckout(event) {
  event.preventDefault();
  const form = event.target;
  const cart = readCart();

  const payload = {
    customerName: form.customerName.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    address: form.address.value.trim(),
    paymentMethod: form.paymentMethod.value,
    notes: form.notes.value.trim(),
    items: cart.map(item => ({
      product: item.product,
      quantity: item.quantity
    }))
  };

  try {
    await API.apiRequest('/orders', {
      method: 'POST',
      body: payload
    });
    saveCart([]);
    event.target.closest('.shop-panel').innerHTML = '<div class="empty-shop">Захиалга амжилттай илгээгдлээ.</div>';
  } catch (error) {
    alert(error.message);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  loadProductsPage();
  loadProductDetailPage();
  renderCartPage();
  loadCheckoutPage();
});
