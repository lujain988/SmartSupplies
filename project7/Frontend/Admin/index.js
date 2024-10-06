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

    async function fetchOrderCount() {
        try {
            const response = await fetch('https://localhost:44381/api/AdminDashboardStatstic/orders/total'); // Update this URL to 
            const count = await response.json();
    
            const orderCountElement = document.querySelector('.widget-data .order-count');
   
            orderCountElement.textContent = count;
    
        } catch (error) {
            console.error('Error fetching order count:', error);
        }
    }
    

    fetchOrderCount();
    


async function fetchUserCount() {
    try {
        const response = await fetch('https://localhost:44381/api/AdminDashboardStatstic/users/total'); // Change to your Users API 
        const userCount = await response.json();

        
        const userCountElement = document.querySelector('.widget-data .user-count');

        userCountElement.textContent = userCount;

    } catch (error) {
        console.error('Error fetching user count:', error);
    }
}
fetchUserCount();



async function fetchCategoryProductCount() {
    try {
        const response = await fetch('https://localhost:44381/api/AdminDashboardStatstic/CategoryProductCount');
        const data = await response.json();


        const labels = data.map(item => item.categoryName);
        const counts = data.map(item => item.productCount);

     

        const ctx = document.getElementById('categoryChart').getContext('2d');
        const categoryChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Number of Products',
                    data: counts,
                    backgroundColor: 'rgba(0, 194, 255, 0.7)',
                    borderColor: 'rgba(0, 194, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true, 
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

fetchCategoryProductCount(); 



async function fetchActiveVouchers() {
    try {
        const response = await fetch('https://localhost:44381/api/AdminDashboardStatstic/GetActiveVouchers');
        const vouchers = await response.json();

       
        const voucherContainer = document.getElementById('voucherContainer');
        vouchers.forEach(voucher => {
            const voucherDiv = document.createElement('div');
            voucherDiv.classList.add('voucher');
            voucherDiv.innerHTML = `
                <h2>Code: ${voucher.code}</h2>
                <p class="discount">Discount: ${voucher.discountAmount * 100}%</p>
                <p class="expiration">Expires on: ${new Date(voucher.expirationDate).toLocaleDateString()}</p>
                <p class="order">${voucher.orderID ? 'Order ID: ' + voucher.orderID : 'No Order Associated'}</p>
            `;
            voucherContainer.appendChild(voucherDiv);
        });

    } catch (error) {
        console.error('Error fetching vouchers:', error);
    }
}


fetchActiveVouchers();