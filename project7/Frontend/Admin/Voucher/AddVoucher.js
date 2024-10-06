async function addvoucher() {

    let formData = new FormData(document.getElementById('addform'));
    let response = await fetch('https://localhost:44381/api/Admin/Addnewvoucher', {
        method: 'POST',
        body: formData,
    });
    alert("Voucher added successfully");
    
}
