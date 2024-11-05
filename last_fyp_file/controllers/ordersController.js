const db = require("../utils/database");
const admin = require("firebase-admin");
function createOrder(req, res) {
  const { userId, type } = req.user;
  if (type !== "customer") {
    return res
      .status(401)
      .json({ message: "Only customers can create orders", status: 401 });
  }

  const { order_detail, urgency_level, location_detail, problem_type } =
    req.body;
  const order_img = req.file ? `uploads/${req.file.filename}` : null;

  const now = new Date();
  const order_date = now.toISOString().slice(0, 10).split("T")[0];
  const order_time = now.toTimeString().slice(0, 8);

  const createOrderQuery = `
    INSERT INTO ordertable (customer_id, problem_type, order_date, order_time, order_status, order_detail, order_img, urgency_level, location_details, price_status)
    VALUES (${userId}, '${problem_type}', '${order_date}', '${order_time}', 'pending', '${order_detail}', '${order_img}', '${urgency_level}', '${location_detail}', 'unpaid')
  `;
  db.query(createOrderQuery, (error, result) => {
    if (error) {
      console.error("Error creating order:", error);
      return res.status(500).json({ message: "Failed to create order" });
    }

    return res.status(201).json({ message: "success" });
  });
}



function deleteOrder(req, res) {

  const { id } = req.params;

  // Use string interpolation to build the query // new_addition 
  const deleteRequestFormQuery = `
        DELETE FROM ordertable
        WHERE order_id = '${id}'
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


function viewRequestDetail(req, res) {
  const { type } = req.user;
  const orderId = req.params.id;
  const status = req.query.status;
  // console.log(req.query);
  let dbQuery = "";
  if (status === "pending" || status === "cancelled") {
    console.log("inside here");
    dbQuery = `
    SELECT 
    ordertable.*,
    c.name AS customer_name,
    c.location AS customer_address,
    c.phone_number AS customer_phone_number,
    c.email as customer_email,
    c.auto_gate_brand as customer_auto_gate_brand,
    c.alarm_brand as customer_alarm_brand,
    c.auto_gate_warranty as customer_auto_gate_warranty
    c.alarm_warranty as customer_alarm_warranty
    FROM 
    ordertable
    JOIN 
    customer c ON ordertable.customer_id = c.customer_id
    WHERE 
    ordertable.order_id = ${orderId}
    `;
  } else {
    dbQuery = `
    SELECT 
    ordertable.*,
    c.name AS customer_name,
    c.location AS customer_address,
    c.phone_number AS customer_phone_number,
    c.email as customer_email,
    c.auto_gate_brand as customer_auto_gate_brand,
    c.alarm_brand as customer_alarm_brand,
    c.auto_gate_warranty as customer_auto_gate_warranty,
    c.alarm_warranty as customer_alarm_warranty,
    t.name AS technician_name,
    t.phone_number AS technician_phone_number,
    t.specialization AS technician_specialization
    FROM 
    ordertable
    JOIN 
    customer c ON ordertable.customer_id = c.customer_id
    JOIN 
    technician t ON ordertable.technician_id = t.technician_id
    WHERE 
    ordertable.order_id = ${orderId}
    `;
  }

  db.query(dbQuery, (error, results) => {
    if (error) {
      console.error("Error executing database query:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Order not found", status: 404 });
    }
    const orderDetails = {
      orderId: results[0].order_id,
      orderDate: results[0].order_date,
      orderDoneDate: results[0].order_done_date,
      orderStatus: results[0].order_status,
      orderImage: results[0].order_img,
      orderDoneImage: results[0].order_done_img,
      orderDetail: results[0].order_detail,
      priority: results[0].urgency_level,
      locationDetail: results[0].location_detail,
      priceStatus: results[0].price_status,
      totalPrice: results[0].total_price,
      accept: results[0].accept,
      eventId: results[0].event_id,
      rating: results[0].rating,
      problem:
        (results[0]?.technician_specialization &&
          results[0].technician_specialization[0].toUpperCase() +
          results[0].technician_specialization.substring(1)) ||
        "",
      customer: {
        name: results[0].customer_name,
        address: results[0].customer_address,
        email: results[0].customer_email,
        phone: results[0].customer_phone_number,
        autogateBrand: results[0].customer_auto_gate_brand,
        alarmBrand: results[0].customer_alarm_brand,
        autogateWarranty: results[0].customer_auto_gate_warranty,
        alarmWarranty: results[0].customer_alarm_warranty,
      },
      technician: {
        name: results[0]?.technician_name || "",
        contactNumber: results[0]?.technician_phone_number || "",
        eta: results[0]?.technician_eta || "",
        startTime: results[0]?.technician_start_time || "",
        endTime: results[0]?.technician_stop_time || "",
      },
      userType: type,
    };

    return res.status(200).json({ status: 200, result: orderDetails });
  });
}

function getOrderDetail(req, res) {
  const orderId = req.params.id;
  const { status: orderStatus } = req.query;

  let dbQuery = `
    SELECT 
      ordertable.*,
      c.name AS customer_name,
      c.location AS customer_address,
      c.phone_number AS customer_phone_number,
      c.email as customer_email,
      c.auto_gate_brand as customer_auto_gate_brand,
      c.alarm_brand as customer_alarm_brand,
      c.auto_gate_warranty as customer_auto_gate_warranty,
      c.alarm_warranty as customer_alarm_warranty
    FROM 
      ordertable
    JOIN 
      customer c ON ordertable.customer_id = c.customer_id
  `;

  if (orderStatus !== "pending") {
    dbQuery += `
      JOIN 
        technician t ON ordertable.technician_id = t.technician_id
    `;
  }

  dbQuery += `
    WHERE 
      ordertable.order_id = ${orderId}
  `;

  db.query(dbQuery, (error, results) => {
    if (error) {
      console.error("Error executing database query:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Order not found", status: 404 });
    }

    const orderDetails = {
      orderId: results[0].order_id,
      orderDate: results[0].order_date,
      orderDoneDate: results[0].order_done_date,
      orderStatus: results[0].order_status,
      orderImage: results[0].order_img,
      orderDoneImage: results[0].order_done_img,
      orderDetail: results[0].order_detail,
      priority: results[0].urgency_level,
      locationDetail: results[0].location_detail,
      priceStatus: results[0].price_status,
      totalPrice: results[0].total_price,
      eventId: results[0].event_id,
      problem:
        (results[0]?.technician_specialization &&
          results[0].technician_specialization[0].toUpperCase() +
          results[0].technician_specialization.substring(1)) ||
        "",
      customer: {
        name: results[0].customer_name,
        address: results[0].customer_address,
        email: results[0].customer_email,
        phone: results[0].customer_phone_number,
        autogateBrand: results[0].customer_auto_gate_brand,
        alarmBrand: results[0].customer_alarm_brand,
        autogateWarranty: results[0].customer_auto_gate_warranty,
        alarmWarranty: results[0].customer_alarm_warranty,
      },
      technician: {
        name: results[0]?.technician_name || "",
        contactNumber: results[0]?.technician_phone_number || "",
        eta: results[0]?.technician_eta || "",
      },
    };

    return res.status(200).json({ status: 200, result: orderDetails });
  });
}

function declineOrder(req, res) {
  const { type } = req.user;
  const { cancel_details } = req.body;
  if (type === "customer") {
    return res.status(401).json({ message: "Unauthorized", status: 401 });
  }

  const { id } = req.params;
  const declineOrderQuery = `UPDATE ordertable SET technician_id=NULL, order_status='cancelled', cancel_details='${cancel_details}' WHERE order_id='${id}'`;
  db.query(declineOrderQuery, (error) => {
    if (error) {
      throw error;
    }
    return res
      .status(200)
      .json({ message: "Order declined successfully", status: 200 });
  });
}

function assignTechnician(req, res) {
  const { type } = req.user;
  const { id } = req.params;
  const { technician_id } = req.body;
  if (type !== "admin") {
    return res.status(401).json({ message: "Unauthorized", status: 401 });
  }
  const assignTechnicianQuery = `UPDATE ordertable SET order_status='ongoing', technician_id=${technician_id} WHERE order_id=${id}`;
  db.query(assignTechnicianQuery, (error, rows) => {
    if (error) {
      throw error;
    }
    return res
      .status(200)
      .json({ message: "Order assigned successfully", status: 200 });
  });
  const sendNotification = async (registrationToken) =>{
    const messageSend = {
      token: registrationToken,
      notification: {
        title: "Request Accepted!",
        body: "Technician: Dylan has been assigned to your task"
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
  
    admin
      .messaging()
      .send(messageSend)
      .then(response => {
        console.log("Successfuly sent message:", response);
      })
      .catch(error => {
        console.error("Error sending message:", error);
      });
  };
  const registrationToken = "fgNKh7EOQLu0clw3fCp34q:APA91bFpxwmdC2SoA6d6PZZcpSyYv_6KOX8mXaxoA8gkrK9d5nVvyf6XzbmHPqyi3vhwOjS7KWtpZWqR0VLZz1zD8B5VssMrABoiXgxDIVMoYnK9-jbd9OA";


  sendNotification(registrationToken);
}
function acceptOrder(req, res) {
  const { type, userId } = req.user;
  const { id } = req.params;
  const { eta, total_amount } = req.body;

  if (type !== "technician") {
    return res.status(401).json({ message: "Unauthorized", status: 401 });
  }
  const technician_eta = eta.split("T")[0];

  const acceptOrderQuery = `UPDATE ordertable SET order_status='ongoing', accept='1', technician_id=${userId}, technician_eta='${technician_eta}', total_price=${total_amount} WHERE order_id=${id}`;
  db.query(acceptOrderQuery, (error, rows) => {
    if (error) {
      throw error;
    }
    return res
      .status(200)
      .json({ message: "Order accepted successfully", status: 200 });
  });
}

function invoiceOrder(req, res) {
  const orderId = req.params.id;

  const invoiceQuery = `
  SELECT 
      o.order_id,
      o.order_date,
      o.order_status,
      o.total_price,
      o.problem_type,
      o.order_done_date,
      o.rating,
      o.review_text,
      o.review_date,
      c.name AS customer_name,
      c.location AS customer_address,
      c.email AS customer_email,
      c.phone_number AS customer_phone_number,
      t.name AS technician_name,
      t.location AS technician_location,
      t.email AS technician_email
    FROM 
      ordertable o
      LEFT JOIN customer c ON o.customer_id = c.customer_id
      LEFT JOIN technician t ON o.technician_id = t.technician_id
    WHERE 
      o.order_id = ${orderId} AND
      o.order_status = 'completed'
  `;
  db.query(invoiceQuery, (error, results) => {
    if (error) {
      console.error("Error executing database query:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    return res.status(200).json({ status: 200, result: results[0] });
  });
}

function markOrderCompleted(req, res) {
  const orderId = req.params.id;
  const now = new Date();
  const order_date = now.toISOString().slice(0, 10).split("T")[0];
  const order_time = now.toTimeString().slice(0, 8);

  const order_img = req.file ? `uploads/${req.file.filename}` : null;
  const pricing_detail = req.body.pricing_detail;
  const updateOrderQuery = `UPDATE ordertable SET order_status = 'completed',  order_done_img = '${order_img}', order_done_date = '${order_date}', technician_stop_time = '${order_time}' WHERE order_id = ${orderId}`;
  db.query(updateOrderQuery, (error, results) => {
    if (error) {
      console.error("Error executing database query:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    return res.status(200).json({ status: 200 });
  });
}

// Function to get an order by its ID // new_addition 
function getOrderById(req, res) {
  const orderId = req.params.id;

  // Query to fetch the order by ID
  const getOrderQuery = `SELECT * FROM ordertable WHERE order_id = ${orderId}`;

  db.query(getOrderQuery, (error, results) => {
    if (error) {
      console.error("Error executing database query:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Return the order details
    return res.status(200).json({ status: 200, result: results[0] });
  });
}

function createReview(req, res) {
  const orderId = req.params.id;
  const {
    rating,
    reviewText,

  } = req.body;

  const { type } = req.user;

  if (type === "technician") {
    return res.status(401).json({ message: "Unauthorized", status: 401 });
  }

  const now = new Date();
  const review_date = now.toISOString().slice(0, 10).split("T")[0];

  let createReviewQuery = `UPDATE ordertable SET rating = '${rating}', review_text = '${reviewText}'`;
  createReviewQuery = review_date
    ? `${createReviewQuery}, review_date = '${review_date}'`
    : createReviewQuery;


  createReviewQuery = `${createReviewQuery} WHERE order_id = ${orderId}`;
  db.query(createReviewQuery, (error, result) => {
    if (error) {
      throw error;
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    return res
      .status(200)
      .json({ message: "Review updated successfully", status: 200 });
  });

}

function getOrdersCountByStatus(status) {
  return `SELECT COUNT(*) AS orders_count FROM ordertable WHERE order_status = "${status}"`;
}
function pendingOrdersCount(req, res) {
  const countQuery = getOrdersCountByStatus("pending");
  db.query(countQuery, (error, results) => {
    if (error) {
      console.error("Error counting pending orders:", error);
      res.status(500).json({ error: "Internal server error", status: 500 });
      return;
    }
    res.json({ count: results[0].orders_count, status: 200 });
  });
}

function completedOrdersCount(req, res) {
  const countQuery = getOrdersCountByStatus("completed");
  db.query(countQuery, (error, results) => {
    if (error) {
      console.error("Error counting completed orders:", error);
      res.status(500).json({ error: "Internal server error", status: 500 });
      return;
    }
    res.json({ count: results[0].orders_count, status: 200 });
  });
}

function ongoingOrdersCount(req, res) {
  const countQuery = getOrdersCountByStatus("ongoing");
  db.query(countQuery, (error, results) => {
    if (error) {
      console.error("Error counting ongoing orders:", error);
      res.status(500).json({ error: "Internal server error", status: 500 });
      return;
    }
    res.json({ count: results[0].orders_count, status: 200 });
  });
}

function pendingOrdersQuery() {
  return `SELECT o.*, c.name AS customer_name, c.email AS customer_email, c.location AS customer_location
  FROM ordertable o
  JOIN customer c ON o.customer_id = c.customer_id`;
}

function viewAllOrders(req, res) {
  const { status } = req.query;
  const { userId, type } = req.user;
  let viewAllOrdersQuery = "";

  if (type === "customer") {
    // Select orders associated with the customer and join customer information
    viewAllOrdersQuery = `
      SELECT o.*, c.name AS customer_name, c.email AS customer_email, c.location AS customer_location
      FROM ordertable o
      JOIN customer c ON o.customer_id = c.customer_id
      WHERE o.customer_id = ${userId}
    `;
  } else if (type === "technician") {
    // Select orders associated with the technician and join technician information
    viewAllOrdersQuery = `
      SELECT o.*, t.name AS technician_name,  t.email AS technician_email, t.location AS technician_location
      FROM ordertable o
      JOIN technician t ON o.technician_id = t.technician_id
      WHERE o.technician_id = ${userId}
    `;
  } else {
    // For admin users, retrieve all orders with optional status filter
    viewAllOrdersQuery = `
      SELECT o.*, c.name AS customer_name,
      c.location AS customer_address,
      c.email AS customer_email,
      c.location AS customer_location,
      t.name AS technician_name,
      t.email AS technician_email,
      t.specialization AS technician_specialization
      FROM ordertable o
      LEFT JOIN customer c ON o.customer_id = c.customer_id
      LEFT JOIN technician t ON o.technician_id = t.technician_id
    `;
  }
  if (status === "pending" && type === "admin") {
    viewAllOrdersQuery = pendingOrdersQuery();
  }
  // Append status filter if provided and user is admin or technician
  if (status && type === "admin") {
    viewAllOrdersQuery += ` WHERE o.order_status = '${status}'`;
  } else if (status) {
    viewAllOrdersQuery += ` AND o.order_status = '${status}'`;
  }

  // Execute the SQL query
  db.query(viewAllOrdersQuery, (error, rows) => {
    if (error) {
      throw error;
    }
    return res.status(200).json({ result: rows, status: 200 });
  });
}

// new_addition 
function viewCancelledOrderHistory(req, res) {
  const { type } = req.user;

  // Check if the user is an admin
  if (type !== "admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Query to fetch all cancelled orders
  const cancelledOrderQuery = `
    SELECT * 
    FROM ordertable
    WHERE order_status = 'cancelled'
  `;

  // Execute the query
  db.query(cancelledOrderQuery, (error, rows) => {
    if (error) {
      return res.status(500).json({ message: "Database query error", error });
    }

    // Return the cancelled order history
    return res.status(200).json({ result: rows, status: 200 });
  });
};

function getOrderCountsByDate(req, res) {
  const orderCountsQuery = `
    SELECT 
      order_date,
      order_status, 
      COUNT(*) as count 
    FROM ordertable 
    GROUP BY order_date, order_status
    ORDER BY order_date
  `;

  db.query(orderCountsQuery, (error, results) => {
    if (error) {
      console.error("Error fetching order counts by date:", error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    // Organize results by date
    const dataByDate = {};
    results.forEach(row => {
      const { order_date, order_status, count } = row;
      if (!dataByDate[order_date]) {
        dataByDate[order_date] = { completed: 0, ongoing: 0, cancelled: 0 };
      }
      dataByDate[order_date][order_status] = count;
    });

    res.json({ dataByDate, status: 200 });
  });
}



function viewCompletedOrderHistory(req, res) {
  let { technician, date } = req.query;
  const { type } = req.user;

  if (type !== "admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  let completedOrderQuery =
    "SELECT o.*, t.name AS technician_name FROM ordertable o INNER JOIN technician t ON o.technician_id = t.technician_id";

  if (technician && date) {
    completedOrderQuery += ` WHERE t.name LIKE '%${technician}%' AND DATE(o.order_done_date) = '${date}'`;
  } else if (technician) {
    completedOrderQuery += ` WHERE t.name LIKE '%${technician}%'`;
  } else if (date) {
    completedOrderQuery += ` WHERE DATE(o.order_done_date) = '${date}'`;
  }

  completedOrderQuery += ` AND o.order_status='completed'`;

  db.query(completedOrderQuery, (error, rows) => {
    if (error) {
      throw error;
    }
    return res.status(200).json({ result: rows, status: 200 });
  });
}








function viewProblemStatistics(req, res) {
  const { type } = req.user;

  // Check if the user is an admin
  if (type !== "admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // SQL query to count problem types grouped by month
  const problemStatsQuery = `
      SELECT 
          DATE_FORMAT(order_date, '%Y-%m') AS month, 
          problem_type, 
          COUNT(*) AS problem_count
      FROM 
          ordertable
      WHERE 
          problem_type IN ('alarm', 'autogate')  -- Filter for specific problem types
      GROUP BY 
          DATE_FORMAT(order_date, '%Y-%m'), 
          problem_type
      ORDER BY 
          month ASC;
  `;

  // Execute the query
  db.query(problemStatsQuery, (error, rows) => {
    if (error) {
      console.error("Error fetching problem statistics:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    // Format the data for Google Charts
    const formattedData = [['Month', 'Alarm', 'Autogate']];
    const monthMap = new Map();

    rows.forEach(row => {
      if (!monthMap.has(row.month)) {
        monthMap.set(row.month, { alarm: 0, autogate: 0 });
      }
      if (row.problem_type === 'alarm') {
        monthMap.get(row.month).alarm = row.problem_count;
      } else if (row.problem_type === 'autogate') {
        monthMap.get(row.month).autogate = row.problem_count;
      }
    });

    // Convert the Map into an array suitable for Google Charts
    monthMap.forEach((value, key) => {
      formattedData.push([key, value.alarm, value.autogate]);
    });

    // Return the formatted data
    res.json(formattedData);
  });
}


function viewOrderStatusStatistics(req, res) {
  const { type } = req.user;

  // Check if the user is an admin
  if (type !== "admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // SQL query to count order statuses grouped by month
  const orderStatusQuery = `
      SELECT 
          DATE_FORMAT(order_date, '%Y-%m') AS month, 
          order_status, 
          COUNT(*) AS order_count
      FROM 
          ordertable
      WHERE 
          order_status IN ('ongoing', 'completed', 'cancelled')
      GROUP BY 
          month, order_status
      ORDER BY 
          month ASC;
  `;

  // Execute the query
  db.query(orderStatusQuery, (error, rows) => {
    if (error) {
      console.error("Error fetching order status statistics:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    // Format the data for Google Charts
    const formattedData = [['Month', 'Ongoing', 'Completed', 'Cancelled']];
    const monthMap = new Map();

    rows.forEach(row => {
      if (!monthMap.has(row.month)) {
        monthMap.set(row.month, { ongoing: 0, completed: 0, cancelled: 0 });
      }
      if (row.order_status === 'ongoing') {
        monthMap.get(row.month).ongoing = row.order_count;
      } else if (row.order_status === 'completed') {
        monthMap.get(row.month).completed = row.order_count;
      } else if (row.order_status === 'cancelled') {
        monthMap.get(row.month).cancelled = row.order_count;
      }
    });

    // Convert the Map into an array suitable for Google Charts
    monthMap.forEach((value, key) => {
      formattedData.push([key, value.ongoing, value.completed, value.cancelled]);
    });

    // Return the formatted data
    res.json(formattedData);
  });
}





function viewCompletedOrderSales(req, res) {
  const { type } = req.user;

  // Check if the user is an admin
  if (type !== "admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // SQL query to get completed order counts and total price grouped by month
  const completedOrderSalesQuery = `
      SELECT 
          DATE_FORMAT(order_date, '%Y-%m') AS month, 
          COUNT(*) AS order_count,
          SUM(total_price) AS total_price
      FROM 
          ordertable
      WHERE 
          order_status = 'completed'
      GROUP BY 
          month
      ORDER BY 
          month ASC;
  `;

  // Execute the query
  db.query(completedOrderSalesQuery, (error, rows) => {
    if (error) {
      console.error("Error fetching completed order sales data:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    // Format the data for the chart
    const formattedData = [['Month', 'Order Count', 'Total Price']];
    rows.forEach(row => {
      formattedData.push([row.month, row.order_count, row.total_price]);
    });

    // Return the formatted data
    res.json(formattedData);
  });
}







function viewTopSpareParts(req, res) {
  const { type } = req.user;

  // Check if the user is an admin
  if (type !== "admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // SQL query to get the top 3 most occurring spare parts
  const topSparePartsQuery = `
     SELECT 
        parts_needed, 
        COUNT(parts_needed) AS occurrences 
    FROM 
        request_forms
    GROUP BY 
        parts_needed
    ORDER BY 
        occurrences DESC
    LIMIT 3;
  `;

  // Execute the query
  db.query(topSparePartsQuery, (error, rows) => {
    if (error) {
      console.error("Error fetching top spare parts:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    // Return the result
    res.status(200).json({ result: rows, status: 200 });
  });
}



function viewOrdersDetail(req, res) {
  const orderId = req.params.id;

  const dbQuery = `
    SELECT 
      ordertable.*,
      c.name AS customer_name,
      c.location AS customer_address,
      c.phone_number AS customer_phone_number,
      c.email as customer_email,
      c.auto_gate_brand as customer_auto_gate_brand,
      c.alarm_brand as customer_alarm_brand,
      c.auto_gate_warranty as customer_auto_gate_warranty,
      c.alarm_warranty as customer_alarm_warranty
      
    FROM 
      ordertable
    JOIN 
      customer c ON ordertable.customer_id = c.customer_id
    LEFT JOIN
      technician t ON ordertable.technician_id = t.technician_id
    WHERE 
      ordertable.order_id = ${orderId}
  `;

  db.query(dbQuery, (error, results) => {
    if (error) {
      console.error("Error executing database query:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Order not found", status: 404 });
    }

    const orderDetails = {
      orderId: results[0].order_id,
      orderDate: results[0].order_date,
      orderDoneDate: results[0].order_done_date,
      orderStatus: results[0].order_status,
      orderTime: results[0].order_time,
      orderImage: results[0].order_img,
      orderDoneImage: results[0].order_done_img,
      orderDetail: results[0].order_detail,
      priority: results[0].urgency_level,
      locationDetail: results[0].location_details,
      priceStatus: results[0].price_status,
      totalPrice: results[0].total_price,
      ProblemType: results[0].problem_type,
      CustomerID: results[0].customer_id,
      TechnicianID: results[0].technician_id,
      TechnicianETA:results[0].technician_eta,
      customer: {
        name: results[0].customer_name,
        address: results[0].customer_address,
        email: results[0].customer_email,
        phone: results[0].customer_phone_number,
        autogateBrand: results[0].customer_auto_gate_brand,
        alarmBrand: results[0].customer_alarm_brand,
        autogateWarranty: results[0].customer_auto_gate_warranty,
        alarmWarranty: results[0].customer_alarm_warranty,
      },
    };

    return res.status(200).json({ status: 200, result: orderDetails });
  });
}

function getPendingOrders(req, res) {
  const pendingOrdersQuery = `
    SELECT
      o.*,
      c.name AS customer_name,
      c.email AS customer_email,
      c.location AS customer_location
    FROM
      ordertable o
    LEFT JOIN customer c ON
      o.customer_id = c.customer_id
    WHERE
      o.order_status = 'pending';
  `;

  // Execute the query
  db.query(pendingOrdersQuery, (error, rows) => {
    if (error) {
      console.error("Error retrieving pending orders:", error);
      return res.status(500).json({ message: "Internal Server Error", status: 500 });
    }

    // Return all pending orders
    return res.status(200).json({ result: rows, status: 200 });
  });
}

function cancelOrder(req, res) {
  const { type } = req.user;

  if (type !== "customer") {
    return res.status(401).json({ message: "Unauthorized", status: 401 });
  }

  const { id } = req.params;

  const declineOrderQuery = `
    UPDATE ordertable 
    SET technician_id = NULL, order_status = 'cancelled'
    WHERE order_id = '${id}'`;

  db.query(declineOrderQuery, (error, rows) => {
    if (error) {
      throw error;
    }
    return res
      .status(200)
      .json({ message: "Order cancelled successfully", status: 200 });
  });
}



module.exports = {

  viewTopSpareParts,
  viewOrderStatusStatistics,
  viewProblemStatistics,
  viewCompletedOrderSales,
  getOrderCountsByDate,
  createOrder,
  viewAllOrders,
  pendingOrdersCount,
  completedOrdersCount,
  ongoingOrdersCount,
  declineOrder,
  viewCompletedOrderHistory,
  viewCancelledOrderHistory,
  viewRequestDetail,
  assignTechnician,
  acceptOrder,
  getOrderDetail,
  invoiceOrder,
  markOrderCompleted,
  createReview,
  getOrderById,
  deleteOrder,
  viewOrdersDetail,
  getPendingOrders,
  cancelOrder
};
