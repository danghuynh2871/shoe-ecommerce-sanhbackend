const express = require("express");
const router = express.Router();
const { authenticateAdmin } = require("../middleware/adminMiddleware");
const adminController = require("../controllers/adminController");

// Route đăng nhập admin (không cần xác thực)
router.post("/login", adminController.login);

// Áp dụng middleware xác thực cho các route bên dưới
router.use(authenticateAdmin);

// Thống kê Dashboard
router.get("/dashboard", adminController.getDashboardStats);

// Quản lý người dùng
router.get("/users", adminController.getAllUsers);
router.get("/users/:id", adminController.getUserById);
router.delete("/users/remove/:id", adminController.deleteUser);

// Quản lý sản phẩm
router.get("/products", adminController.getAllProducts);
router.post("/products/add", adminController.createProduct);
router.get("/products/:id", adminController.getProductById);
router.put("/products/update/:id", adminController.updateProduct);
router.delete("/products/remove/:id", adminController.deleteProduct);

// Quản lý đơn hàng
router.get("/orders", adminController.getAllOrders);
router.get("/orders/:id", adminController.getOrderById);
router.put("/orders/:id/status", adminController.updateOrderStatus);

module.exports = router;
