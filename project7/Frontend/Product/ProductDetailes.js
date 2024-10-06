async function getAllProduct() {
  const productId = localStorage.getItem("products");
  const url = `https://localhost:44381/api/Product/${productId}`;

  try {
    let request = await fetch(url);
    let data = await request.json();
    let cards = document.getElementById("productCard");

    let priceHTML = "";
    if (data.discount && data.discount > 0) {
      let discountedPrice = data.price - data.price * (data.discount / 100);
      priceHTML = `
           <p class="product-price" style="color: red; ">
    <span style="text-decoration: line-through; font-size: 1.5rem">${
      data.price
    }$</span> 
    <span style="font-size: 1.3rem; color: black !important;">${discountedPrice.toFixed(
      2
    )}$ </span>
    <span style="font-size: 1.3rem;"  class="discount-badge" > ${
      data.discount
    }% off</span>
</p>

            `;
    } else {
      priceHTML = `<p class="product-price">${data.price}$</p>`;
    }

    cards.innerHTML = `
    <div class="col-md-5">
        <div class="single-product-img">
            <img src="../Uploads/${data.image}" alt="${data.productName}">
        </div>
    </div>
    <div class="col-md-7">
        <div class="single-product-content">
            <h3>${data.productName}</h3>
            ${priceHTML} <!-- Display discount or regular price here -->
            <p>${data.description}</p>
            <div class="product-rating" id="rating-${data.id}">
                <!-- Rating will be inserted here -->
            </div>
            <div class="single-product-form">
                <form>
                    <input type="number" id="quantity" value="1">
                </form>
                <a  class="cart-btn" onclick="addToCart(${data.id}, '${data.productName}', ${data.price}, ${data.discount})">
                  <i class="fas fa-shopping-cart"></i> Add to Cart
                </a>
                <p><strong>Category: ${data.categoryName}</strong></p>
            </div>
            <h4>Share:</h4>
            <ul class="product-share">
                <li><a href="#" onclick="shareToFacebook(${data.id})"><i class="fab fa-facebook-f"></i></a></li>
                <!-- Add other share buttons if needed -->
            </ul>
            <a href="Product.html" class="back-to-shopping" style="color: #ff8c00;">
              <i class="fas fa-arrow-left"></i> Back to Shopping
            </a>
        </div>
    </div>
  `;
  
  
    fetchAverageRating(data.id);
  } catch (error) {
    console.error("Error fetching product data:", error);
  }
}

async function fetchComments(productId) {
  let url = `https://localhost:44381/Reviews/${productId}`;

  try {
    let response = await fetch(url);
    if (!response.ok)
      throw new Error(`Failed to fetch comments: ${response.statusText}`);

    let comments = await response.json();

    // Ensure commentsSection exists
    let commentsSection = document.getElementById("commentsSection");
    if (!commentsSection) {
      console.error("Comments section element not found");
      return;
    }

    // Clear existing content
    commentsSection.innerHTML = "";

    // Create HTML content
    comments.forEach((comment) => {
      let cardHTML = `
          <div class="media-block">
    <div class="media-body">
        <div class="mar-btm">
<a href="#" class="user-link">${comment.user}</a>
        </div>
        <p>${comment.comment}</p>
        <div class="pad-ver">
          
        </div>
        <hr>
    </div>
</div>

            `;
      commentsSection.innerHTML += cardHTML;
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
}

fetchComments();

// Call fetchComments when the page loads
document.addEventListener("DOMContentLoaded", function () {
  const productId = localStorage.getItem("products");
  if (productId) {
    fetchComments(productId);
  }
});

function shareToFacebook(productId) {
  const url = `https://localhost:44381/api/Product/${productId}`;
  const facebookShareURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    url
  )}`;
  window.open(
    facebookShareURL,
    "facebook-share-dialog",
    "width=800,height=600"
  );
}

async function fetchAverageRating(productId) {
  let url = `https://localhost:44381/api/Product/average-rating/${productId}`;
  let response = await fetch(url);
  let data = await response.json();

  let averageRating =
    data && data.averageRating != null ? data.averageRating : 5;
  let ratingContainer = document.getElementById(`rating-${productId}`);
  ratingContainer.innerHTML = `<i class="fas fa-star"> Rating: ${averageRating.toFixed(
    2
  )}</i>`;
}

const ratingInputs = document.getElementsByName("rate");

ratingInputs.forEach((star) => {
  star.addEventListener("click", async function () {
    const rating = this.value;
    // const userId = 6; // Example user ID
    const userId = localStorage.getItem('UserId'); 
    const productId = localStorage.getItem("products");
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      // Display a SweetAlert error if the user is not logged in
      Swal.fire({
        title: 'You are not logged in',
        text: 'You must have an account to make a review .',
        icon: 'warning',
        confirmButtonText: 'Login',
        showCancelButton: true,
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          // Redirect to the login page if the user clicks the 'Login' button
          window.location.href = "../login.html";
        }
      });
  
      return;
    }

    // Prepare the data to be sent for rating
    const ratingData = {
      productId: productId,
      userId: userId,
      rating: rating,
    };

    try {
      const response = await fetch("https://localhost:44381/SubmitReview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify(ratingData),
      });

      // Check the response status
      if (response.ok) {
        const responseData = await response.json();
        console.log("Rating submitted successfully", responseData);
      
        // SweetAlert2 success message
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Your rating has been submitted!',
          confirmButtonText: 'OK'
        });
      } else {
        console.error("Failed to submit rating", response.statusText);
      
        // SweetAlert2 error message
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: 'You have already rated this product.',
          confirmButtonText: 'OK'
        });
      }}
       catch (error) {
      console.error("Error submitting rating", error);
    }
  });
});

document
  .getElementById("submitComment")
  .addEventListener("click", async function () {
    const commentInput = document.getElementById("comment");
    const comment = commentInput.value;
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      // Display a SweetAlert error if the user is not logged in
      Swal.fire({
        title: 'You are not logged in',
        text: 'You must have an account to make a comment.',
        icon: 'warning',
        confirmButtonText: 'Login',
        showCancelButton: true,
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          // Redirect to the login page if the user clicks the 'Login' button
          window.location.href = "../login.html";
        }
      });
  
      return;
    }

    const userId = localStorage.getItem('UserId'); 
    // const userId = localStorage.getItem('UserId'); // this for logged in user
    const productId = localStorage.getItem("products");

    const commentData = {
      productId: productId,
      userId: userId,
      comment: comment,
    };

    try {
      const response = await fetch("https://localhost:44381/api/Product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(commentData),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Comment submitted successfully", responseData);
      
        // Clear the comment input field
        commentInput.value = "";
      
        // SweetAlert2 success message
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Your comment has been shared!',
          confirmButtonText: 'OK'
        });
      } else {
        console.error("Failed to submit comment", response.statusText);
      
        // SweetAlert2 error message
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to submit comment. Please try again.',
          confirmButtonText: 'OK'
        });
      }
      
    } catch (error) {
      console.error("Error submitting comment", error);
    }
  });

getAllProduct();
async function addToCart(productId, productName, productPrice, discount, image) {
  let quantity = document.getElementById('quantity').value || 1;

  // Calculate the discounted price if available
  let finalPrice = productPrice;
  if (discount && discount > 0) {
    finalPrice = productPrice - (productPrice * discount / 100);
  }

  const userId = localStorage.getItem('UserId');

  // Prepare the cart item
  const cartItem = {
    id: productId,
    userId: userId || null,  // Use null if not logged in
    quantity: parseInt(quantity),
    productName: productName,
    price: finalPrice,
    image: image
  };

  // URL for API request
  const url = "https://localhost:44381/api/Cart";

  if (userId) {
    // If user is logged in, send request to the server
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          userId: userId,
          productId: productId,
          quantity: cartItem.quantity
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log('Item added to cart on server:', await response.json());
      } else {
        console.error('Failed to add item to cart on server:', await response.text());
      }
    } catch (error) {
      console.error('An error occurred while adding item to cart on server:', error);
    }
  } else {
    // If user is not logged in, store the cart item locally
    try {
      let existingCart = localStorage.getItem('cart');
      let cart = existingCart ? JSON.parse(existingCart) : [];

      // Check if the product already exists in the cart
      const itemIndex = cart.findIndex(item => item.id === productId);

      if (itemIndex !== -1) {
        // If the product exists, update its quantity
        cart[itemIndex].quantity += cartItem.quantity;
      } else {
        // If the product doesn't exist, add it to the cart
        cart.push(cartItem);
      }

      // Save the updated cart back to localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('An error occurred while updating local cart:', error);
    }
  }

  // Provide feedback to the user
  Swal.fire({
    icon: 'success',
    title: 'Added to Cart',
    text: `${productName} has been added to the cart.`,
    confirmButtonText: 'OK'
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "../Cart/Cart.html";
    }
  });
  
}
