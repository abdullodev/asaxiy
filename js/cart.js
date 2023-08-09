const cart_boxes = document.querySelector(".cart_boxes");
const cart_count = document.querySelector(".cart_count");

function addToCart(id) {
  let cartItem = allData?.find((item) => item.id === id);

  if (cart?.some((item) => item?.id === id)) {
    toastHandle("There is this product in the cart", "#76c51b");
  } else {
    cart.push(cartItem);
    cart_count.innerHTML = cart.length;
    toastHandle("Added to cart successfully", "#082cfd");
    localStorage.setItem("cart", JSON.stringify(cart));
    showNavbarProduct();
  }
  calculateCartItem();
}

function updateCart() {
  showNavbarProduct();
  numberOfCount();
  calculateCartItem();
}

updateCart();

function numberOfCount() {
  cart_count.innerHTML = cart.length;
}

function showNavbarProduct() {
  const navThreeProduct = cart.slice(0, 3);
  let navsP = ``;

  navThreeProduct.forEach((item) => {
    navsP += `
    <div class="nav_product">
    <div class="nav_img">
      <img
        src="${item?.images[0]}"
        alt=""
      />
    </div>
    <div class="nav_text">${item?.brand} (${item.numberCount})</div>
    <div class="nav_action">
      <div>${item?.price} $</div>
      <i class="fa-solid fa-xmark" onclick="handleDeleteCart(${item?.id})"></i>
    </div>
  </div>`;
  });

  navProducts.innerHTML = navsP;
}

showNavbarProduct();

function showCarts() {
  let cartsBox = ``;

  if (cart.length) {
    cart.forEach((item) => {
      cartsBox += `
      <div class="cart_box">
        <div class="cart_img_box">
          <img src="${item?.thumbnail}" alt="thumbnail" />
        </div>

        <div class="cart_btns">
          <p>${item.price} $</p>
          
          <button onclick="handleDeleteCart(${item.id})">Delete</button>
        </div>
      </div>
        `;
    });
    cart_boxes.innerHTML = cartsBox;
  } else {
    cartsBox = `
    <div class="no_carts">
      <p>There is no cart element</p>
      <a href="index.html">Home page</a>
    </div>`;
    cart_boxes.innerHTML = cartsBox;
  }
}

showCarts();

function handleDeleteCart(id) {
  cart = cart.filter((item) => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
  showCarts(cart);
}

function calculateCartItem() {
  let allSum = 0;

  cart.forEach((item) => {
    allSum += item.numberCount * item.price;
  });

  document.querySelector(".allSum").innerHTML = allSum + " $";
  document.querySelector(".summarize").innerHTML = allSum + " $";
}

calculateCartItem();
