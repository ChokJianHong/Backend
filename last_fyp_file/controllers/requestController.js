const db = require("../utils/database");

// Create Request Form Controller
async function createRequestForm(req, res) {
  console.log("Creating form", req.body);
  const { technician_name, customer_name, equipment, brand, parts_needed, } = req.body;

  // Validate required fields
  if (!technician_name || !customer_name || !equipment || !brand || !parts_needed  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Use string interpolation to build the query
    const createRequestFormQuery = `
            INSERT INTO request_forms (technician_name, customer_name, equipment, brand, parts_needed, status) 
            VALUES ('${technician_name}', '${customer_name}', '${equipment}', '${brand}', '${parts_needed}', 'pending')
        `;

    // Execute the query
    const result = await new Promise((resolve, reject) => {
      db.query(createRequestFormQuery, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    res.status(201).json({ message: 'Request Form submitted !', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to Submit Request Forms' });
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
      return res.status(500).json({ message: "Database error", error });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Request form not found" });
    }
    return res.status(200).json({ message: "Request form status updated successfully" });
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


module.exports = {
  createRequestForm,
  updateRequestFormStatus,
  getAllRequestForms,
  deleteRequestForm,
  getRequestFormById,
  getRequestFormsByTechnician
};
