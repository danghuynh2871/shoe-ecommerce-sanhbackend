const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken } = require("../middleware/authMiddleware");

// Route đăng ký
router.post("/register", userController.registerUser);

// Route đăng nhập
router.post("/login", userController.loginUser);

// Route lấy thông tin người dùng hiện tại
router.get("/me", authenticateToken, userController.getCurrentUser);

module.exports = router;
