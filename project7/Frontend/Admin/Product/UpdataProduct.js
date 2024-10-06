async function getAllCategory()
{
   
    let request= await fetch("https://localhost:44381/api/Categories/GetAllCategory");
    let data= await request.json();

    var CategoryId = document.getElementById("CategoryId");

    data.forEach(element => {
        
    CategoryId.innerHTML += `
    <option value="${element.id}">${element.categoryName}</option>

    `
    });

    
}
getAllCategory();




var x = localStorage.getItem("productId");
 let  url = `https://localhost:44381/api/Product/UpdateProduct/${x}`;

 var form = document.getElementById("form");
 async function updateProduct() {
     event.preventDefault();
     var formData = new FormData(form);
 
     var response = await fetch(url,{
        method: "PUT",
        body : formData 
     })
 
     alert("Product updated Successfully");
 
 
 }

 async function getproduct() {
    debugger;
    let Name = document.getElementById("productName");
    let Description = document.getElementById("description");
    let price = document.getElementById("price");
    let StockQuantity = document.getElementById("StockQuantity");
    let discount = document.getElementById("discount")

url = `https://localhost:44381/api/Product/${x}`
let response = await fetch(url);
let data = await response.json();
console.log(data);
Name.value = data.productName;
Description.value = data.description;
price.value = data.price;
StockQuantity.value = data.stockQuantity;
discount.value = data.discount;
}
getproduct()