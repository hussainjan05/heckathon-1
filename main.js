// main.js
const API = 'https://fakestoreapi.com/products';
let products = [];
const productsRow = document.getElementById('productsRow');
const loading = document.getElementById('loading');
const priceRange = document.getElementById('priceRange');
const priceRangeValue = document.getElementById('priceRangeValue');
const clearFilter = document.getElementById('clearFilter');
const navCartCount = document.getElementById('navCartCount');

function getCart() {
  try {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  } catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  navCartCount.textContent = cart.reduce((s,i)=>s+i.qty,0);
}

// initial cart count
saveCart(getCart());

// fetch products
async function loadProducts() {
  try {
    const res = await fetch(API);
    products = await res.json();
    renderProducts(products);
    setRangeMax();
  } catch (err) {
    productsRow.innerHTML = `<p class="text-danger">Failed to load products. Try again later.</p>`;
  } finally {
    loading.style.display = 'none';
  }
}

// render
function renderProducts(list) {
  productsRow.innerHTML = '';
  if (!list.length) {
    productsRow.innerHTML = '<p class="text-muted">No products found for selected price range.</p>';
    return;
  }
  list.forEach(p => {
    const col = document.createElement('div');
    col.className = 'col-sm-6 col-md-4 col-lg-3';
    col.innerHTML = `
      <div class="card product-card h-100">
        <div class="product-image p-3 bg-light">
          <img src="${p.image}" alt="${escapeHtml(p.title)}" style="max-height:160px; width:auto;">
        </div>
        <div class="card-body d-flex flex-column">
          <h6 class="card-title mb-1" title="${escapeHtml(p.title)}">${truncate(p.title,60)}</h6>
          <p class="mb-2 text-success fw-bold">$${p.price.toFixed(2)}</p>
          <div class="mt-auto d-flex gap-2">
            <button id="modalViewProduct" class="btn btn-sm btn-outline-primary w-100 view-btn" data-id="${p.id}">View</button>
            <button id="modalAddToCart" class="btn btn-sm btn-primary add-btn" data-id="${p.id}">Add to Cart</button>
          </div>
        </div>
      </div>
    `;
    productsRow.appendChild(col);
  });

  // attach listeners
  document.querySelectorAll('.add-btn').forEach(b => b.addEventListener('click', (e)=> {
    const id = Number(e.currentTarget.dataset.id);
    addToCart(id);
  }));
  document.querySelectorAll('.view-btn').forEach(b => b.addEventListener('click', (e)=> {
    const id = Number(e.currentTarget.dataset.id);
    openModal(id);
  }));
}

// helpers
function truncate(s,n){ return s.length>n? s.slice(0,n-1)+'…' : s; }
function escapeHtml(s){ return s.replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }

// Add to cart
function addToCart(id) {
  const item = products.find(p=>p.id===id);
  if(!item) return;
  const cart = getCart();
  const idx = cart.findIndex(c=>c.id===id);
  if (idx>-1) cart[idx].qty += 1;
  else cart.push({ id: item.id, title: item.title, price: item.price, image: item.image, qty: 1 });
  saveCart(cart);
  showToast('Added to cart');
}

// simple toast
function showToast(msg){
  const t = document.createElement('div');
  t.className = 'toast align-items-center text-bg-dark border-0 position-fixed';
  t.style.right = '20px';
  t.style.bottom = '20px';
  t.role = 'alert';
  t.ariaLive = 'assertive';
  t.ariaAtomic = 'true';
  t.innerHTML = `<div class="d-flex"><div class="toast-body">${msg}</div><button class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>`;
  document.body.appendChild(t);
  const bs = new bootstrap.Toast(t, { delay: 1500 });
  bs.show();
  t.addEventListener('hidden.bs.toast', ()=> t.remove());
}

// Modal
const productModal = new bootstrap.Modal(document.getElementById('productModal'));
function openModal(id){
  const p = products.find(x=>x.id===id);
  if(!p) return;
  document.getElementById('modalTitle').textContent = p.title;
  document.getElementById('modalImage').src = p.image;
  document.getElementById('modalDescription').textContent = p.description;
  document.getElementById('modalCategory').textContent = p.category;
  document.getElementById('modalPrice').textContent = p.price.toFixed(2);
  document.getElementById('modalAddToCart').onclick = ()=>{
    addToCart(p.id);
    productModal.hide();
  };
  productModal.show();
}

// Price range filter
function setRangeMax(){
  const max = Math.ceil(Math.max(...products.map(p=>p.price)));
  priceRange.max = max;
  priceRange.value = max;
  priceRangeValue.textContent = 'All (≤ $' + max + ')';
}
priceRange.addEventListener('input', ()=>{
  const val = Number(priceRange.value);
  priceRangeValue.textContent = val ? '≤ $' + val : 'All';
  const filtered = products.filter(p => p.price <= val);
  renderProducts(filtered);
});
clearFilter.addEventListener('click', ()=>{
  priceRange.value = priceRange.max;
  priceRangeValue.textContent = 'All (≤ $' + priceRange.max + ')';
  renderProducts(products);
});



const heroImg = document.getElementById("heroImg");

let productId = 1; // start from product 1
const totalProducts = 20; // fakestoreapi has 20 products

function loadImage() {
  fetch(`https://fakestoreapi.com/products/${productId}`)
    .then((res) => res.json())
    .then((data) => {
      heroImg.classList.add("fade-out"); // fade animation
      setTimeout(() => {
        heroImg.src = data.image;
        heroImg.classList.remove("fade-out");
      }, 500);
    })
    .catch((err) => console.log("Error loading image:", err));

  productId++;
  if (productId > totalProducts) productId = 1; // loop back
}

// First load
loadImage();

// Change every 3 seconds
setInterval(loadImage, 3000);



  
  window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    loader.classList.add("hidden");
  });




// load
loadProducts();






