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

  // Use string interpolation to build the query
  const updateRequestFormQuery = `
        UPDATE request_forms
        SET status = '${status}'
        WHERE id = '${id}'
    `;

  // Execute the query
  db.query(updateRequestFormQuery, (error, results) => {
    if (error) {
      console.error("Error updating status:", error);
      return res.status(500).json({ message: "Database error", status: 500 });
    }

    // Query for technician_id using the order_id
    const technicianIdQuery = `SELECT technician_id FROM ordertable WHERE order_id=${id}`;
    
    db.query(technicianIdQuery, (error, technicianResult) => {
      if (error || !technicianResult.length) {
        console.error("Error retrieving customer ID:", error);
        return res.status(500).json({ message: "Customer not found", status: 500 });
      }

      const technicianId = technicianResult[0].technician_id;

      // Query for FCM token using customer_id
      const tokenQuery = `SELECT fcm_token FROM technician WHERE technician_id=${technicianId}`;

      db.query(tokenQuery, (error, tokenResult) => {
        if (error || !tokenResult.length) {
          console.error("Error retrieving FCM token:", error);
          return res.status(500).json({ message: "Token not found", status: 500 });
        }

        const registrationToken = tokenResult[0].fcm_token;

        // Send FCM notification
        const sendNotification = async (registrationToken) => {
          const messageSend = {
            token: registrationToken,
            notification: {
              title: "Spare-Part Request Updated!",
              body: `Spare-part is available for Order: ${id}`
            },
            data: {
              key1: "value1",
              key2: "value2"
            },
            android: {
              priority: "high"
            },
            apns: {
              payload: {
                aps: {
                  badge: 42
                }
              }
            }
          };

          try {
            const response = await admin.messaging().send(messageSend);
            console.log("Successfully sent message:", response);
          } catch (error) {
            console.error("Error sending message:", error);
          }
        };

        // Call the sendNotification function with the retrieved token and technician name
        sendNotification(registrationToken);
        return res.status(200).json({ message: "Request form status updated successfully" });        
      });
    });
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

function trackOrderStatus(technicianId, orderId) {
  // Log the orderId to check its structure
  console.log('Order ID:', orderId);

  // Ensure orderId is a valid primitive (number or string), extract from object if necessary
  const orderIdValue = (orderId && orderId.id) ? orderId.id : orderId; // Extract from object if orderId is an object, else use directly

  // Log the final orderId being used in the query
  console.log('Using Order ID:', orderIdValue);

  // Check if orderIdValue is a valid primitive
  if (typeof orderIdValue !== 'string' && typeof orderIdValue !== 'number') {
    console.error('Invalid order ID type');
    return;
  }

  // Query to check the order status from the database
  const query = 'SELECT status FROM request_forms WHERE order_id = ?';

  // Execute the query
  db.query(query, [orderIdValue], (err, results) => {
    if (err) {
      console.error('Error executing initial query:', err);
      return;
    }

    // Check if the order exists and its status
    if (results.length > 0 && results[0].status === 'complete') {
      console.log('Order is complete, setting technician status to busy');

      // If the order is complete, update technician's status to 'busy'
      const updateQuery = 'UPDATE technicians SET status = ?, ongoing_order_id = ? WHERE technician_id = ?';
      db.query(updateQuery, ['busy', orderIdValue, technicianId], (updateErr, updateResults) => {
        if (updateErr) {
          console.error('Error updating technician status:', updateErr);
        } else {
          console.log(`Technician ${technicianId} status set to busy for order ${orderIdValue}`);
        }
      });
    } else {
      console.log('Order is not complete yet, technician status remains unchanged');
    }
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
};
