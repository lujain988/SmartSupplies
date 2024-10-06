// Variables to handle pagination
let currentPage = 1;
const itemsPerPage = 5;

async function getProduct() {
    try {
        const response = await fetch('https://localhost:44381/api/Product');
        const Products = await response.json();

        
        displayPaginatedCategories(Products, currentPage, itemsPerPage);
        setupPagination(Products, itemsPerPage);
        
    } catch (error) {
        console.error('Error fetching Products:', error);
    }
}

// Function to display paginated categories
function displayPaginatedCategories(Products, page, itemsPerPage) {
    const productContainer = document.getElementById('container');
    productContainer.innerHTML = '';  // Clear the current items

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = Products.slice(start, end);

    // Create table rows for paginated items
    paginatedItems.forEach(product => {
        productContainer.innerHTML += `
            <tr>
            <td>${product.id}</td>
                <td>${product.productName}</td>
                <td>${product.description}</td>
                <td>${product.price}</td>
                <td><img src="../../Uploads/${product.image}" alt="${product.productName}" class="img-fluid" style="height: 50px;"></td>
                 <td>${product.stockQuantity}</td>
                  <td>${product.categoryName}</td>
                <td>${product.discount}</td>
                
                <td><button class="btn btn-warning" onclick="getProductId(${product.id})">Edit</button>
                <button class="btn btn-danger"  onclick="deleteProduct(${product.id})">Delete</button>
                </td>
            </tr>
        `;
    });
}

// Function to set up pagination controls
function setupPagination(items, itemsPerPage) {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = '';  // Clear current pagination

    const pageCount = Math.ceil(items.length / itemsPerPage);
    
    for (let i = 1; i <= pageCount; i++) {
        paginationContainer.innerHTML += `<button class="btn btn-secondary mx-1" onclick="changePage(${i})">${i}</button>`;
    }
}

// Function to handle page changes
function changePage(pageNumber) {
    currentPage = pageNumber;
    getProduct();  // Re-fetch and display items for the new page
}

// Fetch and display the first set of categories
getProduct();

function getProductId(id) {
    localStorage.setItem('productId', id);
    window.location.href='updateproduct.html';
   
}

async function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this Product?')) {
        try {
            const response = await fetch(`https://localhost:44381/deleteProduct/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                alert('Product deleted successfully');
                getProduct(); // Re-fetch categories to update the table
            } else {
                alert('Failed to delete Product');
            }
        } catch (error) {
            console.error('Error deleting Product:', error);
            alert('Error deleting Product');
        }
    }
}
