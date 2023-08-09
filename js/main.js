const content = document.querySelector(".content");
const loader = document.querySelector(".loader");
const cartCount = document.querySelector(".cart_count");
const likeCount = document.querySelector(".like_count");
const navProducts = document.querySelector(".nav_products_content");

let allData = JSON.parse(localStorage.getItem("allData") || "[]");
let cart = JSON.parse(localStorage.getItem("cart") || "[]");
let like = JSON.parse(localStorage.getItem("like") || "[]");

let boxes = ``;

function updateCart() {
  showNavbarProduct();
  numberOfCount();
}

updateCart();

async function getAllData(api) {
  try {
    const response = await fetch(api);
    const data = await response.json();

    if (response) {
      hideLoader();
    }

    localStorage.setItem("allData", JSON.stringify(data.products));
    showProducts(data.products);
  } catch (err) {
    console.log(err.message, "Error");
  }
}

getAllData("https://dummyjson.com/products");

function hideLoader() {
  loader.style.display = "none";
}

function showProducts(products) {
  products?.forEach((item) => {
    boxes += `
        <div class="box"> 
          <div class="box_header">
            <img
              src="${item?.thumbnail}"
              alt="thumbnail"
            />
            <div class="like_product_box" onclick="addLike(${item.id})">
              <i class="fa-solid fa-heart"></i>
            </div>
          </div>
          <div class="box_content">
            <div class="description"><p>${item?.description}</p></div>
            <div class="icons">
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
            </div>
            <button onclick="addToCart(${item?.id})">Add to cart</button>
          </div>
        </div>       
        `;
  });

  content.innerHTML = boxes;
}

function addLike(id) {
  let liked = allData.find((item) => item.id === id);

  if (like.some((item) => item?.id === id)) {
    like = like.filter((item) => item.id !== id);
    toastHandle("Like dan o'chirildi", "pink");
    document
      .querySelectorAll(".like_product_box")
      [id - 1]?.classList.remove("active");
    localStorage.setItem("like", JSON.stringify(like));
  } else {
    like.push(liked);
    toastHandle("Like ga qo'shildi", "green");
    document
      .querySelectorAll(".like_product_box")
      [id - 1]?.classList.add("active");
    localStorage.setItem("like", JSON.stringify(like));
  }
  numberOfCount();
}

function addToCart(id) {
  if (cart.some((item) => item?.id === id)) {
    numberOfCountFunc("plus", id);
    toastHandle("Added one more successfully", "#082cfd");
  } else {
    let cartItem = allData?.find((item) => item.id === id);
    cart.push({ ...cartItem, numberCount: 1 });
    cartCount.innerHTML = cart.length;
    toastHandle("Added to cart successfully", "#082cfd");
    localStorage.setItem("cart", JSON.stringify(cart));
    showNavbarProduct();
  }
  calculateCartItem();
}

function numberOfCountFunc(action, id) {
  cart = cart.map((item) => {
    let numberCount = item?.numberCount;

    if (item?.id === id) {
      if (action === "plus" && numberCount < item.stock) {
        numberCount++;
      } else if (action === "minus" && numberCount > 1) {
        numberCount--;
      }
    }

    return { ...item, numberCount };
  });

  localStorage.setItem("cart", JSON.stringify(cart));
  showNavbarProduct();
}

function showNavbarProduct() {
  const navThreeProduct = cart?.slice(0, 3);
  let navsP = ``;

  navThreeProduct.forEach((item) => {
    navsP += `    
    <div class="nav_product">
    <div class="nav_img">
      <img
        src="${item?.thumbnail}"
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

function handleDeleteCart(id) {
  cart = cart.filter((item) => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
  calculateCartItem();
}

function toastHandle(text, background) {
  Toastify({
    text,
    className: "info",
    gravity: "top", // `top` or `bottom`
    position: "center", // `left`, `center` or `right`
    style: {
      background,
      borderRadius: "12px",
    },
    duration: 1000,
  }).showToast();
}

function numberOfCount() {
  cartCount.innerHTML = cart.length;
  likeCount.innerHTML = like.length;
}

function calculateCartItem() {
  let allSum = 0;

  cart.forEach((item) => {
    allSum += item.numberCount * item.price;
  });

  document.querySelector(".all_sum").innerHTML = allSum + " $";
}

calculateCartItem();
