const db = require("../utils/database");
const bcrypt = require('bcryptjs');
const { updateFCMToken } = require("./customerController");

function createTechnician(req, res) {
  const { type } = req.user;

  // Check if the user is an admin
  if (type !== "admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { email, name, password, specialization, phone_number, location } = req.body;

  // Check if technician already exists
  const isTechnicianExist = `SELECT * FROM technician WHERE email="${email}"`;

  db.query(isTechnicianExist, async (error, rows) => {
    if (error) {
      return res.status(500).json({ status: 500, message: "Internal Server Error" });
    }

    // If the technician already exists
    if (rows.length > 0) {
      return res.status(400).json({ message: "Email already exists", status: 400 });
    }

    try {
      // Hash the password using bcryptjs
      const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10

      // Insert the new technician into the database with the hashed password
      const createTechnicianQuery = `INSERT INTO technician (email, name, password, specialization, status, phone_number, location)
            VALUES ('${email}', '${name}', '${hashedPassword}', '${specialization}', 'free', '${phone_number}', '${location}')`;

      db.query(createTechnicianQuery, (error, rows) => {
        if (error) {
          return res.status(500).json({ status: 500, message: "Internal Server Error" });
        }

        return res.status(201).json({
          message: "Technician created successfully",
          result: rows[0],
          status: 201,
        });
      });

    } catch (err) {
      console.error("Error hashing the password:", err);
      return res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
  });
}


function getAllTechnicians(req, res) {
  const { type } = req.user;
  const { status } = req.query;

  if (type !== "admin") {
    return res.status(401).json({ message: "Unauthorized", status: 401 });
  }
  let dbQuery = `SELECT * FROM technician`;
  if (status === "free") {
    dbQuery += ` WHERE ongoing_order_id IS NULL`;
  }

  console.log('Generated Query: ', dbQuery);
  db.query(dbQuery, (error, rows) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).json({ message: "Error fetching technicians", status: 500 });
    }
    return res.status(200).json({ result: rows, status: 200 });
  });

}

function getTechnicianById(req, res) {
  const { type } = req.user;
  const technicianId = req.params.id;

  if (type !== "admin" && type !== "technician" && type !== "customer") {
    return res.status(401).json({ message: "Unauthorized", status: 401 });
  }
  const query = `SELECT * FROM technician WHERE technician_id = ${technicianId}`;
  db.query(query, (error, technician) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Error fetching technician", status: 500 });
    }

    return res.status(200).json({ technician: technician, status: 200 });
  });
}



function updateTechnician(req, res) {
  const { type } = req.user;
  const technicianId = req.params.id;
  const { name, specialization, phone_number, email, location } = req.body;

  if (type !== "admin") {
    return res.status(401).json({ message: "Unauthorized", status: 401 });
  }

  const updateQuery = `UPDATE technician SET location = '${location}' , name ='${name}' , email = '${email}' , specialization = '${specialization}', phone_number = '${phone_number}' WHERE technician_id = ${technicianId}`;
  db.query(updateQuery, (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: "Error updating technician" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Technician not found" });
    }

    return res
      .status(200)
      .json({ message: "Technician updated successfully", status: 200 });
  });
}

function deleteTechnician(req, res) {
  const { type } = req.user;
  const technicianId = req.params.id;

  if (type !== "admin") {
    return res.status(401).json({ message: "Unauthorized", status: 401 });
  }

  const deleteQuery = `DELETE FROM technician WHERE technician_id = ${technicianId}`;
  db.query(deleteQuery, (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: "Error deleting technician" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Technician not found" });
    }

    return res
      .status(200)
      .json({ message: "Technician deleted successfully", status: 200 });
  });
}

function getTechnicianByToken(req, res) {
  const token = req.headers.authorization.split(" ")[1]; // Extract token from authorization header

  if (!token) {
    return res.status(401).json({ message: "Unauthorized", status: 401 });
  }

  const getTechnicianQuery = `SELECT * FROM technician WHERE token = '${token}'`;
  db.query(getTechnicianQuery, (error, technician) => {
    if (error) {
      throw error;
    }

    if (technician.length === 0) {
      return res
        .status(404)
        .json({ message: "Technician not found", status: 404 });
    }

    return res.status(200).json({ status: 200, data: technician[0] });
  });
}

function sendLocation(req, res) {
  const { longitude, latitude } = req.body;
  const technicianId = req.params.id;  // Access technicianId from the URL parameter

  if (!longitude || !latitude) {
    return res.status(400).json({ error: 'longitude and latitude are required.' });
  }

  // Validate inputs to prevent SQL injection
  if (isNaN(longitude) || isNaN(latitude) || isNaN(technicianId)) {
    return res.status(400).json({ error: 'Invalid input. Longitude, latitude, and technicianId must be valid numbers.' });
  }

  // Using string interpolation (be careful with SQL injection)
  const getLocationQuery = `
    UPDATE technician 
    SET latitude = ${latitude}, longitude = ${longitude} 
    WHERE technician_id = ${technicianId}
  `;

  // Perform the database query
  db.query(getLocationQuery, (error, result) => {
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'An error occurred while saving the location.' });
    }

    // Respond with success
    return res.status(200).json({ message: 'Location saved successfully', data: result });
  });
}

async function updateTechnicianArrivalTime(req, res) {
  const { orderid } = req.params; // Get the order ID from URL parameters
  const { start_time } = req.body; // Get the start time from the request body

  if (!start_time) {
    return res.status(400).json({
      success: false,
      message: 'start_time is required'
    });
  }

  try {
    // Update the order's start_time in the MySQL database
    const [result] = await db.query(
      `UPDATE ordertable SET technician_start_time = ${Date(start_time)} WHERE order_id = ${orderid}`,
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Technician arrival time updated successfully',
    });
  } catch (error) {
    console.error('Error updating technician arrival time:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating technician arrival time'
    });
  }
}

async function changeTechnicianStatus(req, res) {
  const technicianId = req.params.id
  const { status } = req.body;

  try {
    // Update the order's start_time in the MySQL database
    const [result] = await db.query(
      `UPDATE technician SET status = ${status} WHERE technician_id = ${technicianId}`,
    );

    res.status(200).json({
      success: true,
      message: 'Technician arrival time updated successfully',
    });
  } catch (error) {
    console.error('Error updating technician arrival time:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating technician arrival time'
    });
  }
}


async function updateTechnicianArrivalTime(req, res) {
  const { orderid } = req.params; // Get the order ID from URL parameters
  const { start_time } = req.body; // Get the start time from the request body

  if (!start_time) {
    return res.status(400).json({
      success: false,
      message: 'start_time is required'
    });
  }

  try {
    // Update the order's start_time in the MySQL database
    const [result] = await db.query(
      `UPDATE ordertable SET technician_start_time = ${Date(start_time)} WHERE order_id = ${orderid}`,
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Technician arrival time updated successfully',
    });
  } catch (error) {
    console.error('Error updating technician arrival time:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating technician arrival time'
    });
  }
}



function updateFCMTokenTechnician(req, res) {

  const { technicianId, fcmToken } =
    req.body;
  // Update the database with the generated token
  const updateUserTokenQuery = `
    UPDATE technician SET fcm_token="${fcmToken}" WHERE technician_id ="${technicianId}"
  `;

  db.query(updateUserTokenQuery, (error) => {
    if (error) {
      return res.status(500).json({ status: 500, message: "Internal Server Error" });
    }

    // Respond with success message along with token
    return res.status(200).json({
      message: "Login successful",

      status: 200,
    });
  });
}


function declineOrderForTechnician(req, res) {
  const { type } = req.user;
  const { cancel_details } = req.body;
  if (type === "customer") {
    return res.status(401).json({ message: "Unauthorized", status: 401 });
  }

  const { id } = req.params;
  const declineOrderQuery = `UPDATE ordertable SET technician_id=${technician_id}, order_status='pending', cancel_details='${cancel_details}' WHERE order_id='${id}'`;
  db.query(declineOrderQuery, (error) => {
    if (error) {
      throw error;
    }
    return res
      .status(200)
      .json({ message: "Order declined successfully", status: 200 });
  });
}



module.exports = {
  createTechnician,
  getAllTechnicians,
  getTechnicianById,
  updateTechnician,
  deleteTechnician,
  getTechnicianByToken,
  sendLocation,
  updateTechnicianArrivalTime,
  changeTechnicianStatus,
  updateFCMTokenTechnician,
  declineOrderForTechnician
};
