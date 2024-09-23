// Fetch the technician's name from the localStorage token
const baseURL = "http://localhost:5005/dashboarddatabase/request"
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");  // Assuming the token is stored in localStorage
    if (token) {
        const decodedToken = parseJwt(token);
        document.getElementById("technician_name").value = decodedToken.email; // Add technician name to the form
    }
});

// Function to parse the JWT token
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Invalid token:", e);
        return null;
    }
}

// Handle form submission
document.getElementById('request_form_submit_button').addEventListener('click', async (event) => {
    event.preventDefault(); // Prevent default form submission
    const token = localStorage.getItem("token");  // Assuming the token is stored in localStorage

    const technicianName = document.getElementById("technician_name").value;
    const customerName = document.getElementById("customer").value;
    const equipment = document.getElementById("equipment").value;
    const brand = document.getElementById("brand").value;
    const partsNeeded = document.getElementById("parts").value;

    // Validate form fields
    if (!technicianName || !customerName || !equipment || !brand || !partsNeeded) {
        alert("All fields are required");
        return;
    }

    try {
        const response = await fetch(baseURL, { // Adjust the URL to match your API endpoint
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`, // Include token in Authorization header
            },
            body: JSON.stringify({
                technician_name: technicianName,
                customer_name: customerName,
                equipment: equipment,
                brand: brand,
                parts_needed: partsNeeded
            })
        });

        const data = await response.json();
        if (response.ok) {
            Swal.fire({
                title: 'Success!',
                text: 'Request Form submitted!',
                icon: 'success',
                confirmButtonText: 'Ok'
            });            // Clear the form fields after submission
            document.querySelector("form").reset();
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Failed!',
            text: 'Inventory item Updated successfully!',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    }
});
