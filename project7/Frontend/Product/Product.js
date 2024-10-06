
const itemsPerPage = 6;
let currentPage = 1;
let allProducts = [];
let filteredProducts = [];
let selectedCategory = "All"; // Default category
let minPrice = 0;
let maxPrice = Infinity;

// Load CategoryId from localStorage

// Function to fetch all products
async function GetAllProduct() {
  const CategoryId = localStorage.getItem("categoryID");

  const url = `https://localhost:44381/api/Product`;

  try {
    // Make the API request
    let request = await fetch(url);
    if (!request.ok) {
      throw new Error(`HTTP error! Status: ${request.status}`);
    }

    // Parse the JSON response
    allProducts = await request.json();

    // Initialize filteredProducts with all fetched products
    filteredProducts = [...allProducts];

    // Apply initial filters (if any)
    applyFilters();
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}


function renderPage(page) {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageProducts = filteredProducts.slice(startIndex, endIndex);

  let cards = document.getElementById("conteainer");
  cards.innerHTML = "";

  pageProducts.forEach((product) => {
    let imageUrl = `${product.image}`;
  
    
    let discountHTML = '';
    if (product.discount && product.discount > 0) {
      let discountedPrice = product.price - (product.price * product.discount / 100);
      discountHTML = `
        <p class="product-price">
          <span class="original-price" style="text-decoration: line-through; font-size: 1.3rem;">$${product.price.toFixed(2)}</span> 
          $${discountedPrice.toFixed(2)} 
        </p>
      `;
    } else {
      // If no discount, show regular price
      discountHTML = `<p class="product-price">$${product.price.toFixed(2)}</p>`;
    }
    
    let cardHTML = `
      <div class="col-lg-4 col-md-6 text-center">
        <div class="single-product-item">
          <div class="product-image">
            <a   onclick="saveToLocalStorage(${product.id})">
              <img src="../Uploads/${product.image}" alt="${product.productName}">
            </a>
            ${product.discount > 0 ? `<span class="discount-badge">${product.discount}% Off</span>` : ''}
          </div>
          <h3>${product.productName}</h3>
          ${discountHTML} 
           <a href="" onclick="add(${product.id},'${product.productName}',${product.price},'${imageUrl}')" class="cart-btn"><i class="fas fa-shopping-cart"></i> Add to Cart</a>
          <br>
           <a href="#" onclick="saveToLocalStorage(${product.id})" class="see-more-btn" style="color: #ff8c00;">
            <i class="fas fa-chevron-right"></i> See More
          </a>
        </div>
      </div>
    `;
    
    
    cards.innerHTML += cardHTML;
  
    fetchAverageRating(product.id); // Fetch and display the rating for the product
  });
  
  updatePaginationControls();
}

// Function to update pagination controls
function updatePaginationControls() {
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  let pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  let paginationHTML = `
    <ul>
      <li ${
        currentPage === 1 ? 'class="disabled"' : ""
      }><a href="#" onclick="changePage(${currentPage - 1})">Prev</a></li>
  `;

  for (let i = 1; i <= totalPages; i++) {
    paginationHTML += `
      <li ${
        i === currentPage ? 'class="active"' : ""
      }><a href="#" onclick="changePage(${i})">${i}</a></li>
    `;
  }

  paginationHTML += `
      <li ${
        currentPage === totalPages ? 'class="disabled"' : ""
      }><a href="#" onclick="changePage(${currentPage + 1})">Next</a></li>
    </ul>
  `;

  pagination.innerHTML = paginationHTML;
}

// Function to handle page change
function changePage(page) {
  if (page < 1 || page > Math.ceil(filteredProducts.length / itemsPerPage))
    return;
  currentPage = page;
  renderPage(currentPage);
}
function handleCategoryClick(category) {
  localStorage.removeItem("categoryID");
  selectedCategory = category;
  applyFilters();

  let listItems = document.querySelectorAll("#Addfilter li");
  listItems.forEach((item) => item.classList.remove("active"));

  let activeItem = document.querySelector(`[data-filter="${category}"]`);
  if (activeItem) {
    activeItem.classList.add("active");
  }
}

async function applyFilters() {
  const storedCategory = localStorage.getItem("categoryID");
  const category = storedCategory || selectedCategory;

  let url = `https://localhost:44381/filterOnCategory?category=${category}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    filteredProducts = await response.json();
  } catch (error) {
    console.error("Error fetching filtered products by category:", error);
  }

  // Apply price filter, taking discounts into account
  filteredProducts = filteredProducts.filter((product) => {
    let effectivePrice = product.discount && product.discount > 0
      ? product.price - (product.price * product.discount / 100)
      : product.price;
    
    return effectivePrice >= minPrice && effectivePrice <= maxPrice;
  });

  currentPage = 1; // Reset to the first page
  renderPage(currentPage);
}

applyFilters();

// Function to fetch average rating
async function fetchAverageRating(productId) {
  let url = `https://localhost:44381/api/Product/average-rating/${productId}`;
  try {
    let response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let data = await response.json();

    let averageRating =
      data && data.averageRating != null ? data.averageRating : 5;
    let ratingContainer = document.getElementById(`rating-${productId}`);
    ratingContainer.innerHTML = `<i class="fas fa-star"> Rating: ${averageRating}</i>`;
  } catch (error) {
    console.error("Error fetching average rating:", error);
  }
}

// Function to get categories
async function getCategories() {
  const url = `https://localhost:44381/getCategories`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    let list = document.getElementById("Addfilter");
    list.innerHTML = "";

    list.innerHTML += `<li class="active" data-filter="All" onclick="handleCategoryClick('All')">All</li>`;

    data.forEach((item) => {
      list.innerHTML += `<li data-filter="${item.categoryName}" onclick="handleCategoryClick('${item.categoryName}')">${item.categoryName}</li>`;
    });

    console.log(data);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}

// Function to handle filter button click
function handleFilterButtonClick() {
  minPrice = parseFloat(document.getElementById("minPrice").value) || 0;
  maxPrice = parseFloat(document.getElementById("maxPrice").value) || Infinity;

  console.log("Filter button clicked:", minPrice, maxPrice);

  applyFilters();
}

// Add event listener to filter button
document
  .getElementById("filterButton")
  .addEventListener("click", handleFilterButtonClick);

// Function to save product ID to localStorage
function saveToLocalStorage(id) {
  localStorage.setItem("products", id);
  window.location.href = "ProductDetailes.html";
}

document.addEventListener("DOMContentLoaded", () => {
  getCategories(); // Fetch categories and set up the filters
  GetAllProduct("All"); // Fetch all products with the default category "All"
});
async function add(Id, ProductName, Price, Image) {
  event.preventDefault();
  localStorage.setItem("productId", Id);
  // localStorage.setItem("UserId", 0);
  var quantity = 1;

  const url = "https://localhost:44381/api/Cart";
  var request = {
    userId: localStorage.getItem("UserId"),
    ProductId: localStorage.getItem("productId"),
  };
  if (request.userId > 0) 
    {
    var data = await fetch(url, {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json",
      },
    });

  }
   else {
    var storeInlocal = {
      id: Id,
      userId: localStorage.getItem("UserId"),
      quantity: quantity,
      productName: ProductName,
      price: Price,
      image: Image,
    };

    var existingCart = localStorage.getItem("cart");
    var cart = JSON.parse(existingCart);
    // Check if a cart exists in localStorage
    var existingCart = localStorage.getItem("cart");

    // If cart exists, parse it, else create an empty array
    var cart = existingCart ? JSON.parse(existingCart) : [];

    // Check if the product already exists in the cart by productId
    const itemIndex = cart.findIndex((item) => item.id === storeInlocal.id);

    if (itemIndex !== -1) {
      // If the product exists, update its quantity
      cart[itemIndex].quantity += storeInlocal.quantity;
    } else {
      // If the product doesn't exist, add it to the cart
      cart.push(storeInlocal);
    }

    // Save the updated cart back to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    
  }
  alert("Product added successfully");
}
