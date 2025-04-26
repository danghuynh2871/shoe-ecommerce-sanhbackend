const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");

const authenticateAdmin = async (req, res, next) => {
  try {
    let token;

    // Kiểm tra định dạng header Authorization
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy token, vui lòng đăng nhập lại!",
      });
    }

    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Tìm admin theo ID từ token
    const admin = await Admin.findById(decoded.adminId).select("-password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy admin với token này!",
      });
    }

    // Thêm thông tin admin vào request
    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Token không hợp lệ!",
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token đã hết hạn!",
      });
    }
    res.status(500).json({
      success: false,
      message: "Lỗi xác thực: " + error.message,
    });
  }
};

module.exports = { authenticateAdmin }; 