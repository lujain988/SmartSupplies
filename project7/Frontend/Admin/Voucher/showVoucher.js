async function ShowVoucher() {
   let url = "https://localhost:44381/api/Admin/GetAllVouchers";
   let response = await fetch(url);
   let data = await response.json();
   data.forEach(element => {
     let voucherDiv = document.getElementById("container");
     voucherDiv.innerHTML += `
      <tr>
                <td>${element.code}</td>
                <td>${element.discountAmount}</td>
                <td>${element.expirationDate}</td>
                <td>${element.isActive}</td>
                <td><button class="btn btn-warning" onclick="editVoucherId(${element.id})"><a href="../Voucher/UpdateVoucher.html">Edit</a></button>
                <button class="btn btn-danger"  onclick="deleteVoucher(${element.id})">Delete</button>
                </td>
    </tr> 
     `
    
   });
}
ShowVoucher();

function editVoucherId(id) {
    localStorage.setItem("voucherId", id);
}

async function deleteVoucher(id) {
    const url = `https://localhost:44381/api/Admin/DeletVoucher/${id}`;
    let response = await fetch(url,
        {
            method : 'DELETE',            
            headers : {
                'Content-Type' : 'application/json'
              } 
        }
    );
    alert("Voucher removed successfully");
    location.reload();
}