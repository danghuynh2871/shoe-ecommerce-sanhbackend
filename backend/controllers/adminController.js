const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Admin = require("../models/adminModel");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Đăng nhập Admin
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    // Kiểm tra đầu vào
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ email và mật khẩu",
      });
    }

    // Kiểm tra tài khoản admin
    const admin = await Admin.findOne({ email });

    // Kiểm tra email và mật khẩu
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({
        success: false,
        message: "Thông tin đăng nhập không chính xác",
      });
    }

    // Tạo token
    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Trả về kết quả
    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        fullname: admin.fullname,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ: " + error.message,
    });
  }
});

// Thống kê Dashboard
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const stats = {
    users: await User.countDocuments(),
    products: await Product.countDocuments(),
    orders: await Order.countDocuments(),
    revenue:
      (
        await Order.aggregate([
          { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ])
      )[0]?.total || 0,
  };

  res.json({
    success: true,
    stats,
  });
});

// Quản lý người dùng
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort("-createdAt");

  res.json({
    success: true,
    count: users.length,
    users,
  });
});

exports.getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Không tìm thấy người dùng",
    });
  }

  res.json({
    success: true,
    user,
  });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    res.status(200).json({
      success: true,
      message: "Xóa người dùng thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa người dùng: " + error.message,
    });
  }
});

// Quản lý sản phẩm
exports.getAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort("-createdAt");

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể tải sản phẩm: " + error.message,
    });
  }
});

exports.getProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thông tin sản phẩm: " + error.message,
    });
  }
});

exports.createProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, image, type, brand, sizes, stock } =
      req.body;

    // Kiểm tra các trường bắt buộc
    if (!name || !price || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: "Tên, giá và số lượng tồn là bắt buộc",
      });
    }

    // Kiểm tra giá trị hợp lệ
    if (price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Giá sản phẩm phải lớn hơn 0",
      });
    }

    if (stock < 0) {
      return res.status(400).json({
        success: false,
        message: "Số lượng trong kho không được âm",
      });
    }

    // Xử lý sizes
    let sizesArray = [];
    if (sizes) {
      if (Array.isArray(sizes)) {
        sizesArray = sizes;
      } else if (typeof sizes === "string") {
        sizesArray = sizes.split(",").map((size) => size.trim());
      }
    }

    // Tạo sản phẩm mới
    const newProduct = new Product({
      name,
      description: description || "",
      price,
      image: image || "",
      type: type || "",
      brand: brand || "",
      sizes: sizesArray,
      stock,
      sold: 0,
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Thêm sản phẩm thành công",
      product: newProduct,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    res.status(500).json({
      success: false,
      message: "Lỗi khi thêm sản phẩm: " + error.message,
    });
  }
});

exports.updateProduct = asyncHandler(async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, description, price, image, type, brand, sizes, stock, sold } =
      req.body;

    // Kiểm tra các giá trị hợp lệ
    if (price !== undefined && price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Giá sản phẩm phải lớn hơn 0",
      });
    }

    if (stock !== undefined && stock < 0) {
      return res.status(400).json({
        success: false,
        message: "Số lượng trong kho không được âm",
      });
    }

    // Xử lý sizes
    let sizesArray;
    if (sizes) {
      if (Array.isArray(sizes)) {
        sizesArray = sizes;
      } else if (typeof sizes === "string") {
        sizesArray = sizes.split(",").map((size) => size.trim());
      }
    }

    // Tạo đối tượng cập nhật
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (image !== undefined) updateData.image = image;
    if (type !== undefined) updateData.type = type;
    if (brand !== undefined) updateData.brand = brand;
    if (sizesArray) updateData.sizes = sizesArray;
    if (stock !== undefined) updateData.stock = stock;
    if (sold !== undefined) updateData.sold = sold;

    // Cập nhật sản phẩm
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật sản phẩm thành công",
      product: updatedProduct,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật sản phẩm: " + error.message,
    });
  }
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    res.status(200).json({
      success: true,
      message: "Xóa sản phẩm thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa sản phẩm: " + error.message,
    });
  }
});

// Quản lý đơn hàng
exports.getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("userId", "fullname email")
    .sort("-createdAt");

  res.json({
    success: true,
    count: orders.length,
    orders,
  });
});

exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("userId", "fullname email")
    .populate("items.productId");

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Không tìm thấy đơn hàng",
    });
  }

  res.json({
    success: true,
    order,
  });
});

exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  // Kiểm tra trạng thái đơn hàng hợp lệ
  const validStatuses = ["processing", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Trạng thái đơn hàng không hợp lệ",
    });
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Không tìm thấy đơn hàng",
    });
  }

  res.json({
    success: true,
    message: "Cập nhật trạng thái đơn hàng thành công",
    order,
  });
});
