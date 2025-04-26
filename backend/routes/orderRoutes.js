const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const {
  createOrder,
  getOrderHistory,
  createSelectedItemsOrder,
} = require("../controllers/orderController");

router.use(authenticateToken);

// Tạo đơn hàng từ giỏ hàng
router.post("/create", createOrder);
// Tạo đơn hàng từ các sản phẩm được chọn trong giỏ hàng
router.post("/create-selected", createSelectedItemsOrder);
// Lấy lịch sử đơn hàng
router.get("/history", getOrderHistory);

module.exports = router;
