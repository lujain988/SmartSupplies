async function addCategory() {
    event.preventDefault(); // Prevent the form from submitting normally

    var form = document.getElementById("form");
    const url = "https://localhost:44381/api/Categories/AddCategories";
    var formData = new FormData(form);

    try {
        let response = await fetch(url, {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            alert('Category added successfully');
          
        } else {
            alert('Failed to add category');
        }
    } catch (error) {
        console.error('Error adding category:', error);
        alert('Error adding category');
    }
}
