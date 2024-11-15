document.addEventListener("DOMContentLoaded", function () {
  const baseURL = "http://localhost:5005/dashboarddatabase";

  async function fetchReviews() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found. Redirecting to login.");
      window.location.href = "/login.html";
      return;
    }

    const loadingSpinner = document.getElementById("loading-spinner");
    loadingSpinner.style.display = "block"; // Show the loading spinner

    try {
      const response = await fetch(`${baseURL}/orders/review`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching reviews: ${response.status}`);
      }

      const reviews = await response.json();
      displayReviews(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      loadingSpinner.style.display = "none"; // Hide the spinner
    }
  }

  function displayReviews(reviews) {
    const reviewContainer = document.getElementById("review-container");
    reviewContainer.innerHTML = ''; // Clear any previous reviews

    if (reviews.length === 0) {
      reviewContainer.innerHTML = "<p>No reviews available.</p>";
      return;
    }

    reviews.forEach((review) => {
      const reviewHtml = `
        <div class="col-md-6 offset-md-3">
          <div class="review-card">
            <p><strong>Technician:</strong> ${review.technician_name || 'N/A'}</p>
            <p><strong>Location:</strong> ${review.address || 'Address not provided'}</p>
            <p><strong>Rating:</strong> ${review.rating || 'No rating available'}</p>
            <p><strong>Review:</strong> ${review.review_text || 'No comments available'}</p>
            <p><strong>Date:</strong> ${review.review_date ? new Date(review.review_date).toLocaleDateString() : 'Date not available'}</p>
          </div>
        </div>
      `;
      reviewContainer.innerHTML += reviewHtml;
    });
  }

  function getStarRating(rating) {
    const filledStars = Math.floor(rating);
    const emptyStars = 5 - filledStars;
    return '★'.repeat(filledStars) + '☆'.repeat(emptyStars);
  }

  fetchReviews();
});
