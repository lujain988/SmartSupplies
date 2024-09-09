var x = localStorage.getItem("categoryid");
 const  url = `https://localhost:44381/api/Categories/UpdateCategory/${x}`;

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