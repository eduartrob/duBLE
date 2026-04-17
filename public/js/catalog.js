/* ─────────────────────────────────────────────
   duBlé — Catálogo, Carrito y Checkout
   ───────────────────────────────────────────── */

/* ══ State ══ */
let products = [];
let cart = [];
let waNumber = '';

try { cart = JSON.parse(localStorage.getItem('dubleCart') || '[]'); } catch (_) { cart = []; }

/* ══ DOM refs ══ */
const $ = id => document.getElementById(id);

const productGrid   = $('product-grid');
const emptyState    = $('empty-state');
const errorState    = $('error-state');
const cartBadge     = $('cart-badge');
const cartBadgeFloat = $('cart-badge-float');
const cartItemsEl   = $('cart-items');
const cartEmptyEl   = $('cart-empty');
const cartTotalRow  = $('cart-total-row');
const cartTotalVal  = $('cart-total-value');
const checkoutBlock = $('checkout-block');
const cartCta       = $('cart-cta');
const formError     = $('form-error');
const toast         = $('toast');
const floatCartBtn  = $('btn-float-cart');

/* ══════════════════════════════════════════════
   BOOT
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  fetchConfig();
  loadProducts('todos');
  bindFilters();
  bindNavScroll();
  bindCartEvents();
  bindHamburger();
  syncCartUI();
  showFloatCart();
});

/* ── Fetch WhatsApp number from backend config ── */
async function fetchConfig() {
  try {
    const r = await fetch('/api/config');
    const d = await r.json();
    waNumber = d.whatsappNumber || '';
  } catch (_) {}
}

/* ── Navbar scroll effect ── */
function bindNavScroll() {
  const nav = $('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
}

/* ══════════════════════════════════════════════
   PRODUCTS
══════════════════════════════════════════════ */
async function loadProducts(category) {
  productGrid.innerHTML = skeletonHTML(3);
  emptyState.classList.add('hidden');
  errorState.classList.add('hidden');

  try {
    const url = category === 'todos'
      ? '/api/products'
      : `/api/products?category=${category}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('API error');
    products = await res.json();
    renderProducts(products);
  } catch (_) {
    productGrid.innerHTML = '';
    errorState.classList.remove('hidden');
  }
}

function renderProducts(items) {
  if (!items.length) {
    productGrid.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }
  emptyState.classList.add('hidden');

  /* Design 1 editorial style: every 2nd card is offset down */
  productGrid.innerHTML = items.map((p, i) => productCardHTML(p, i)).join('');

  /* Event delegation — add to cart */
  productGrid.addEventListener('click', handleGridClick);
}

function handleGridClick(e) {
  const btn = e.target.closest('[data-add]');
  if (!btn) return;
  const product = products.find(p => p._id === btn.dataset.add);
  if (product) addToCart(product);
}

/* Product card HTML — Design 1 editorial style */
function productCardHTML(p, index) {
  const offset = index % 2 === 1 ? 'md:translate-y-10' : '';
  const badge  = p.badge
    ? `<div class="absolute top-3 left-3 z-10">
         <span class="bg-secondary text-secondary-on px-3 py-1 rounded-full
                      text-[10px] font-bold uppercase tracking-wider font-body">
           ${escHtml(p.badge)}
         </span>
       </div>`
    : '';

  return `
    <article class="prod-card flex flex-col group relative ${offset}">
      ${badge}
      <div class="relative w-full aspect-[4/5] bg-surface-container rounded-2xl overflow-hidden mb-5">
        <img
          src="${escHtml(p.image)}"
          alt="${escHtml(p.name)}"
          class="prod-img w-full h-full object-cover mix-blend-multiply"
          loading="lazy"
          onerror="this.src='https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80';this.style.mixBlendMode='normal'"
        />
      </div>
      <div class="flex justify-between items-end gap-4">
        <div class="flex flex-col gap-1 min-w-0">
          <h3 class="headline text-xl font-bold text-on truncate">${escHtml(p.name)}</h3>
          <p class="font-body text-on-muted text-xs leading-relaxed line-clamp-2">${escHtml(p.description)}</p>
          <p class="headline text-base font-semibold text-primary mt-1">
            $${fmtPrice(p.price)}
          </p>
        </div>
        <button
          data-add="${escHtml(p._id)}"
          aria-label="Agregar ${escHtml(p.name)} al carrito"
          class="shrink-0 p-3 rounded-full border border-outline/40 text-on
                 hover:bg-primary hover:text-primary-on hover:border-primary
                 transition-all duration-200">
          <span class="material-symbols-outlined" style="font-size:20px">add</span>
        </button>
      </div>
    </article>`;
}

function skeletonHTML(n) {
  return Array.from({ length: n }, (_, i) =>
    `<div class="skeleton rounded-2xl ${i % 2 === 1 ? 'md:translate-y-10' : ''}"
          style="height:420px"></div>`
  ).join('');
}

/* ══════════════════════════════════════════════
   CATEGORY FILTERS
══════════════════════════════════════════════ */
function bindFilters() {
  const filtersEl = $('filters');
  if (!filtersEl) return;

  filtersEl.addEventListener('click', e => {
    const btn = e.target.closest('.pill');
    if (!btn) return;
    filtersEl.querySelectorAll('.pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    /* Remove old grid click listener before re-render */
    productGrid.removeEventListener('click', handleGridClick);
    loadProducts(btn.dataset.cat);
  });
}

/* ══════════════════════════════════════════════
   CART — STATE
══════════════════════════════════════════════ */
function addToCart(product) {
  const existing = cart.find(i => i._id === product._id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart();
  syncCartUI();
  showToast(`"${product.name}" agregado`);
}

function removeFromCart(id) {
  cart = cart.filter(i => i._id !== id);
  saveCart();
  syncCartUI();
}

function changeQty(id, delta) {
  const item = cart.find(i => i._id === id);
  if (!item) return;
  item.quantity = Math.max(1, item.quantity + delta);
  saveCart();
  syncCartUI();
}

function saveCart() {
  localStorage.setItem('dubleCart', JSON.stringify(cart));
}

function cartSum() {
  return cart.reduce((s, i) => s + i.price * i.quantity, 0);
}

/* ══════════════════════════════════════════════
   CART — UI
══════════════════════════════════════════════ */
function syncCartUI() {
  const total = cartSum();
  const count = cart.reduce((s, i) => s + i.quantity, 0);

  /* Badge */
  if (count > 0) {
    cartBadge.textContent = count;
    cartBadge.style.display = 'inline-flex';
    if (cartBadgeFloat) { cartBadgeFloat.textContent = count; cartBadgeFloat.style.display = 'inline-flex'; }
  } else {
    cartBadge.style.display = 'none';
    if (cartBadgeFloat) cartBadgeFloat.style.display = 'none';
  }

  /* Empty vs populated */
  const hasItems = cart.length > 0;
  cartEmptyEl.classList.toggle('hidden', hasItems);
  cartTotalRow.classList.toggle('hidden', !hasItems);
  checkoutBlock.classList.toggle('hidden', !hasItems);
  cartCta.classList.toggle('hidden', !hasItems);

  if (!hasItems) { cartItemsEl.innerHTML = ''; return; }

  /* Total */
  cartTotalVal.textContent = `$${fmtPrice(total)}`;

  /* Items */
  cartItemsEl.innerHTML = cart.map(item => `
    <div class="flex gap-4 items-start" data-item="${escHtml(item._id)}">
      <img
        src="${escHtml(item.image)}"
        alt="${escHtml(item.name)}"
        class="w-16 h-16 rounded-xl object-cover bg-surface-high shrink-0"
        onerror="this.src='https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&q=60'"
      />
      <div class="flex-1 min-w-0">
        <h4 class="font-body font-bold text-on text-sm leading-tight truncate">${escHtml(item.name)}</h4>
        <p class="text-on-muted text-xs mt-0.5 font-body">$${fmtPrice(item.price)} c/u</p>
        <div class="flex items-center gap-2 mt-2">
          <button class="qty-btn" data-action="dec" data-id="${escHtml(item._id)}" aria-label="Menos">
            <span class="material-symbols-outlined" style="font-size:16px">remove</span>
          </button>
          <span class="font-body font-bold text-on text-sm w-5 text-center">${item.quantity}</span>
          <button class="qty-btn" data-action="inc" data-id="${escHtml(item._id)}" aria-label="Más">
            <span class="material-symbols-outlined" style="font-size:16px">add</span>
          </button>
          <span class="ml-auto headline font-bold text-primary text-sm">
            $${fmtPrice(item.price * item.quantity)}
          </span>
        </div>
      </div>
      <button class="text-outline-dark hover:text-red-500 transition-colors shrink-0 mt-0.5"
              data-action="remove" data-id="${escHtml(item._id)}" aria-label="Eliminar">
        <span class="material-symbols-outlined" style="font-size:22px">delete</span>
      </button>
    </div>`).join('');
}

/* ══════════════════════════════════════════════
   CART — EVENTS
══════════════════════════════════════════════ */
/* ── Hamburger / mobile nav ── */
function bindHamburger() {
  const hamburger = $('hamburger');
  const mobileNav = $('mobile-nav');
  if (!hamburger || !mobileNav) return;
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    if (mobileNav.classList.contains('open')) closeCart();
  });
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ── Show float cart button on mobile ── */
function showFloatCart() {
  if (!floatCartBtn) return;
  const update = () => {
    floatCartBtn.style.display = window.innerWidth <= 768 ? 'flex' : 'none';
  };
  update();
  window.addEventListener('resize', update);
}

function bindCartEvents() {
  /* Open / close */
  $('btn-open-cart').addEventListener('click', openCart);
  if (floatCartBtn) floatCartBtn.addEventListener('click', openCart);
  $('btn-close-cart').addEventListener('click', closeCart);
  $('cart-backdrop').addEventListener('click', closeCart);

  /* Item actions (qty + remove) via event delegation */
  cartItemsEl.addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const id = btn.dataset.id;
    const action = btn.dataset.action;
    if (action === 'remove') removeFromCart(id);
    if (action === 'inc')    changeQty(id, +1);
    if (action === 'dec')    changeQty(id, -1);
  });

  /* WhatsApp checkout */
  $('btn-whatsapp').addEventListener('click', handleCheckout);
}

function openCart() {
  const hamburger = $('hamburger');
  const mobileNav = $('mobile-nav');
  if (hamburger) hamburger.classList.remove('open');
  if (mobileNav) mobileNav.classList.remove('open');
  document.body.style.overflow = '';
  document.body.classList.add('cart-open');
}
function closeCart() { document.body.classList.remove('cart-open'); }

/* ══════════════════════════════════════════════
   CHECKOUT + WHATSAPP
══════════════════════════════════════════════ */
async function handleCheckout() {
  const name    = $('f-name').value.trim();
  const address = $('f-address').value.trim();
  const phone   = $('f-phone').value.trim();
  const notes   = $('f-notes').value.trim();

  if (!name || !address || !phone) {
    formError.classList.remove('hidden');
    $('f-name').scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  formError.classList.add('hidden');

  const payload = {
    customer: { name, address, phone, notes },
    items: cart.map(i => ({
      productId: i._id,
      name:      i.name,
      price:     i.price,
      quantity:  i.quantity
    })),
    total: cartSum()
  };

  /* Save order to DB (fire and continue even if fails) */
  fetch('/api/orders', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload)
  }).catch(() => {});

  /* Build WhatsApp message */
  const lines = cart.map(i =>
    `• ${i.name} x${i.quantity}  →  $${fmtPrice(i.price * i.quantity)}`
  ).join('\n');

  const msg =
    `\u00a1Hola duBlé! Quiero hacer un pedido:\n\n` +
    `*Productos:*\n${lines}\n\n` +
    `*Total: $${fmtPrice(payload.total)} MXN*\n\n` +
    `*Datos de entrega:*\n` +
    `Nombre: ${name}\n` +
    `Direcci\u00f3n: ${address}\n` +
    `Tel\u00e9fono: ${phone}` +
    (notes ? `\nNotas: ${notes}` : '') +
    `\n\n_Quedo en espera de sus instrucciones de pago. Gracias._`;

  const base = waNumber ? `https://wa.me/${waNumber}` : 'https://wa.me/';
  const waUrl = `${base}?text=${encodeURIComponent(msg)}`;

  /* Clear cart, close drawer, redirect */
  cart = [];
  saveCart();
  syncCartUI();
  closeCart();
  window.open(waUrl, '_blank');
}

/* ══════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════ */
function fmtPrice(n) {
  return Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

let _toastTimer;
function showToast(msg) {
  toast.textContent = `✓ ${msg}`;
  toast.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}
