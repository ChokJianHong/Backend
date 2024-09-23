document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("createReviewForm");

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const orderId = urlParams.get("id");
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      // Extract form data
      const rating = form.querySelector('input[name="rating"]:checked').value;
      const reviewText = form.reviewText.value;
     
  
      // Create JSON object to send to API
      const data = {
        rating: rating,
        reviewText: reviewText
      };
      
      console.log(data);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "login.html";
        }
        const response = await fetch(
          `http://localhost:5005/dashboarddatabase/orders/${orderId}`,
          {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
              "Authorization": `${token}`,
            },
          }
        );
        if (response.status === 401) {
          window.location.href = "login.html";
        }
        if (response.ok) {
          const responseData = await response.json();
          console.log("Review created successfully!", responseData);
          window.location.href = "customer_dashboard.html";
          return;
        } else {
          throw new Error("Failed to create review");
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          window.location.href = "login.html";
        }
        console.error("Error creating review:", error);
      }
    });
  
    const logout = document.getElementById("logout");
    logout.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });
  });