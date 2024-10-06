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
<button onclick="delet(${item.id})" style="background-color: red;">
    <i class="far fa-window-close"></i> Delete
</button>                                    
<button onclick="storeproductID(${item.id})">
    <i class="fas fa-edit"></i> Edit
</button>
                                    
                                    </td>
									<td class="product-image"><img src="../Uploads/${item.product.image}" alt="ddd"></td>
									<td class="product-name">${item.product.productName}</td>
									<td class="product-price">${item.product.price}</td>
									<td class="product-quantity"><input id="form${item.id}"  type="number"min=1 value="${item.quantity}" placeholder="0"onclick="storeproductID(${item.id})" ></td>
									<td class="product-total">${total}</td>
									
								</tr>

        `;
    });
    sum.innerHTML = "$" + totalSum.toFixed(2);
    totalprice.innerHTML = "$" + totalSum.toFixed(2);
  } else {
    var existingCart = localStorage.getItem("cart");
    var cart = JSON.parse(existingCart);

    console.log(cart);

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
									<td class="product-image"><img src="../Uploads/${item.image}" alt="ddd"></td>
									<td class="product-name">${item.productName}</td>
									<td class="product-price">${item.price}</td>
									<td class="product-quantity"><input id="form${item.id}"  type="number" value="${item.quantity}" placeholder="0" onchange="changeQuantityLocal(${item.id},'inc',${item.quantity})"  ></td>
									<td class="product-total">${total}</td>
									
								</tr>

        `;
    });
    sum.innerHTML = "$" + totalSum.toFixed(2);
    totalprice.innerHTML = "$" + totalSum.toFixed(2);
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

    localStorage.setItem("Totalprice", total);
  } else {
    document.getElementById("voucher").innerHTML = "Expired coupon";

    totalprice.innerHTML = "$" + totalSum.toFixed(2);

    // document.getElementById("totalprice").innerHTML =
    //   " No Discount Available";
    // location.reload();
  }
}

/////

function changeQuantityLocal(productId, action, data) {
  var x = document.getElementById(`form${productId}`).value;
  var existingCart = localStorage.getItem("cart");
  var cart = JSON.parse(existingCart);

  // Find the item in the cart by productId
  const itemIndex = cart.findIndex((item) => item.id === productId);

  if (itemIndex !== -1) {
    // Check if the quantity is less than 1
    if (x < 1) {
      // Show SweetAlert notification
      Swal.fire({
        icon: "error",
        title: "Invalid Quantity",
        text: "The quantity must be at least 1!",
      });

      // Reset the input field to 1 (minimum allowed)
      document.getElementById(`form${productId}`).value = 1;
      return; // Exit the function early
    }

    // Update the quantity based on the action
    if (action === "inc") {
      cart[itemIndex].quantity = x; // Set quantity to the input value
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

function gotocheck() {
  let user = localStorage.getItem("jwtToken");
  if (user == null || user == undefined) {
    Swal.fire({
      title: "You are not logged in",
      text: "You must have an account to continue.",
      icon: "warning",
      confirmButtonText: "Login",
      showCancelButton: true,
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // Redirect to the login page if the user clicks the 'Login' button
        window.location.href = "../login.html";
      }
    });

    return;
  } else {
    window.location.href = "../Order/checkout.html";
  }
}
function anything() {
  window.location.reload();
}

if (!window.location.hash) {
  window.location = window.location + '#loaded';
  window.location.reload();
}