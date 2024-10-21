// inventory.js

document.addEventListener('DOMContentLoaded', function () {
  const apiUrl = 'http://localhost:5005/dashboarddatabase/inventory'; // Replace with your actual API URL

  const token = localStorage.getItem("token"); // Retrieve token from local storage
  const reqHeader = {
    "Content-Type": "application/json",
    Authorization: `${token}`, // Include token in Authorization header
  }

  // Function to fetch and display inventory items
  async function fetchInventoryItems() {
    try {
      if (!token) {
        console.error("No token found in local storage");
        return Promise.reject(new Error("No token found in local storage"));
      }
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: reqHeader,
      });
      const data = await response.json();
      console.log("data is ", data)
      const cardContainer = document.getElementById('inventory-card-container');
      cardContainer.innerHTML = '';  // Clear existing content
      data.forEach(item => {
        cardContainer.innerHTML += `
          <div class="card" style="width: 18rem; margin: 10px; border: 1px solid #ddd; border-radius: 5px; padding: 15px;">
            <img src="${item.image}" class="card-img-top" alt="${item.name}" style="width: 100%; height: auto;">
            <div class="">
              <h5 class="card-title">${item.name}</h5>
              <p class="card-text"><strong>Features:</strong> ${item.features}</p>
              <p class="card-text"><strong>Stock Amount:</strong> ${item.stockAmount}</p>
               <p class="card-text"><strong>Price:</strong> ${item.price}</p>
              <button class="btn btn-warning btn-sm" onclick="editItem(${item.id})">Edit</button>
              <button class="btn btn-danger btn-sm" onclick="deleteItem(${item.id})">Delete</button>
            </div>
          </div>
        `;
      });

    } catch (error) {
      console.error('Error fetching inventory items:', error);
    }
  }

  // Function to create a new inventory item
  async function createInventoryItem(event) {
    event.preventDefault();

    // Get form values
    const name = document.getElementById('name').value;
    const image = document.getElementById('image').value;
    const features = document.getElementById('features').value
    const stockAmount = document.getElementById('stockAmount').value
    const price = document.getElementById('price').value;

    try {
      console.log(name, image, features, stockAmount,price);

      // Send POST request to API
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: reqHeader,
        body: JSON.stringify({ name, image, features, stockAmount,price })
      });

      // Check if the request was successful
      if (response.ok) {
        document.querySelector('#name').value = '';
        document.querySelector('#image').value = '';
        document.querySelector('#features').value = '';
        document.querySelector('#stockAmount').value = ''; 
        document.querySelector('#price').value = '';

        // Show success popup or alert
        Swal.fire({
          title: 'Success!',
          text: 'Inventory item created successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        // Optionally, refresh the inventory list
        fetchInventoryItems();
      } else {
        throw new Error('Failed to create inventory item');
      }
    } catch (error) {
      console.error('Error creating inventory item:', error);
    }
  }


  // Function to handle the Edit button click
  window.editItem = async function (id) {
    // Find the item data based on the id (this assumes data is stored globally or in the DOM)
    fetch(`${apiUrl}/${id}`, {
      method: 'GET',
      headers: reqHeader
    })
      .then(response => response.json())
      .then(item => {
        // Populate the form with the item data
        document.getElementById('e_name').value = item.name;
        document.getElementById('e_image').value = item.image;
        document.getElementById('e_features').value = item.features
        document.getElementById('e_stockAmount').value = item.stockAmount;
        
        document.getElementById('e_price').value = item.price;
        document.getElementById('e_item_id').value = item.id; // Set hidden ID field

        // Scroll to the top of the page where the form is located
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.getElementById('e_card').style.backgroundColor = "#94a4866b"
        setTimeout(() => {
          document.getElementById('e_card').style.backgroundColor = "#fff"
        }, 3000);
      })
      .catch(error => console.error('Error fetching item data:', error));
  }


  document.getElementById('edit-item-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const id = document.getElementById('e_item_id').value;  // Get the item ID
    const name = document.getElementById('e_name').value;
    const image = document.getElementById('e_image').value;
    const features = document.getElementById('e_features').value.split(',').map(f => f.trim());
    const stockAmount = document.getElementById('e_stockAmount').value;
    const price = document.getElementById('e_price').value;

    try {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',  // Assuming the API expects a PUT request for updating
        headers: reqHeader,
        body: JSON.stringify({ name, image, features, stockAmount ,price})
      });

      if (response.ok) {

        document.getElementById('e_name').value = ""
        document.getElementById('e_image').value = ""
        document.getElementById('e_features').value = ""
        document.getElementById('e_stockAmount').value = ""
        document.getElementById('e_price').value = ""
        document.getElementById('e_item_id').value = "" // Set hidden ID field
        fetchInventoryItems();  // Refresh the list after updating
        Swal.fire({
          title: 'Success!',
          text: 'Inventory item Updated successfully!',
          icon: 'success',
          confirmButtonText: 'Ok'
        });
      } else {

        throw new Error('Failed to update inventory item');
      }
    } catch (error) {
      console.error('Error updating inventory item:', error);
    }
  });


  // Function to delete an inventory item
  window.deleteItem = async function (id) {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await fetch(`${apiUrl}/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        fetchInventoryItems();
        // Show success popup or alert
        Swal.fire({
          title: 'Success!',
          text: 'Inventory item Deleted successfully!',
          icon: 'success',
          confirmButtonText: 'Close'
        });
      } catch (error) {
        console.error('Error deleting inventory item:', error);
      }
    }
  }

  // Initialize
  document.getElementById('create-item-form').addEventListener('submit', createInventoryItem);
  fetchInventoryItems();



});
