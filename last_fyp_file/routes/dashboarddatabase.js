const express = require("express");


// inventory Management
const {
  createInventoryItem,
  getAllInventoryItems,
  getInventoryItemById,
  updateInventoryItem,
  deleteInventoryItem
} = require("../controllers/inventoryController");


const {
  customerRegister,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");

const router = express.Router();

const db = require("../utils/database");
const {
  viewAllOrders,
  createOrder,
  declineOrder,
  pendingOrdersCount,
  completedOrdersCount,
  ongoingOrdersCount,
  viewCompletedOrderHistory,
  
  viewRequestDetail,
  assignTechnician,
  getOrderDetail,
  acceptOrder,
  invoiceOrder,
  markOrderCompleted,
  createReview,
  viewCancelledOrderHistory,
  getOrderById,
  deleteOrder,
} = require("../controllers/ordersController");
const { decodeToken } = require("../utils/authGuard");
const {
  login,
  changePassword,
  forgotPassword,
  resetPassword,
  registerAdmin,
} = require("../controllers/authController");
const {
  createTechnician,
  getAllTechnicians,
  getTechnicianById,
  updateTechnician,
  deleteTechnician,
} = require("../controllers/technicianController");
const {
  createBanner,
  getAllBanners,
  getBannerById,
  updateBanner,
} = require("../controllers/bannerController");
const upload = require("../utils/imgUpload");
const { createRequestForm, updateRequestFormStatus, getAllRequestForms, deleteRequestForm, getRequestFormById, getRequestFormsByTechnician } = require("../controllers/requestController");

// auth routes
router.post("/login", login);
router.post("/register-admin", registerAdmin);
router.post("/change-password", decodeToken, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
// customer routes
router.post("/customer/register", customerRegister);

// order routes
router.get("/orders", decodeToken, viewAllOrders);
router.post("/orders", decodeToken, upload.single("image"), createOrder);
router.get("/orders/history", decodeToken, viewCompletedOrderHistory);
router.get("/orders/history/cancelled", decodeToken, viewCancelledOrderHistory);
router.put("/orders/:id/decline-request", decodeToken, declineOrder);
router.put("/orders/:id/assign-technician", decodeToken, assignTechnician);
router.put("/orders/:id/accept", decodeToken, acceptOrder);
router.get("/orders/:id/invoice", decodeToken, invoiceOrder);
router.get("/orders/:id", decodeToken, getOrderById);
router.put("/orders/:id", decodeToken, createReview);
router.delete("/orders/:id", decodeToken, deleteOrder);
router.put(
  "/orders/:id/mark-complete",
  decodeToken,
  upload.single("image"),
  markOrderCompleted
);
router.get("/orders/:id/request-detail", decodeToken, viewRequestDetail);
router.get("/orders/pending/count", decodeToken, pendingOrdersCount);
router.get("/orders/completed/count", decodeToken, completedOrdersCount);
router.get("/orders/ongoing/count", decodeToken, ongoingOrdersCount);
// admin routes
router.post("/admin/technicians", decodeToken, createTechnician);
router.get("/admin/technicians", decodeToken, getAllTechnicians);
router.get("/admin/technicians/:id", decodeToken, getTechnicianById);
router.put("/admin/technicians/:id", decodeToken, updateTechnician);
router.delete("/admin/technicians/:id", decodeToken, deleteTechnician);
router.get("/admin/customers", decodeToken, getAllCustomers);
router.get("/admin/customers/:id", decodeToken, getCustomerById);
router.put("/admin/customers/:id", decodeToken, updateCustomer);
router.delete("/admin/customers/:id", decodeToken, deleteCustomer);
// banner routes
router.post("/banner", decodeToken, upload.single("image"), createBanner);
router.get("/admin/banner", decodeToken, getAllBanners);
router.get("/admin/banner/:id", decodeToken, getBannerById);
router.put("/admin/banner/:id", decodeToken, upload.single("image"), updateBanner);


// request form 
router.post("/request",  createRequestForm);
router.put("/request/:id",  updateRequestFormStatus);
router.get("/request",  getAllRequestForms);
router.delete("/request/:id",  deleteRequestForm);
router.get("/request/:id",  getRequestFormById);
router.get("/request/technician/:name", getRequestFormsByTechnician);

// inventory

// Inventory Routes
router.post("/inventory",  createInventoryItem);
router.get("/inventory", getAllInventoryItems);
router.get("/inventory/:id",  getInventoryItemById);
router.put("/inventory/:id",  updateInventoryItem);
router.delete("/inventory/:id",  deleteInventoryItem);



module.exports = router;
