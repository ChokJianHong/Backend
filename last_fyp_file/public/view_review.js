document.addEventListener("DOMContentLoaded", () => {
    const baseUrl = "http://localhost:5005/dashboarddatabase";
  
    const logout = document.getElementById("logout");
    logout.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });
  
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "login.html";
    }
    const fetchData = (orderId) => {
      fetch(`${baseUrl}/orders/${orderId}/invoice`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((result) => {
          const data = result.result;
          console.log(data);
          document.getElementById(
            "customer-name"
          ).innerText = data.customer_name;
          document.getElementById(
            "customer-address"
          ).innerText = data.customer_address;
          if (data.rating == 1) {
            const ratingElements = document.getElementsByClassName("rating");
            if (ratingElements.length > 0) {
              ratingElements[0].innerHTML = `
                <span class="fa fa-star checked"></span>
                <span class="fa fa-star notChecked"></span>
                <span class="fa fa-star notChecked"></span>
                <span class="fa fa-star notChecked"></span>
                <span class="fa fa-star notChecked"></span>
              `;
            }
          }
          else if(data.rating == 2){
            const ratingElements = document.getElementsByClassName("rating");
            if (ratingElements.length > 0) {
              ratingElements[0].innerHTML = `
                <span class="fa fa-star checked"></span>
                <span class="fa fa-star checked"></span>
                <span class="fa fa-star notChecked"></span>
                <span class="fa fa-star notChecked"></span>
                <span class="fa fa-star notChecked"></span>
              `;
            }
          }
          else if(data.rating == 3){
            const ratingElements = document.getElementsByClassName("rating");
            if (ratingElements.length > 0) {
              ratingElements[0].innerHTML = `
                <span class="fa fa-star checked"></span>
                <span class="fa fa-star checked"></span>
                <span class="fa fa-star checked"></span>
                <span class="fa fa-star notChecked"></span>
                <span class="fa fa-star notChecked"></span>
              `;
            }
          }
          else if(data.rating == 4){
            const ratingElements = document.getElementsByClassName("rating");
            if (ratingElements.length > 0) {
              ratingElements[0].innerHTML = `
                <span class="fa fa-star checked"></span>
                <span class="fa fa-star checked"></span>
                <span class="fa fa-star checked"></span>
                <span class="fa fa-star checked"></span>
                <span class="fa fa-star notChecked"></span>
              `;
            }
          }
          else if(data.rating == 5){
            const ratingElements = document.getElementsByClassName("rating");
            if (ratingElements.length > 0) {
              ratingElements[0].innerHTML = `
                <span class="fa fa-star checked"></span>
                <span class="fa fa-star checked"></span>
                <span class="fa fa-star checked"></span>
                <span class="fa fa-star checked"></span>
                <span class="fa fa-star checked"></span>
              `;
            }
          }

          document.getElementById(
            "review-text"
          ).innerText = data.review_text;
          const reviewDateElement = document.getElementById("review-date");
          reviewDateElement.innerText = formatDate(data.review_date);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };
  
    const formatDate = (isoString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(isoString);
        return date.toLocaleDateString(undefined, options);
    };

    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get("id");
    fetchData(orderId);
  });