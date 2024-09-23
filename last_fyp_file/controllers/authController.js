const db = require("../utils/database");
const { generateToken } = require("../utils/authGuard");
const { sendEmail } = require("../utils/mailService");
const { v1: uuid } = require("uuid");
const { v4: uuidv4 } = require("uuid"); // To generate a unique admin_id

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Assuming you're using JWT for token generation
// register admin
async function registerAdmin(req, res) {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ status: 400, message: "Email and password are required" });
  }

  try {
    // Check if admin with this email already exists
    const isAdminExistQuery = `SELECT * FROM admin WHERE email="${email}"`;
    db.query(isAdminExistQuery, async (error, rows) => {
      if (error) {
        return res.status(500).json({ status: 500, message: "Internal Server Error" });
      }
      
      if (rows.length > 0) {
        return res.status(400).json({ status: 400, message: "Admin with this email already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate token for the admin
      const token = generateToken({ email, type: "admin" });

      // Insert admin data into the admin table
      const insertAdminQuery = `
        INSERT INTO admin (email, admin_password, token) 
        VALUES ( "${email}", "${hashedPassword}", "${token}")
      `;

      db.query(insertAdminQuery, (error) => {
        if (error) {
          return res.status(500).json({ status: 500, message: "Internal Server Error" });
        }

        // Respond with success message and admin data
        return res.status(201).json({
          message: "Admin registered successfully",
          result: {
            email,
            token,
          },
          status: 201,
        });
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: "Something went wrong" });
  }
}



function login(req, res) {
  const { email, password, userType } = req.body;
  console.log(req.body);

  let isUserExistQuery = "";
  if (userType === "customer") {
    isUserExistQuery = `SELECT * FROM customer WHERE email="${email}"`;
  } else if (userType === "admin") {
    isUserExistQuery = `SELECT * FROM admin WHERE email="${email}"`;
  } else if (userType === "technician") {
    isUserExistQuery = `SELECT * FROM technician WHERE email="${email}"`;
  }

  const userTypeIds = {
    customer: "customer_id",
    admin: "admin_id",
    technician: "technician_id",
  };

  // Find user by email
  db.query(isUserExistQuery, async (error, rows) => {
    if (error) {
      return res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
    
    if (rows.length === 0) {
      return res.status(401).json({ status: 401, message: "Invalid email or password" });
    }

    // Compare the provided password with the hashed password in the database
    const hashedPassword = rows[0].password || rows[0].admin_password;
    console.log("pass", password, hashedPassword)
    const isMatch = await bcrypt.compare(password, hashedPassword);
    
    if (!isMatch) {
      return res.status(401).json({ status: 401, message: "Invalid email or password" });
    }

    // Generate token if password matches
    const token = generateToken({
      userId: rows[0][userTypeIds[userType]],
      email,
      type: userType,
    });

    // Update the database with the generated token
    const updateUserTokenQuery = `
      UPDATE ${userType} SET token="${token}" WHERE email="${email}"
    `;

    db.query(updateUserTokenQuery, (error) => {
      if (error) {
        return res.status(500).json({ status: 500, message: "Internal Server Error" });
      }

      // Respond with success message along with token
      return res.status(200).json({
        message: "Login successful",
        result: rows[0],
        token,
        status: 200,
      });
    });
  });
}
 

function changePassword(req, res) {
  const { userId, type } = req.user;
  const { old_password, new_password } = req.body;

  let getPasswordQuery = "";
  if (type === "customer") {
    getPasswordQuery = `SELECT password FROM customer WHERE customer_id=${userId}`;
  } else if (type === "technician") {
    getPasswordQuery = `SELECT password FROM technician WHERE technician_id="${userId}"`;
  }

  // Fetch the user's current password from the database
  db.query(getPasswordQuery, async (error, rows) => {
    if (error) {
      return res.status(500).json({ status: 500, message: "Internal Server Error" });
    }

    if (rows.length === 0) {
      return res.status(400).json({ message: "User not found", status: 400 });
    }

    const hashedPassword = rows[0].password; // The stored hashed password

    // Compare the provided old password with the stored hashed password
    const isMatch = await bcrypt.compare(old_password, hashedPassword);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid old password", status: 400 });
    }

    // Hash the new password before storing it
    const hashedNewPassword = await bcrypt.hash(new_password, 10);

    let changePasswordQuery = "";
    if (type === "customer") {
      changePasswordQuery = `UPDATE customer SET password="${hashedNewPassword}" WHERE customer_id=${userId}`;
    } else if (type === "technician") {
      changePasswordQuery = `UPDATE technician SET password="${hashedNewPassword}" WHERE technician_id="${userId}"`;
    }

    // Update the user's password in the database
    db.query(changePasswordQuery, (error, result) => {
      if (error) {
        return res.status(500).json({ status: 500, message: "Internal Server Error" });
      }

      if (result.affectedRows === 0) {
        return res.status(400).json({ message: "Password change failed", status: 400 });
      }

      return res.status(200).json({
        message: "Password changed successfully",
        status: 200,
      });
    });
  });
}


function forgotPassword(req, res) {
  const { email, userType } = req.body;
  let forgotPasswordQuery = "";

  if (userType === "customer") {
    forgotPasswordQuery = `SELECT * FROM customer WHERE email="${email}"`;
  } else if (userType === "technician") {
    forgotPasswordQuery = `SELECT * FROM technician WHERE email="${email}"`;
  }

  db.query(forgotPasswordQuery, (error, rows) => {
    if (error) {
      throw error;
    }
    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email" });
    }
    const token = uuid();
    console.log(token);
    let mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: "zainabyousaf171.com", // email testing purpose, should be from db
      subject: "Password Reset Link",
      text: `Hey, click on the link below to reset your password, http://localhost:5005/reset_password.html?user=${userType}&email=${email}&token=${token}`,
    };

    sendEmail(mailOptions);
    db.query(
      `UPDATE customer SET token="${token}" WHERE email="${email}"`,
      (error, rows) => {
        if (error) {
          throw error;
        }
        return res.status(200).json({
          message: "reset-password link is sent on your email",
          status: 200,
        });
      }
    );
  });
}

// reset password

function resetPassword(req, res) {
  const { email, token, user } = req.query;
  const { password } = req.body;

  let resetPasswordQuery = "";
  let setTokenNullQuery = "";
  if (user === "customer") {
    resetPasswordQuery = `SELECT * FROM customer WHERE email="${email}" AND token="${token}"`;
    setTokenNullQuery = `UPDATE customer SET token = NULL,  password = "${password}" WHERE email = "${email}"`;
  } else if (user === "technician") {
    resetPasswordQuery = `SELECT * FROM technician WHERE email = "${email}" AND token = "${token}"`;
    setTokenNullQuery = `UPDATE technician SET token = NULL,  password = "${password}" WHERE email = "${email}"`;
  }

  db.query(resetPasswordQuery, (error, rows) => {
    if (error) {
      throw error;
    }
    console.log(rows);
    console.log(resetPasswordQuery);
    if (rows.length === 0) {
      return res.status(401).json({ message: "link expired" });
    }
    db.query(setTokenNullQuery, (error, rows) => {
      if (error) {
        throw error;
      }

      return res
        .status(200)
        .json({ message: "Password changed successfully", status: 200 });
    });
  });
}
module.exports = { login, changePassword, forgotPassword, resetPassword,registerAdmin };