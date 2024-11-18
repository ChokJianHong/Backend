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
        document.getElementById("technician_name").innerText =
          data.technician_name;
        document.getElementById(
          "customer_name"
        ).innerText = `Customer Name: ${data.customer_name}`;
        document.getElementById(
          "customer_email"
        ).innerText = `Email: ${data.customer_email}`;
        document.getElementById(
          "customer_phone"
        ).innerText = `Phone: ${data.customer_phone_number}`;
        document.getElementById("order_date").innerText = `Date of Request: ${
          data.order_date.split("T")[0]
        }`;
        document.getElementById("technician_location").innerText =
          data.technician_location;

        document.getElementById("problem_type").innerText =
          data.problem_type[0].toUpperCase() + data.problem_type.substring(1);
        
        // Convert the time strings to Date objects by adding a fixed date (e.g., "1970-01-01")
        const startTime = new Date(`1970-01-01T${data.technician_start_time}`);
        const stopTime = new Date(`1970-01-01T${data.technician_stop_time}`);

        // Calculate the difference in milliseconds
        const timeDifferenceInMillis = stopTime - startTime;

        // Convert milliseconds to hours and minutes
        const hours = Math.floor(timeDifferenceInMillis / (1000 * 60 * 60)); // Convert to hours
        const minutes = Math.floor((timeDifferenceInMillis % (1000 * 60 * 60)) / (1000 * 60)); // Convert remaining to minutes

        document.getElementById("working_time").innerText =
          `${hours} hours and ${minutes} minutes`;


        document.getElementById("total_price").innerText = data.total_price;

        document.getElementById("spare_parts").innerText = data.requested_spare_part;

        document.getElementById("technician_email").innerText =
          data.technician_email;

        document.getElementById(
          "order_done_date"
        ).innerText = `Date of Completion: ${
          data.order_done_date.split("T")[0]
        }`;

        document.getElementById(
          "company_name"
        ).innerText = `${data.technician_name}`;
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  window.downloadPDF = function () {
    const billingContent = document.getElementById("billing-content");
    const options = {
      margin: 1,
      filename: `Invoice_${orderId}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(options).from(billingContent).save();
  };


  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get("id");
  fetchData(orderId);
});

