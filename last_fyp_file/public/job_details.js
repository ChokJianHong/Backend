const baseURL = 'http://localhost:5005/dashboarddatabase';
const token = localStorage.getItem("token"); // Replace with your actual token

// Function to extract the 'id' from the URL
function getOrderIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

// Function to fetch and display job details
async function fetchJobDetails(orderId) {
  try {
    const response = await fetch(`${baseURL}/orders/${orderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`, // Include your token for authentication
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const job = data.result; // Access the job data

    // Get the job_details div
    const jobDetailsDiv = document.getElementById('job_details');

    // Create HTML for job details
    const jobHTML = `
      <div class="card">
        <div class="">
        <div class="text-center">
         <img src="${job.order_img ? job.order_img : 'No image available'}" alt="Order Image" class="img-fluid"/>
         <h5 class="card-title">Order #${job.order_id}</h5>
         <p><strong>Status:</strong> ${job.order_status}</p>
         <p><strong>Customer ID:</strong> ${job.customer_id}</p>
         <p><strong>Order Date:</strong> ${new Date(job.order_date).toLocaleDateString()}</p>
         <p><strong>Order Time:</strong> ${job.order_time}</p>
         <p><strong>Urgency Level:</strong> ${job.urgency_level}</p>
         <p><strong>Problem Type:</strong> ${job.problem_type}</p>
         <p><strong>Price Details:</strong> ${job.price_details ? job.price_details : "N/A"}</p>
         <p><strong>Total Price:</strong> £${job.total_price}</p>
         <p><strong>Location Details:</strong> ${job.location_details}</p>
         <p><strong>Cancel Details:</strong> ${job.cancel_details}</p>
         <p><strong>Technician ETA:</strong> ${job.technician_eta ? new Date(job.technician_eta).toLocaleDateString() : "N/A"}</p>
        </div>
        </div>
      </div>
    `;

    // Insert the HTML into the jobDetailsDiv
    jobDetailsDiv.innerHTML = jobHTML;
  } catch (error) {
    console.error('Error fetching job details:', error);
    document.getElementById('job_details').innerHTML = `<p>Error loading job details.</p>`;
  }
}

// Get the order ID from the URL and fetch job details
const orderId = getOrderIdFromURL();
if (orderId) {
  fetchJobDetails(orderId);
} else {
  document.getElementById('job_details').innerHTML = `<p>Order ID not found in URL.</p>`;
}
