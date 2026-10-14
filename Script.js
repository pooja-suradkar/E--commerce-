const searchInput = document.querySelector("#search");
const categorySelect = document.querySelector("#category");
const sortSelect = document.querySelector("#sort");
const productList = document.querySelector("#productList");
const cartList = document.querySelector("#cartList");
const cartCount = document.querySelector("#cartCount");
const totalElement = document.querySelector("#total");
const message = document.querySelector("#message");
const checkoutBtn = document.querySelector("#checkout");

let cart = [];

// Display products
function displayProducts(data) {
  productList.innerHTML = "";

  if (data.length === 0) {
    message.textContent = "No products found!";
    return;
  }

  message.textContent = `${data.length} products found`;

  data.forEach(function (product) {
    const card = document.createElement("div");
    card.className = "product-card";

    const name = document.createElement("h3");
    name.textContent = product.name;

    const category = document.createElement("p");
    category.textContent = `Category: ${product.category}`;

    const price = document.createElement("p");
    price.textContent = `Price: ₹${product.price}`;

    const button = document.createElement("button");
    button.textContent = "Add to Cart";
    button.dataset.id = product.id;

    card.append(name, category, price, button);
    productList.append(card);
  });
}

// Search, category and sorting
function filterProducts() {
  const searchValue = searchInput.value.trim().toLowerCase();
  const category = categorySelect.value;
  const sort = sortSelect.value;

  let result = products.filter(function (product) {
    const matchName = product.name
      .toLowerCase()
      .includes(searchValue);

    const matchCategory =
      category === "All" || product.category === category;

    return matchName && matchCategory;
  });

  if (sort === "low") {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === "high") {
    result.sort((a, b) => b.price - a.price);
  }

  displayProducts(result);
}

searchInput.addEventListener("input", filterProducts);
categorySelect.addEventListener("change", filterProducts);
sortSelect.addEventListener("change", filterProducts);

// Add product to cart
productList.addEventListener("click", function (e) {
  if (e.target.tagName === "BUTTON") {
    const id = Number(e.target.dataset.id);
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);

    if (existing) {
      existing.quantity++;
    } else if (product) {
      cart.push({ ...product, quantity: 1 });
    }

    message.textContent = "Product added to cart!";
    displayCart();
  }
});

// Display cart and calculate total
function displayCart() {
  cartList.innerHTML = "";

  cart.forEach(function (item) {
    const card = document.createElement("div");
    card.className = "cart-item";

    const details = document.createElement("p");
    details.textContent =
      `${item.name} | ₹${item.price} × ${item.quantity}`;

    const minus = document.createElement("button");
    minus.textContent = "-";
    minus.dataset.action = "minus";
    minus.dataset.id = item.id;

    const plus = document.createElement("button");
    plus.textContent = "+";
    plus.dataset.action = "plus";
    plus.dataset.id = item.id;

    const remove = document.createElement("button");
    remove.textContent = "Remove";
    remove.className = "remove-btn";
    remove.dataset.action = "remove";
    remove.dataset.id = item.id;

    card.append(details, minus, plus, remove);
    cartList.append(card);
  });

  const total = cart.reduce(function (sum, item) {
    return sum + item.price * item.quantity;
  }, 0);

  const count = cart.reduce(function (sum, item) {
    return sum + item.quantity;
  }, 0);

  totalElement.textContent = total;
  cartCount.textContent = count;
}

// Quantity and remove logic
cartList.addEventListener("click", function (e) {
  const action = e.target.dataset.action;
  const id = Number(e.target.dataset.id);

  if (!action) return;

  const index = cart.findIndex(item => item.id === id);

  if (index === -1) return;

  if (action === "plus") {
    cart[index].quantity++;
  } else if (action === "minus") {
    cart[index].quantity--;

    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
  } else if (action === "remove") {
    cart.splice(index, 1);
  }

  displayCart();
});

// Checkout
checkoutBtn.addEventListener("click", function () {
  if (cart.length === 0) {
    message.textContent = "Your cart is empty!";
  } else {
    message.textContent =
      `Order placed! Total: ₹${totalElement.textContent}`;

    cart = [];
    displayCart();
  }
});

// Initial display
displayProducts(products);
displayCart();
