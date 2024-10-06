var x = localStorage.getItem("categoryid");
 let  url = `https://localhost:44381/api/Categories/UpdateCategory/${x}`;

 var form = document.getElementById("form");
 async function updateCategory() {
     event.preventDefault();
     var formData = new FormData(form);
 
     var response = await fetch(url,{
        method: "PUT",
        body : formData 
     })
 
     alert("Category updated Successfully");
    }

async function getCat() {
    let Name = document.getElementById("Name");
    let Description = document.getElementById("Description");
url = `https://localhost:44381/api/Categories/GetCategoryById/${x}`
let response = await fetch(url);
let data = await response.json();
console.log(data);
Name.value = data.categoryName;
Description.value = data.description;
}
getCat()
