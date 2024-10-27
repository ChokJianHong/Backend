document.addEventListener("DOMContentLoaded", function () {
  const logout = document.getElementById("logout");
  logout.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });

  const baseURL = "http://localhost:5005/dashboarddatabase";
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const requestId = urlParams.get("id");

  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  fetch(`${baseURL}/orders/${requestId}/request-detail`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 404) {
        console.error("Request not found");
      } else if (data.status === 200) {
        const result = data.result;
        renderDetail(result);
      } else {
        console.error("Error fetching request details:", data.message);
      }
    })
    .catch((error) => console.error("Error fetching request details:", error));
});

function renderDetail(data) {
  const historyDetail = document.getElementById("historyDetail");

  // Convert the ETA date to a local date string
  let etaDate = new Date(data.technician.eta);
  let options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  let etaDateString = etaDate.toLocaleDateString(undefined, options);

  let completedonDate = new Date(data.orderDoneDate);
  let option = { year: 'numeric', month: '2-digit', day: '2-digit' };
  let completedonDateString = completedonDate.toLocaleDateString(undefined, option);

  historyDetail.innerHTML = `
    <h1>Requests Details</h1>
    <h3>No history found</h3>
    `;
  if (data) {
    if (data.rating == null){
    historyDetail.innerHTML = `
      <h1>Requests Details</h1> 
      <div class="row">
        <div class="col-md-6">
          <h4>Customer Information</h4>
          <p><strong>Name:</strong> <span class="customer-name">${data.customer.name}</span></p>
          <p><strong>Address:</strong> <span class="customer-address">${data.customer.address}</span></p>
          <p><strong>Email:</strong> <span class="customer-email">${data.customer.email}</span></p>
          <p><strong>Phone No:</strong> <span class="customer-email">${data.customer.phone}</span></p>
          <p><strong>Autogate Brand:</strong> <span class="autogate-brand">${data.customer.autogateBrand}</span></p>
          <p><strong>Autogate Warranty:</strong> <span class="customer-name">${data.customer.autogateWarranty}</span></p>
          <p><strong>Alarm Brand:</strong> <span class="autogate-brand">${data.customer.alarmBrand}</span></p>
          <p><strong>Alarm Warranty:</strong> <span class="customer-name">${data.customer.alarmWarranty}</span></p>
        </div>
        <div class="col-md-6">
          <h4>Request Information</h4>
          <p><strong>Service No.:</strong> <span class="service_no">#000${data.orderId}</span></p>
          <p><strong>Problem:</strong> <span class="problem">${data.problem}</span></p>
          <p><strong>Priority:</strong> <span class="priority">${data.priority}</span></p>
          <p><strong>Completed on:</strong> <span class="datetime">${completedonDateString}</span></p>
          <p><strong>Status:</strong> <span class="status">${data.orderStatus}</span></p>
        </div>
      </div>
      <hr>
      <div class="row">
        <div class="col-md-6">
          <h4>Technician Information</h4>
          <p><strong>Name:</strong> <span class="technician-name">${data.technician.name}</span></p>
          <p><strong>Estimated Time of Arrival:</strong> <span class="ETA">${etaDateString}</span></p>
          <p><strong>Contact Number:</strong> <span class="technician-phone">${data.technician.contactNumber}</span></p>
          <p><strong>Start Time:</strong> <span class="technician-startTime">${data.technician.startTime}</span></p>
          <p><strong>End Time:</strong> <span class="technician-endTime">${data.technician.endTime}</span></p>
        </div>
        <div class="col-md-6">
          <h4>Payment Information</h4>
          <p><strong>Total:</strong> <span class="total">${data.totalPrice}</span></p>
        </div>
      </div>
      <hr>
      <div class="row">
        <div class="col-md-12">
          <h4>Problem Details</h4>
          <p>${data.orderDetail}</p>
        </div>
      </div>
      <hr>
      <h4>Images</h4>
      <div class="row">
        <div class="col-md-6">
          <h5>Problem Image</h5>
          <img src="${data.orderImage}" class="img-fluid" alt="Problem Image">
        </div>
        <div class="col-md-6">
          <h5>Image After Fixing</h5>
          <img src="${data.orderDoneImage}" class="img-fluid" alt="Image After Fixing">
        </div>
      </div>
      <div class="row mt-4">
        <div class="col-md-12 text-center">
          <a href="billing.html?id=${data.orderId}" ><button class="cancelbtn2">View Bill</button></a> 
        </div>
      </div>
      `;
    }
    else{
      historyDetail.innerHTML = `
      <h1>Requests Details</h1> 
      <div class="row">
        <div class="col-md-6">
          <h4>Customer Information</h4>
          <p><strong>Name:</strong> <span class="customer-name">${data.customer.name}</span></p>
          <p><strong>Address:</strong> <span class="customer-address">${data.customer.address}</span></p>
          <p><strong>Email:</strong> <span class="customer-email">${data.customer.email}</span></p>
          <p><strong>Phone No:</strong> <span class="customer-email">${data.customer.phone}</span></p>
          <p><strong>Autogate Brand:</strong> <span class="autogate-brand">${data.customer.autogateBrand}</span></p>
          <p><strong>Autogate Warranty:</strong> <span class="customer-name">${data.customer.warranty}</span></p>
          <p><strong>Alarm Brand:</strong> <span class="autogate-brand">${data.customer.alarmBrand}</span></p>
          <p><strong>Alarm Warranty:</strong> <span class="customer-name">${data.customer.warranty}</span></p>
        </div>
        <div class="col-md-6">
          <h4>Request Information</h4>
          <p><strong>Service No.:</strong> <span class="service_no">#000${data.orderId}</span></p>
          <p><strong>Problem:</strong> <span class="problem">${data.problem}</span></p>
          <p><strong>Priority:</strong> <span class="priority">${data.priority}</span></p>
          <p><strong>Completed on:</strong> <span class="datetime">${completedonDateString}</span></p>
          <p><strong>Status:</strong> <span class="status">${data.orderStatus}</span></p>
        </div>
      </div>
      <hr>
      <div class="row">
        <div class="col-md-6">
          <h4>Technician Information</h4>
          <p><strong>Name:</strong> <span class="technician-name">${data.technician.name}</span></p>
          <p><strong>Estimated Time of Arrival:</strong> <span class="ETA">${etaDateString}</span></p>
          <p><strong>Contact Number:</strong> <span class="technician-phone">${data.technician.contactNumber}</span></p>
        </div>
        <div class="col-md-6">
          <h4>Payment Information</h4>
          <p><strong>Total:</strong> <span class="total">${data.totalPrice}</span></p>
        </div>
      </div>
      <hr>
      <div class="row">
        <div class="col-md-12">
          <h4>Problem Details</h4>
          <p>${data.orderDetail}</p>
        </div>
      </div>
      <hr>
      <h4>Images</h4>
      <div class="row">
        <div class="col-md-6">
          <h5>Problem Image</h5>
          <img src="${data.orderImage}" class="img-fluid" alt="Problem Image">
        </div>
        <div class="col-md-6">
          <h5>Image After Fixing</h5>
          <img src="${data.orderDoneImage}" class="img-fluid" alt="Image After Fixing">
        </div>
      </div>
      <div class="row mt-4">
        <div class="col-md-12 text-center">
          <a href="billing.html?id=${data.orderId}" ><button class="cancelbtn2">View Bill</button></a> 
        </div>
      </div>
      <div class="row mt-4">
        <div class="col-md-12 text-center">
          <a href="view_review.html?id=${data.orderId}" ><button class="cancelbtn3">View Review</button></a> 
        </div>
      </div>`;
    }
  }
}
