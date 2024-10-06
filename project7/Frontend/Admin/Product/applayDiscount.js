

debugger;
async function applyDiscount() {
    const productId = document.getElementById('id').value;
    const discount = document.getElementById('discount').value;

    if (!productId || !discount) {
        alert("Enter product ID and discount.");
        return;
    }

    try {
        const response = await fetch(`https://localhost:44381/api/Product/${productId}/apply-discount`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parseFloat(discount))
        });

        const result = document.getElementById('result');
        if (response.ok) {
            const data = await response.json();
            result.innerHTML = `Success: ${data.message}, Discount: ${data.discount}%`;
        } else if (response.status === 400) {
            result.innerHTML = "Error: Invalid discount value.";
        } else if (response.status === 404) {
            result.innerHTML = "Error: Product not found.";
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to apply discount.');
    }
}

applyDiscount()