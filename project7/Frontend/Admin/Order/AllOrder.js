async function Allorders() {
    const url = "https://localhost:44381/AllOrders";
    let response = await fetch(url);
    let data = await response.json();
    data.forEach(element => {
        let Orders = document.getElementById("getorder");
        Orders.innerHTML += `
          <tr>
                    <td>${element.username}</td>
                    <td>${element.email}</td>
                    <td>${element.status}</td>
                    <td>${element.totalAmount}</td>
                    <td>${element.orderDate}</td>
        </tr> 
         `
        });
    
}
Allorders();