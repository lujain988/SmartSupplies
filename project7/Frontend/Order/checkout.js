async function ShowCartDelail() {
    debugger;
    let userid = localStorage.getItem("UserId");
    let url1 = `https://localhost:44381/api/Order/GetCart/${userid}`;
    let response = await fetch(url1);
    let data = await response.json();
    let cart = document.getElementById("showcart");
    let totalPrice = 0; // Initialize total price

    cart.innerHTML = ""; // Clear previous cart items if any
    
    data.forEach(element => {
        let itemTotal = element.quantity * element.productDTO.price;
        totalPrice += itemTotal; // Accumulate total price
        cart.innerHTML += `
            <tr>
                <td>${element.productDTO.productName}</td>
                <td>${itemTotal.toFixed(2)}</td>
            </tr>`;
    });

    // Store total price in localStorage
    // localStorage.setItem("TotalPrice", totalPrice.toFixed(2));
}

ShowCartDelail();


async function placeorder() {
    debugger
    //Add the address to the User in the database
    let url2 = "https://localhost:44381/api/Order/GetUserAddress";
    event.preventDefault();
    let form = document.getElementById("useraddressform");
    //check if username full all address
    let postalid = document.getElementById("postalid").value;
    let countryid = document.getElementById("countryid").value;
    let streetid = document.getElementById("streetid").value;
    let cityid = document.getElementById("cityid").value;
    if(postalid == "" | countryid == "" | streetid == "" | cityid == "") {
        alert("Please Enter The Full Address");
        return;
    }
    let formData = new FormData(form);
    formData.append("UserID", localStorage.getItem("UserId"));
   Swal.fire({
  icon: 'success',
  title: 'Success!',
  text: 'Address Saved Successfully',
  confirmButtonText: 'OK'
}).then((result) => {
  if (result.isConfirmed) {
    // Redirect to another page after confirmation
    window.location.href = "payment.html";
  }
});

    let response = await fetch(url2, {
        method : 'POST',
        body : formData
})

//Add New order using the user id
async function addorder() {
const url = "https://localhost:44381/api/Order/AddNewOrderByUserId";
let userid ={id:localStorage.getItem("UserId")} ;

let response = await fetch(url, {
    method : 'POST',
    body : JSON.stringify(userid) ,
    headers: {
        'Content-Type': 'application/json'
    }
})
}
addorder();

//store the order id in local storage
async function getlastorderid() {
    
    let userid =localStorage.getItem("UserId");
    const url = `https://localhost:44381/api/Order/GetLastOrderIdByUserId/${userid}`; 
    let response = await fetch(url);
    let data = await response.json();
    var orderid = data.id;
    localStorage.setItem("orderid", orderid);
}
getlastorderid();

// Add The payment to the order table in database using the order id and payment amount
async function payment() {
    debugger
let orderid = localStorage.getItem('orderid');
const url = `https://localhost:44381/api/Payment/AddToPaymentTableByOrderId/${orderid}`;
let price = localStorage.getItem('Totalprice');
let paymentamount ={paymentAmount : price};
let response = await fetch(url, {
    method : 'POST',
    body : JSON.stringify(paymentamount),
    headers: {
        'Content-Type': 'application/json'
    }
});
}
payment();

// window.location.href = "../index_2.html";
}
