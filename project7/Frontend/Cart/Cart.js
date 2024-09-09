// localStorage.UserId = 0;
let id = localStorage.getItem("UserId");

const url = `https://localhost:44381/api/Cart/getallitems/${id}`;

async function GetAllData() {
  if (id > 0) {
    var response = await fetch(url);
    var result = await response.json();
    var table = document.getElementById("tbody");
    var sum = document.getElementById("sum");
    var totalSum = 0;
    result.forEach((item) => {
      const total = (item.quantity * item.product.price).toFixed(2);
      totalSum += parseFloat(total);

      table.innerHTML += `

      <tr class="table-body-row">
      
									<td class="product-remove">
<button onclick="delet(${item.id})">
    <i class="far fa-window-close"></i> Delete
</button>                                    
<button onclick="storeproductID(${item.id})">
    <i class="fas fa-edit"></i> Edit
</button>
                                    
                                    </td>
									<td class="product-image"><img src="${item.product.image}" alt="ddd"></td>
									<td class="product-name">${item.product.productName}</td>
									<td class="product-price">${item.product.price}</td>
									<td class="product-quantity"><input id="form${item.id}"  type="number"min=1 value="${item.quantity}" placeholder="0" ></td>
									<td class="product-total">${total}</td>
									
								</tr>

        `;
    });
    sum.innerHTML = "$" + totalSum.toFixed(2);
  } else {
    var existingCart = localStorage.getItem("cart");
    var cart = JSON.parse(existingCart);

    console.log(cart);

    debugger;
    var table = document.getElementById("tbody");
    var sum = document.getElementById("sum");
    var totalSum = 0;
    cart.forEach((item) => {
      const total = (item.quantity * item.price).toFixed(2);
      totalSum += parseFloat(total);

      table.innerHTML += `

      <tr class="table-body-row">
      
									<td class="product-remove">
                                    <button style="background-color: red;" onclick="removeCartItemLocal(${item.id})">
    <i class="far fa-window-close"></i> Delete
</button>
<button onclick="changeQuantityLocal(${item.id}, 'inc', ${item.quantity})">
    <i class="fas fa-edit"></i> Edit
</button>
                                    </td>
									<td class="product-image"><img src="${item.image}" alt="ddd"></td>
									<td class="product-name">${item.productName}</td>
									<td class="product-price">${item.price}</td>
									<td class="product-quantity"><input id="form${item.id}"  type="number"min=1 value="${item.quantity}" placeholder="0" onchange="changeQuantityLocal(${item.id},'inc',${item.quantity})"  ></td>
									<td class="product-total">${total}</td>
									
								</tr>

        `;
    });
    sum.innerHTML = "$" + totalSum.toFixed(2);
    totalprice.innerHTML = "$" +totalSum.toFixed(2);
   

  }
}
GetAllData();

async function delet(id) {
  const url1 = `https://localhost:44381/api/Cart/cartitem/deletitem/${id}`;

  var response = await fetch(url1, {
    method: "DELETE",
  });

  alert("product delete Successfully");
  location.reload();
}

debugger;
async function storeproductID(id) {
  const url1 = `https://localhost:44381/api/Cart/cartitem/updateitem/${id}`;

  let q = document.getElementById(`form${id}`).value;
  let data = {
    quantity: q,
  };

  var response = await fetch(url1, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  alert("product updated Successfully");
  location.reload();
}

async function voucher() {
  debugger;
  event.preventDefault();
  let copon = document.getElementById("copon").value;
  let url = `https://localhost:44381/api/Cart/copon/${copon}`;

  let response = await fetch(url);
  if (response.ok) {
    let request = await response.json();
    let discount = parseFloat(
      document.getElementById("sum").innerHTML.replace("$", "")
    );
    var total = discount - discount * request.discountAmount;
    document.getElementById("totalprice").innerHTML = "$" + total.toFixed(2);
    document.getElementById("voucher").innerHTML = "%" + request.discountAmount;
   localStorage.setItem("Totalprice",total);
    
  } else {
    document.getElementById("totalprice").innerHTML =
      " لا يوجد كوبون خصم امشي اطلع برا ";
    document.getElementById("voucher").innerHTML = "ماكو خصم ";
    //   location.reload();
  }
}

/////

function changeQuantityLocal(productId, action, data) {
  debugger;
  var x = document.getElementById(`form${productId}`).value;
  var existingCart = localStorage.getItem("cart");
  var cart = JSON.parse(existingCart);

  // Find the item in the cart by productId
  const itemIndex = cart.findIndex((item) => item.id === productId);

  if (itemIndex !== -1) {
    // Update the quantity based on the action
    if (action === "inc") {
      cart[itemIndex].quantity = x; // Increment quantity
    } else if (action === "dec") {
      cart[itemIndex].quantity -= 1; // Decrement quantity

      // Remove item if quantity reaches 0
      if (cart[itemIndex].quantity === 0) {
        cart.splice(itemIndex, 1); // Remove item from cart
      }
    }

    // Save the updated cart back to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.reload();
    // Optionally, refresh the cart UI
    GetCartItems(userID); // Refreshes the cart display to reflect the changes
  }
}

function removeCartItemLocal(productId) {
  var existingCart = localStorage.getItem("cart");
  var cart = JSON.parse(existingCart);
  debugger;
  // Find the item index by productId
  const itemIndex = cart.findIndex((item) => item.id === productId);

  if (itemIndex !== -1) {
    // Remove the item from the cart array
    cart.splice(itemIndex, 1);

    // Save the updated cart back to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Optionally, refresh the cart UI
    // GetCartItemslocal(); // Refresh the cart display to reflect the changes
    window.location.reload();

    // If the cart is empty, handle it (e.g., show an empty cart message)
    if (cart.length === 0) {
      document.getElementById("cart-items-container").innerHTML =
        "<p>Your cart is empty.</p>";
      document.getElementById("cart-subtotal").innerText = "$0.00";
      document.getElementById("order-total").innerText = "$15.00"; // Assuming shipping still applies
    }
  }
}




function gotocheck()
{
let user=localStorage.getItem("jwtToken");
if(user == null || user == undefined){
  window.location.href="../login.html";

}
else{
  window.location.href="../Order/checkout.html";

}


}