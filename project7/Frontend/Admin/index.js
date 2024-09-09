async function fetchCategoryCount() {
    try {
        const response = await fetch('https://localhost:44381/api/Categories/CountAllCategory');
        const count = await response.json();

       
        const categoryCountElement = document.querySelector('.widget-data .weight-700');
        
        // Update the count in the element
        categoryCountElement.textContent = count;

    } catch (error) {
        console.error('Error fetching category count:', error);
    }
}


fetchCategoryCount();




    async function fetchProductCount() {
        try {
            const response = await fetch('https://localhost:44381/api/Product/CountOfAllProduct');
            const count = await response.json();

            // Find the element where the product count will be displayed
            const productCountElement = document.querySelector('.widget-data .product-count');

            // Update the count in the element
            productCountElement.textContent = count;

        } catch (error) {
            console.error('Error fetching product count:', error);
        }
    }

    // Call the function to fetch and display the product count
    fetchProductCount();

