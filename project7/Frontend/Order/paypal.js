function initPayPalButton() {
    // Retrieve the total price from localStorage
    const totalPrice = localStorage.getItem('Totalprice') || '0.00';
    document.getElementById("total").innerHTML = "$" + totalPrice;

    paypal.Buttons({
        style: {
            shape: 'rect',
            color: 'gold',
            layout: 'vertical',
            label: 'paypal',
        },

        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        currency_code: "USD",
                        value: totalPrice, 
                    }
                }]
            });
        },

        onApprove: function(data, actions) {
            return actions.order.capture().then(function(orderData) {
                console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
                
                // Show a SweetAlert success message
                Swal.fire({
                    icon: 'success',
                    title: 'Payment Successful',
                    text: 'Thank you for your payment!',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Redirect to another page after confirmation
                        window.location.href = "../index_2.html";
                    }
                });
            });
        },

        onError: function(err) {
            console.error('PayPal Error:', err);
        }
    }).render('#paypal-button-container');
}

// Initialize PayPal button
window.onload = initPayPalButton;
