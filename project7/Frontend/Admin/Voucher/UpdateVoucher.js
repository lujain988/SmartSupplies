async function updatevoucher() {
    let voucher= localStorage.getItem('voucherId');
    const url = `https://localhost:44381/api/Admin/UpdateVoucher/${voucher}` ;
    let formData = new FormData(document.getElementById('Updateform')); 
    let response = await fetch(url, {
        method: 'PUT',
        body: formData,
    });
    alert("Voucher updated successfully");
}