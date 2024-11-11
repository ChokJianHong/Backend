const db = require("../utils/database");
const bcrypt = require('bcryptjs');

function customerRegister(req, res) {
  const { email, password, name, phone_number, location, auto_gate_brand, alarm_brand, auto_gate_warranty, alarm_warranty } = req.body;

  // Check if email already exists
  const isUserExistQuery = `SELECT * FROM customer WHERE email='${email}'`;

  db.query(isUserExistQuery, async (error, rows) => {
    if (error) {
      return res.status(500).json({ status: 500, message: "Internal Server Error" });
    }

    // If email already exists
    if (rows.length > 0) {
      return res.status(400).json({ status: 400, message: "Email already exists" });
    }

    try {
      // Hash the password using bcryptjs
      const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10

      // Insert the new user into the database with the hashed password using string interpolation
      const createUserQuery = `INSERT INTO customer (email, password, name, phone_number, location, auto_gate_brand, alarm_brand, auto_gate_warranty, alarm_warranty) 
                               VALUES ('${email}', '${hashedPassword}', '${name}', '${phone_number}', '${location}', '${auto_gate_brand}', '${alarm_brand}', '${auto_gate_warranty}', '${alarm_warranty}')`;

      db.query(createUserQuery, (error, rows) => {
        if (error) {
          return res.status(500).json({ status: 500, message: "Internal Server Error" });
        }

        return res.status(201).json({ status: 201, message: "User created successfully" });
      });

    } catch (err) {
      console.error("Error hashing the password:", err);
      return res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
  });
}


function getAllCustomers(req, res) {
  const { type } = req.user;

  if (type !== "admin") {
    return res.status(401).json({ message: "Unauthorized", status: 401 });
  }
  const getAllCustomersQuery = `SELECT * FROM customer`;
  db.query(getAllCustomersQuery, (error, customers) => {
    if (error) {
      throw error;
    }
    return res.status(200).json({ status: 200, data: customers });
  });
}

function getCustomerById(req, res) {
  const customerId = req.params.id;

  const { type } = req.user;

  if (type === "technician") {
    return res.status(401).json({ message: "Unauthorized", status: 401 });
  }

  const getCustomerQuery = `SELECT * FROM customer WHERE customer_id = ${customerId}`;
  db.query(getCustomerQuery, (error, customer) => {
    if (error) {
      throw error;
    }

    if (customer.length === 0) {
      return res
        .status(404)
        .json({ message: "Customer not found", status: 404 });
    }

    return res.status(200).json({ status: 200, data: customer[0] });
  });
}

function getCustomer(req, res) {
  const customerId = req.params.id;

  const dbQuery = `
    SELECT 
      c.customer_id,
      c.name AS customer_name,
      c.location AS customer_address,
      c.phone_number AS customer_phone_number,
      c.email AS customer_email,
      c.auto_gate_brand AS customer_auto_gate_brand,
      c.alarm_brand AS customer_alarm_brand,
      c.auto_gate_warranty as customer_auto_gate_warranty,
      c.alarm_warranty as customer_alarm_warranty
    FROM 
      customer c
    WHERE 
      c.customer_id = ${customerId}
  `;

  db.query(dbQuery, (error, results) => {
    if (error) {
      console.error("Error executing database query:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Customer not found", status: 404 });
    }

    // Structuring customer details similarly to the order detail
    const customerDetails = {
      customerId: results[0].customer_id,
      name: results[0].customer_name,
      address: results[0].customer_address,
      phone: results[0].customer_phone_number,
      email: results[0].customer_email,
      autogateBrand: results[0].customer_auto_gate_brand,
      alarmBrand: results[0].customer_alarm_brand,
      autogateWarranty: results[0].customer_auto_gate_warranty,
      alarmWarranty: results[0].customer_alarm_warranty,
    };

    return res.status(200).json({ status: 200, data: customerDetails });
  });
}



function updateCustomer(req, res) {
  const customerId = req.params.id;
  const {
    name,
    phone_number = null,
    location,
    alarm_brand,
    autogate_brand,
    auto_gate_warranty,
    alarm_waranty,
  } = req.body;

  const { type } = req.user;

  if (type === "technician") {
    return res.status(401).json({ message: "Unauthorized", status: 401 });
  }
  let updateCustomerQuery = `UPDATE customer SET name = '${name}', location = '${location}'`;
  updateCustomerQuery = phone_number
    ? `${updateCustomerQuery}, phone_number = '${phone_number}'`
    : updateCustomerQuery;
  updateCustomerQuery = alarm_brand
    ? `${updateCustomerQuery}, alarm_brand = '${alarm_brand}'`
    : updateCustomerQuery;
  updateCustomerQuery = autogate_brand
    ? `${updateCustomerQuery}, auto_gate_brand = '${autogate_brand}'`
    : updateCustomerQuery;
    updateCustomerQuery = auto_gate_warranty
    ? `${updateCustomerQuery}, auto_gate_warranty = '${auto_gate_warranty}'`
    : updateCustomerQuery;
    updateCustomerQuery = alarm_waranty
    ? `${updateCustomerQuery}, alarm_waranty = '${alarm_waranty}'`
    : updateCustomerQuery;
  updateCustomerQuery = `${updateCustomerQuery} WHERE customer_id = ${customerId}`;
  db.query(updateCustomerQuery, (error, result) => {
    if (error) {
      throw error;
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    return res
      .status(200)
      .json({ message: "Customer updated successfully", status: 200 });
  });
}

function deleteCustomer(req, res) {
  const customerId = req.params.id;

  const { type } = req.user;

  if (type !== "admin") {
    return res.status(401).json({ message: "Unauthorized", status: 401 });
  }

  const deleteCustomerQuery = `DELETE FROM customer WHERE customer_id = ${customerId}`;
  db.query(deleteCustomerQuery, (error, result) => {
    if (error) {
      throw error;
    }

    return res.status(200).json({ message: "Customer deleted successfully" });
  });
}


function getCustomerByToken(req, res) {
  const token = req.headers.authorization.split(" ")[1]; // Extract token from authorization header

  if (!token) {
    return res.status(401).json({ message: "Unauthorized", status: 401 });
  }

  const getCustomerQuery = `SELECT * FROM customer WHERE token = '${token}'`;
  db.query(getCustomerQuery, (error, customer) => {
    if (error) {
      throw error;
    }

    if (customer.length === 0) {
      return res
        .status(404)
        .json({ message: "Customer not found", status: 404 });
    }

    return res.status(200).json({ status: 200, data: customer[0] });
  });
}

module.exports = {
  customerRegister,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  getCustomer,
  getCustomerByToken
};
