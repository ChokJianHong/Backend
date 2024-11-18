const db = require("../utils/database");
const admin = require("firebase-admin");

// Create Request Form Controller
async function createRequestForm(req, res) {
  console.log("Creating form", req.body);
  const { technician_name, customer_name, equipment, brand, parts_needed, order_id } = req.body;

  // Validate required fields
  if (!technician_name || !customer_name || !equipment || !brand || !parts_needed || !order_id) {
    return res.status(400).json({ message: "All fields including order_id are required" });
  }

  try {
    // Use string interpolation to build the query
    const createRequestFormQuery = `
            INSERT INTO request_forms (technician_name, customer_name, equipment, brand, parts_needed, status, order_id) 
            VALUES ('${technician_name}', '${customer_name}', '${equipment}', '${brand}', '${parts_needed}', 'pending', ${order_id})
        `;

    // Execute the query
    const result = await new Promise((resolve, reject) => {
      db.query(createRequestFormQuery, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    res.status(201).json({ message: 'Request Form submitted!', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to Submit Request Form' });
  }
}


// Update Request Form Status Controller
function updateRequestFormStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  // Validate status
  if (!status || !['complete', 'pending'].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  // Update request form status
  const updateRequestFormQuery = `
    UPDATE request_forms
    SET status = '${status}'
    WHERE id = '${id}'
  `;

  db.query(updateRequestFormQuery, (error, results) => {
    if (error) {
      return res.status(500).json({ message: "Database error", error });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Request form not found" });
    }

    // Check if the status is "completed" to update stockAmount
    if (status === 'complete') {
      // Query to reduce stock amount by 1 in inventory based on parts_needed in request_forms
      const reduceStockQuery = `
        UPDATE inventory 
        SET stockAmount = stockAmount - 1 
        WHERE name = (
          SELECT parts_needed FROM request_forms WHERE id = '${id}'
        ) AND stockAmount > 0;
      `;

      db.query(reduceStockQuery, (error, stockResults) => {
        if (error) {
          return res.status(500).json({ message: "Error updating stock amount", error });
        }
        // Check if stock was successfully reduced
        if (stockResults.affectedRows === 0) {
          return res.status(404).json({ message: "Stock not available or item not found in inventory" });
        }
        return res.status(200).json({ message: "Request form status updated and stock adjusted successfully" });
      });
    } else {
      // If the status is not "complete," just return success for the status update
      return res.status(200).json({ message: "Request form status updated successfully" });
    }
  });
}

// get technician forms
async function getRequestFormsByTechnician(req, res) {
  const { name } = req.params;

  // Validate the name parameter
  if (!name) {
    return res.status(400).json({ message: "Technician name is required" });
  }

  try {
    // Use string interpolation to build the query, using LIKE for partial matching
    const getRequestFormsByTechnicianQuery = `
      SELECT * FROM request_forms 
      WHERE technician_name LIKE '%${name}%'
    `;

    // Execute the query
    const result = await new Promise((resolve, reject) => {
      db.query(getRequestFormsByTechnicianQuery, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    if (result.length === 0) {
      return res.status(404).json({ message: "No request forms found for this technician" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve request forms" });
  }
}
// Get All Request Forms Controller
function getAllRequestForms(req, res) {
  console.log("Getting alll form ============")
  // Use string interpolation for the query
  const getAllRequestFormsQuery = "SELECT * FROM request_forms";

  // Execute the query
  db.query(getAllRequestFormsQuery, (error, rows) => {
    if (error) {
      return res.status(500).json({ message: "Database error", error });
    }
    return res.status(200).json(rows);
  });
}
// Delete Request Form Controller
function deleteRequestForm(req, res) {
  const { id } = req.params;

  // Use string interpolation to build the query
  const deleteRequestFormQuery = `
        DELETE FROM request_forms
        WHERE id = '${id}'
    `;

  // Execute the query
  db.query(deleteRequestFormQuery, (error, results) => {
    if (error) {
      return res.status(500).json({ message: "Database error", error });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Request form not found" });
    }
    return res.status(200).json({ message: "Request form deleted successfully" });
  });
}




function getRequestFormById(req, res) {
  const { id } = req.params;

  // Use string interpolation to build the query
  const getRequestFormByIdQuery = `
        SELECT * FROM request_forms
        WHERE id = '${id}'
    `;

  // Execute the query
  db.query(getRequestFormByIdQuery, (error, results) => {
    if (error) {
      return res.status(500).json({ message: "Database error", error });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Request form not found" });
    }
    return res.status(200).json(results[0]);
  });
}

// Track the order status and update technician's status
function trackOrderStatus(req, res) {
  // Get the technicianId and orderId from the request parameters
  const technicianId = req.params.technicianId;
  const orderId = req.params.orderId;

  console.log('Received technicianId:', technicianId);
  console.log('Received orderId:', orderId);

  // Query to check the request form status and request_time
  const query = `
    SELECT status, request_time 
    FROM request_forms 
    WHERE order_id = ${orderId};  // Direct interpolation
  `;
  
  // Execute the query
  connection.execute(query, (err, results) => {
    if (err) {
      console.error('Error executing database query:', err);
      return res.status(500).json({ error: 'Database query error' });
    }

    // Check if the order was found
    if (results.length > 0) {
      const orderStatus = results[0].status;
      const requestTime = results[0].request_time;
      const currentTime = new Date();

      // Check if the request status is pending and if 20 minutes have passed
      const timeDifference = (currentTime - new Date(requestTime)) / (1000 * 60); // Time difference in minutes

      if (orderStatus === 'pending' && timeDifference >= 20) {
        // Change technician status to 'free' if 20 minutes have passed and status is still 'pending'
        const updateQuery = `
          UPDATE technicians 
          SET status = 'free' 
          WHERE technician_id = ${technicianId};  // Direct interpolation
        `;

        connection.execute(updateQuery, (err, results) => {
          if (err) {
            console.error('Error updating technician status:', err);
            return res.status(500).json({ error: 'Failed to update technician status' });
          }
          console.log('Technician status updated to free');
          return res.status(200).json({ message: 'Technician status updated to free' });
        });
      } else if (orderStatus === 'complete' && timeDifference <= 20) {
        // Change technician status to 'working' if order status is complete within 20 minutes
        const updateQuery = `
          UPDATE technicians 
          SET status = 'working' 
          WHERE technician_id = ${technicianId};  
        `;

        connection.execute(updateQuery, (err, results) => {
          if (err) {
            console.error('Error updating technician status:', err);
            return res.status(500).json({ error: 'Failed to update technician status' });
          }
          console.log('Technician status updated to working');
          return res.status(200).json({ message: 'Technician status updated to working' });
        });
      } else {
        return res.status(200).json({ message: 'No status update needed' });
      }
    } else {
      console.error('Order not found');
      return res.status(404).json({ error: 'Order not found' });
    }
  });
}


function checkAvailability(req, res) {
  console.log("checkAvailability API hit");

  const { type } = req.user || {}; // Safely access req.user
  console.log("User type:", type);

  // Temporarily bypass admin check
  // if (type !== "admin") {
  //   console.log("Unauthorized access attempt. User type:", type);
  //   return res.status(401).json({ message: "Unauthorized" });
  // }

  const query = `
    SELECT 
  rf.parts_needed, 
  COALESCE(i.name, 'Not Found') AS inventory_name,
  COALESCE(i.stockAmount, 0) AS stockAmount,
  CASE 
    WHEN i.name IS NULL THEN 'Not Available'  -- If no matching part in inventory
    WHEN i.stockAmount > 0 THEN 'Available'   -- If stock > 0
    ELSE 'Not Available'                      -- If stock is 0 or less
  END AS availability
FROM 
  request_forms rf
LEFT JOIN 
  inventory i 
ON 
  LOWER(rf.parts_needed) = LOWER(i.name);  -- Ensure case-insensitive matching

  `;

  console.log("Executing query...");

  db.query(query, (err, rows) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: 'Database query error' });
    }

    console.log("Query results:", rows);

    if (rows.length === 0) {
      console.log("No matching parts found in inventory.");
      return res.status(404).json({ message: "No matching parts found in inventory" });
    }

    res.status(200).json(rows);
  });
}






module.exports = {
  createRequestForm,
  updateRequestFormStatus,
  getAllRequestForms,
  deleteRequestForm,
  getRequestFormById,
  getRequestFormsByTechnician,
  trackOrderStatus,
  checkAvailability,

};
