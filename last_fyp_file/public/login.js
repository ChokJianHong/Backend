document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("loginForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const loginForm = document.getElementById("loginForm");
    const errorMessage = document.getElementById("errorMessage");

    // Hide the error message initially
    errorMessage.style.display = "none";

    // Get form data
    const formData = new FormData(loginForm);
    const userType = formData.get("role");
    const email = formData.get("email");
    const password = formData.get("password");

    // Create a JavaScript object with login data
    const loginData = {
      email,
      password,
      userType,
    };

    // Convert object to JSON string
    const jsonData = JSON.stringify(loginData);

    fetch("http://localhost:5005/dashboarddatabase/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set the Content-Type header
      },
      body: jsonData, // Send the JSON data in the body
    })
      .then((response) => {
        if (!response.ok) {
          // If the response is not OK, handle it as a failed login
          return response.json().then((data) => {
            throw new Error(data.message || "Login failed.");
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data.token) {
          // Save token to local storage
          localStorage.setItem("token", data.token);

          // Determine redirect URL based on user role
          let redirectUrl = "";
          if (userType === "admin") {
            redirectUrl = "dashboard.html";
          } else if (userType === "customer") {
            redirectUrl = "customer_dashboard.html";
          } else if (userType === "technician") {
            redirectUrl = "technician_dashboard.html";
          }
          window.location.href = redirectUrl;
        }
      })
      .catch((error) => {
        // Display the error message
        errorMessage.textContent = error.message || "An error occurred during login.";
        errorMessage.style.display = "block";
        console.error("Login error:", error);
      });
  });
});
