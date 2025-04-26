const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

// Tạo đơn hàng từ giỏ hàng
exports.createOrder = asyncHandler(async (req, res) => {
  try {
    const { fullname, phone, address, paymentMethod } = req.body;

    const cart = await Cart.findOne({ userId: req.user._id }).populate(
      "items.productId"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Giỏ hàng trống!",
      });
    }

    const order = await Order.create({
      userId: req.user._id,
      items: cart.items.map((item) => ({
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        quantity: item.quantity,
        size: item.size
      })),
      subTotal: cart.cartSummary.subTotal,
      vat: cart.cartSummary.vat,
      totalAmount: cart.cartSummary.totalAmount,
      receiverInfo: { fullname, phone, address },
      paymentMethod,
      status: "processing",
    });

    // Cập nhật số lượng sản phẩm trong kho
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.productId._id, {
        $inc: {
          stock: -item.quantity,
          sold: +item.quantity,
        },
      });
    }

    // Xóa giỏ hàng
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Đặt hàng thành công!",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo đơn hàng: " + error.message,
    });
  }
});

// Tạo đơn hàng từ các sản phẩm được chọn trong giỏ hàng
exports.createSelectedItemsOrder = asyncHandler(async (req, res) => {
  try {
    const { fullname, phone, address, paymentMethod, orderItems } = req.body;

    console.log("Request body received:", {
      fullname,
      phone,
      address,
      paymentMethod,
      orderItems
    });

    // Kiểm tra dữ liệu đầu vào
    if (
      !orderItems ||
      !Array.isArray(orderItems) ||
      orderItems.length === 0
    ) {
      console.log("Error: No order items found in request");
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn ít nhất một sản phẩm để đặt hàng!",
      });
    }

    if (!fullname || !phone || !address) {
      console.log("Error: Missing receiver information");
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ thông tin người nhận!",
      });
    }

    // Lấy danh sách sản phẩm ID để truy vấn
    const productIds = orderItems.map(item => item.productId);
    
    // Tìm thông tin sản phẩm từ database
    const products = await Product.find({ _id: { $in: productIds } });
    
    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Không tìm thấy sản phẩm trong hệ thống!",
      });
    }
    
    console.log(`Found ${products.length} products out of ${productIds.length} requested products`);
    
    // Tạo các item cho đơn hàng với đầy đủ thông tin
    const itemsToOrder = orderItems.map(orderItem => {
      const product = products.find(p => p._id.toString() === orderItem.productId);
      if (!product) {
        console.log(`Product not found: ${orderItem.productId}`);
        return null;
      }
      
      return {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: orderItem.quantity,
        size: orderItem.size
      };
    }).filter(item => item !== null);
    
    console.log("Processed order items:", itemsToOrder);

    if (itemsToOrder.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Không thể tạo đơn hàng với sản phẩm đã chọn!",
      });
    }

    // Tính tổng tiền và VAT
    const subTotal = itemsToOrder.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const VAT_RATE = 0.1; // 10%
    const vat = subTotal * VAT_RATE;
    const totalAmount = subTotal + vat;

    // Tạo đơn hàng mới với thông tin VAT
    const order = await Order.create({
      userId: req.user._id,
      items: itemsToOrder,
      subTotal: subTotal,
      vat: vat,
      totalAmount: totalAmount,
      receiverInfo: { fullname, phone, address },
      paymentMethod: paymentMethod || "COD",
      status: "processing",
    });

    // Cập nhật số lượng sản phẩm trong kho
    for (const item of itemsToOrder) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: {
          stock: -item.quantity,
          sold: +item.quantity,
        },
      });
    }

    res.status(201).json({
      success: true,
      message: "Đặt hàng thành công!",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo đơn hàng: " + error.message,
    });
  }
});

// Lấy lịch sử đơn hàng
exports.getOrderHistory = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort(
      "-createdAt"
    );

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy lịch sử đơn hàng: " + error.message,
    });
  }
});
