// Variables to handle pagination
let currentPage = 1;
const itemsPerPage = 5;
let productId = 1; // Default or replace with dynamic value

// Fetch reviews for the given productId
async function fetchReviews(productId) {
  const url = `https://localhost:44381/GetAllReview?productId=${productId}`; // Ensure endpoint supports filtering by productId
  try {
    const response = await fetch(url);
    const reviews = await response.json();
    
    console.log(reviews); // Check the fetched data
    
    displayPaginatedReviews(reviews, currentPage, itemsPerPage);
    setupPagination(reviews, itemsPerPage);
  } catch (error) {
    console.error('Error fetching reviews:', error);
  }
}

// Function to display paginated reviews
function displayPaginatedReviews(reviews, page, itemsPerPage) {
  const reviewContainer = document.getElementById('container');
  reviewContainer.innerHTML = '';  // Clear the current items

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedItems = reviews.slice(start, end);

  paginatedItems.forEach(review => {
    let actionButtons = '';

    // Add buttons for approval if status is not approved
    if (review.status !== 'Approved' && review.status !== 'Declined') {
      actionButtons += `
        <button class="btn btn-success" onclick="approveReview(${review.id})">Approve</button>
        <button class="btn btn-secondary" onclick="declineReview(${review.id})">Decline</button>
      `;
    }
    
    // Add the delete button last
    actionButtons += `
      <button class="btn btn-danger" onclick="deleteReview(${review.id})">Delete</button>
    `;

    // Add table row with conditional buttons
    reviewContainer.innerHTML += `
      <tr>
        <td>${review.user}</td>
        <td>${review.productName}</td>
        <td>${review.categoryName}</td>
        <td>${review.comment}</td>
        <td>${review.status}</td>
        <td>
          ${actionButtons}
        </td>
      </tr>
    `;
  });
}

// Function to set up pagination controls
function setupPagination(items, itemsPerPage) {
  const paginationContainer = document.getElementById('pagination-container');
  paginationContainer.innerHTML = '';  // Clear current pagination

  const pageCount = Math.ceil(items.length / itemsPerPage);
  
  for (let i = 1; i <= pageCount; i++) {
    paginationContainer.innerHTML += `<button class="btn btn-secondary mx-1" onclick="changePage(${i})">${i}</button>`;
  }
}

// Function to handle page changes
function changePage(pageNumber) {
  currentPage = pageNumber;
  fetchReviews(productId);  // Re-fetch and display items for the new page
}

fetchReviews(productId);

function getCategoryId(categoryId) {
  localStorage.setItem('categoryid', categoryId);
  window.location.href = 'UpdataCategory.html';
}
async function deleteReview(reviewId) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch(`https://localhost:44381/api/Product/${reviewId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          Swal.fire('Deleted!', 'Review has been deleted.', 'success');
          fetchReviews(productId);
        } else {
          Swal.fire('Error!', 'Failed to delete review.', 'error');
        }
      } catch (error) {
        console.error('Error deleting review:', error);
        Swal.fire('Error!', 'Error deleting review.', 'error');
      }
    }
  });
}

async function approveReview(reviewId) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You want to approve this review?",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, approve it!'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch(`https://localhost:44381/Admin/${reviewId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'Approved',
          }),
        });

        if (response.ok) {
          Swal.fire('Approved!', 'Review has been approved.', 'success');
          fetchReviews(productId);
        } else {
          Swal.fire('Error!', 'Failed to approve review.', 'error');
        }
      } catch (error) {
        console.error('Error approving review:', error);
        Swal.fire('Error!', 'Error approving review.', 'error');
      }
    }
  });
}

async function declineReview(reviewId) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You want to decline this review?",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, decline it!'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch(`https://localhost:44381/Admin/${reviewId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'Declined',
          }),
        });

        if (response.ok) {
          Swal.fire('Declined!', 'Review has been declined.', 'success');
          fetchReviews(productId);
        } else {
          Swal.fire('Error!', 'Failed to decline review.', 'error');
        }
      } catch (error) {
        console.error('Error declining review:', error);
        Swal.fire('Error!', 'Error declining review.', 'error');
      }
    }
  });
}
