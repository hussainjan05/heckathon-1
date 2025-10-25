// cart.js
function getCart() {
  try { return JSON.parse(localStorage.getItem('cart') || '[]'); }
  catch { return []; }
}
function saveCart(cart) { localStorage.setItem('cart', JSON.stringify(cart)); updateNavCount(); }

const cartBody = document.getElementById('cartBody');
const cartArea = document.getElementById('cartArea');
const cartEmpty = document.getElementById('cartEmpty');
const cartTotalEl = document.getElementById('cartTotal');
const clearCartBtn = document.getElementById('clearCartBtn');

function updateNavCount() {
  const count = getCart().reduce((s,i)=>s+i.qty,0);
  const navCount = document.getElementById('navCartCount');
  if(navCount) navCount.textContent = count;
}

function renderCart(){
  const cart = getCart();
  if (!cart.length) {
    cartArea.classList.add('d-none');
    cartEmpty.classList.remove('d-none');
    updateNavCount();
    return;
  }
  cartEmpty.classList.add('d-none');
  cartArea.classList.remove('d-none');
  cartBody.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="d-flex align-items-center gap-3">
        <img src="${item.image}" alt="" style="width:64px; height:64px; object-fit:contain;">
        <div>
          <div class="fw-bold">${escapeHtml(item.title)}</div>
        </div>
      </td>
      <td>$${item.price.toFixed(2)}</td>
      <td>
        <div class="btn-group" role="group">
          <button class="btn btn-sm btn-outline-secondary dec-btn" data-id="${item.id}">−</button>
          <button class="btn btn-sm btn-light" disabled>${item.qty}</button>
          <button class="btn btn-sm btn-outline-secondary inc-btn" data-id="${item.id}">+</button>
        </div>
      </td>
      <td>$${subtotal.toFixed(2)}</td>
      <td><button class="btn btn-sm btn-danger del-btn" data-id="${item.id}">Delete</button></td>
    `;
    cartBody.appendChild(tr);
  });
  cartTotalEl.textContent = total.toFixed(2);

  // listeners
  document.querySelectorAll('.inc-btn').forEach(b => b.addEventListener('click', e=>{
    const id = Number(e.currentTarget.dataset.id);
    changeQty(id, +1);
  }));
  document.querySelectorAll('.dec-btn').forEach(b => b.addEventListener('click', e=>{
    const id = Number(e.currentTarget.dataset.id);
    changeQty(id, -1);
  }));
  document.querySelectorAll('.del-btn').forEach(b => b.addEventListener('click', e=>{
    const id = Number(e.currentTarget.dataset.id);
    deleteItem(id);
  }));

  updateNavCount();
}

function changeQty(id, delta){
  const cart = getCart();
  const idx = cart.findIndex(c=>c.id===id);
  if (idx === -1) return;
  cart[idx].qty += delta;
  if (cart[idx].qty < 1) cart.splice(idx,1);
  saveCart(cart);
  renderCart();
}
function deleteItem(id) {
  let cart = getCart();
  cart = cart.filter(c=>c.id !== id);
  saveCart(cart);
  renderCart();
}
clearCartBtn.addEventListener('click', ()=>{
  if (confirm('Clear all items from cart?')) {
    saveCart([]);
    renderCart();
  }
});

function escapeHtml(s){ return s.replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }

renderCart();
