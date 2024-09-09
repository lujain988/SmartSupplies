async function Getorder() {
    // let user = localStorage.getItem('Userid');
    let user = document.getElementById("searchuser").value;
    const url = `https://localhost:44381/api/Order/GetAllOrdersByUserEmail/${user}`;
    let response = await fetch(url);
    let data = await response.json();
    data.forEach(element => {
    let Orders = document.getElementById("getorder");
    Orders.innerHTML += `
      <tr>
                <td>${element.userOrderDTO.username}</td>
                <td>${element.productOrderDTO.productName}</td>
                <td>${element.productOrderDTO.price}</td>
                <td><select id="orderstatus-${element.id}"  class="form-control">
                        <option>-${element.status}-</option>
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                </select></td>
                <td>${element.quantity}</td>
                <td>${element.totalAmount}</td>
                <td>${element.vouchers.discountAmount}</td>
                <td>${element.orderDate}</td>
                <td><button class="btn btn-warning" onclick="editstatus(${element.id})">Edit</button></td>
    </tr> 
     `
    });
}
Getorder();

async function editstatus(id) {
    debugger
    const url =`https://localhost:44381/api/Admin/ChangOrderStatus/${id}`;
    let statusnew = document.getElementById(`orderstatus-${id}`).value;
    let data = {status : statusnew};
    let response = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    alert("Order Status updated successfully");
}