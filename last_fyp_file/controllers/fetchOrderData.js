const fs = require('fs'); // File System module for file operations
const path = require('path'); // Path module to handle file paths
const db = require('../utils/database'); // Import your database connection
const cron = require('node-cron'); // Scheduler library

// Function to fetch data from the database and save it to a file
function fetchOrderData(req, res = null) {
  const fetchDataQuery = "SELECT order_time FROM ordertable;";

  // Execute the query
  db.query(fetchDataQuery, (error, rows) => {
    if (error) {
      console.error("Error retrieving order data:", error);
      if (res) {
        return res.status(500).json({ message: "Internal Server Error", status: 500 });
      }
      return;
    }

    // Handle empty result
    if (!rows || rows.length === 0) {
      console.warn("No data fetched from the database.");
      if (res) {
        return res.status(200).json({
          message: "No data available",
          data: [],
          status: 200,
        });
      }
      return;
    }

    // Log fetched rows
    console.log("Fetched rows:", rows);

    // Save data to test_input.json
    try {
      const filePath = path.resolve(__dirname, 'test_input.json');
      console.log(`Saving data to: ${filePath}`);
      fs.writeFileSync(filePath, JSON.stringify(rows, null, 2));
      console.log("Data successfully saved to test_input.json");

      if (res) {
        return res.status(200).json({
          message: "Data fetched and saved successfully",
          data: rows,
          status: 200,
        });
      }
    } catch (writeError) {
      console.error("Error writing to test_input.json:", writeError);
      if (res) {
        return res.status(500).json({ message: "Failed to save data to file", status: 500 });
      }
    }
  });
}

// Schedule the task to run every two weeks
cron.schedule('0 0 * * 0/14', () => {
  console.log("Running scheduled task to fetch and update order data...");
  fetchOrderData();
});

module.exports = { fetchOrderData };

// Test the function directly if needed
if (require.main === module) {
  const mockResponse = {
    status: (statusCode) => ({
      json: (data) => console.log(`Response [${statusCode}]:`, JSON.stringify(data, null, 2)),
    }),
  };

  fetchOrderData({}, mockResponse);
}
