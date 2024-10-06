async function fetchAndDisplayCategories() {
    try {
        const response = await fetch('https://localhost:44381/api/Categories/GetAllCategory');
        const categories = await response.json();

        const categoryContainer = document.getElementById('category-container');

        // Build the HTML for categories
        let categoriesHTML = '';
        categories.forEach(category => {
            categoriesHTML += `
                <div class="col-lg-3 col-md-6 text-center category-card">
                    <div class="category-image">
                        <img src="../Uploads/${category.image}" alt="${category.categoryName}">
                    </div>
                    <h3>${category.categoryName}</h3>
                    <a onclick="saveToLocalStorage('${category.categoryName}')" class="view-all-btn">View All</a>
                </div>
            `;
        });

        // Set the inner HTML of the container to the generated HTML
        categoryContainer.innerHTML += categoriesHTML;
        
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

function saveToLocalStorage(categoryName) {
    localStorage.setItem("categoryID", categoryName);
    window.location.href ="../Product/Product.html";
}
fetchAndDisplayCategories() 