document.addEventListener("DOMContentLoaded", function () {
  const baseURL = "http://localhost:5005/dashboarddatabase";

  function fetchCancelledRequestsHistory() {
    let url = `${baseURL}/orders/history/cancelled`;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in local storage");
      return;
    }
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.status === 401) {
          window.location.href = "unauthorize_response.html";
        }
        renderCancelledHistoryItems(data);
      })
      .catch((error) => {
        console.error("Error fetching requests history:", error);
      });
  }

  // create order
  function createOrderCard(item) {
    console.log("item is ", item);
    let completedonDate = new Date(item.order_done_date);
    let option = { year: 'numeric', month: '2-digit', day: '2-digit' };
    let completedonDateString = completedonDate.toLocaleDateString(undefined, option);

    const card = document.createElement("div");
    card.classList.add("card");

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = `#000${item.order_id}`;

    const technicianText = document.createElement("p");
    technicianText.classList.add("card-text");
    technicianText.innerHTML = `Technician: <span class="customer-name">${item.technician_name}</span>`;

    const completedDateText = document.createElement("p");
    completedDateText.classList.add("card-text");
    completedDateText.innerHTML = `Cancelled Date: <span class="completed-date">${completedonDateString}</span>`;

    const problemTypeText = document.createElement("p");
    problemTypeText.classList.add("card-text");
    problemTypeText.innerHTML = `Problem Type: <span class="problem-type">${item.problem_type}</span>`;

    const cancelDetailsText = document.createElement("p");
    cancelDetailsText.classList.add("card-text");
    cancelDetailsText.innerHTML = `Cancel Details: <span class="cancel-details">${item.cancel_details}</span>`;

    const totalPriceText = document.createElement("p");
    totalPriceText.classList.add("card-text");
    totalPriceText.innerHTML = `Total Price: <span class="total-price">${item.total_price}</span>`;

    const viewDetailsBtn = document.createElement("a");
    viewDetailsBtn.classList.add("btn", "btn-primary", "view-details-btn", "ml-auto");
    viewDetailsBtn.textContent = "View Details";
    viewDetailsBtn.href = "view_history_detail.html?id=" + item.order_id;

    cardBody.appendChild(cardTitle);
    // cardBody.appendChild(technicianText);
    cardBody.appendChild(completedDateText);
    cardBody.appendChild(problemTypeText);
    cardBody.appendChild(cancelDetailsText);
    //cardBody.appendChild(totalPriceText);
    // cardBody.appendChild(viewDetailsBtn);

    card.appendChild(cardBody);

    return card;
  }

  function renderCancelledHistoryItems(data) {
    const historyData = data.result;
    const cardItems = document.getElementById("cancelledhistoryItem");
    cardItems.innerHTML = "";
    if (historyData.length === 0) {
      cardItems.innerHTML = `<h3>No history found</h3>`;
    }

    historyData.forEach((item) => {
      cardItems.appendChild(createOrderCard(item));
    });
  }

  const logout = document.getElementById("logout");
  logout.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });

  fetchCancelledRequestsHistory();

});
