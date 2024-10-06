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


async function addProduct() {
    event.preventDefault(); // Prevent the form from submitting normally

    var form = document.getElementById("form");
    const url = "https://localhost:44381/api/Product/Addproductadmin";
    var formData = new FormData(form);

    try {
        let response = await fetch(url, {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            alert('product added successfully');
          
        } else {
            alert('Failed to add product');
        }
    } catch (error) {
        console.error('Error adding product:', error);
        alert('Error adding product');
    }
}
