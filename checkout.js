
// checkout.js
function getCart(){ try { return JSON.parse(localStorage.getItem('cart')||'[]'); } catch { return []; } }
function saveCart(c){ localStorage.setItem('cart', JSON.stringify(c)); }

const orderList = document.getElementById('orderList');
const orderTotal = document.getElementById('orderTotal');
const checkoutForm = document.getElementById('checkoutForm');

function renderOrder() {
  const cart = getCart();
  if (!cart.length) {
    orderList.innerHTML = '<p class="text-muted">Your cart is empty. <a href="index.html">Shop now</a>.</p>';
    orderTotal.textContent = '0.00';
    return;
  }
  orderList.innerHTML = '';
  let total = 0;
  cart.forEach(it => {
    const subtotal = it.price * it.qty;
    total += subtotal;
    const div = document.createElement('div');
    div.className = 'd-flex gap-3 align-items-center mb-2';
    div.innerHTML = `
      <img src="${it.image}" style="width:64px; height:64px; object-fit:contain;">
      <div>
        <div class="fw-bold">${escapeHtml(it.title)}</div>
        <div class="text-muted">Qty: ${it.qty} — $${it.price.toFixed(2)} each</div>
      </div>
      <div class="ms-auto fw-bold">$${subtotal.toFixed(2)}</div>
    `;
    orderList.appendChild(div);
  });
  orderTotal.textContent = total.toFixed(2);
}

function escapeHtml(s){ return s.replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }

checkoutForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const cart = getCart();
  if (!cart.length) {
    alert('Cart is empty.');
    window.location.href = 'index.html';
    return;
  }
  // very simple validation
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const address = document.getElementById('address').value.trim();
  const payment = document.getElementById('paymentType').value;
  if (!name || !email || !address || !payment) {
    alert('Please fill all fields.');
    return;
  }

  // Simulate submit: show success, clear cart, redirect to home
  alert('Order placed successfully! Thank you.');
  saveCart([]);
  window.location.href = 'index.html';
});

renderOrder();
