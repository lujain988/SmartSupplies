async function fetchAndDisplayCategories() {
    try {
        const response = await fetch('https://localhost:44381/api/Categories/GetAllCategory');
        const categories = await response.json();

        // Limit the categories to the first 3
        const limitedCategories = categories.slice(0, 3);
        const categoryContainer = document.getElementById('category-container');

        // Build the HTML for categories
        let categoriesHTML = '';
        limitedCategories.forEach(category => {
            categoriesHTML += `
                <div class="col-lg-3 col-md-6 text-center category-card">
                    <div class="category-image">
                        <img src="Uploads/${category.image}" alt="${category.categoryName}">
                    </div>
                    <h3>${category.categoryName}</h3>
                    <a onclick="saveToLocalStorage('${category.categoryName}')" class="view-all-btn">View All</a>
                </div>
            `;
        });

        // Set the inner HTML of the container to the generated HTML
        categoryContainer.innerHTML = categoriesHTML;
        
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

function saveToLocalStorage(categoryName) {
    localStorage.setItem("categoryID", categoryName);
    window.location.href = "Product/Product.html";
}

async function fetchAndDisplayDiscountProducts() {
    const url = 'https://localhost:44381/api/Product/discounted';
    try {
        const response = await fetch(url);
        const products = await response.json();

        const discountProductContainer = document.getElementById('discount-product-container');
        let productsHTML = '';

        const limitedProducts = products.slice(0, 3);

        // Loop through products and build the HTML
        limitedProducts.forEach(product => {
            const discountedPrice = product.price - (product.price * (product.discount / 100));
            productsHTML += `
                <div class="col-lg-4 col-md-6 text-center">
                    <div class="single-product-item">
                        <div class="product-image">
                            <a href="Product/Product.html">
                                <img src="Uploads/${product.image}" alt="${product.productName}">
                            </a>
                            <span class="discount-badge">${product.discount}% Off</span>
                        </div>
                        <h3>${product.productName}</h3>
                        <p class="product-price">
                            <span class="original-price">$${product.price.toFixed(2)}</span> 
                            $${discountedPrice.toFixed(2)}
                        </p>
                        <a href="Cart/Cart.html" class="cart-btn"><i class="fas fa-shopping-cart"></i> Add to Cart</a>
                    </div>
                </div>
            `;
        });

        discountProductContainer.innerHTML = productsHTML;
    } catch (error) {
        console.error('Error fetching discounted products:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayCategories(); 
    fetchAndDisplayDiscountProducts();
    GetAllProduct();
});
