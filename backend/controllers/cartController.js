const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

// Lấy giỏ hàng
exports.getCart = asyncHandler(async (req, res) => {
  try {
    console.log('Get cart request from user:', req.user._id);
    
    let cart = await Cart.findOne({ userId: req.user._id }).populate(
      "items.productId",
      "name price stock image"
    );

    if (!cart) {
      cart = await Cart.create({
        userId: req.user._id,
        items: [],
        cartSummary: { subTotal: 0, vat: 0, totalAmount: 0 },
      });
    }

    res.status(200).json({
      success: true,
      cartItems: cart.items,
      summary: cart.cartSummary
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy giỏ hàng: " + error.message,
    });
  }
});

exports.addToCart = asyncHandler(async (req, res) => {
  try {
    const { productId, quantity, size } = req.body;
    
    console.log('Add to cart request:', { productId, quantity, size, userId: req.user._id });

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm!",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Số lượng sản phẩm trong kho không đủ!",
      });
    }

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = await Cart.create({
        userId: req.user._id,
        items: [{ productId, quantity, size }],
      });
    } else {
      // Nếu sản phẩm đã có trong giỏ hàng (cùng kích thước nếu có), cập nhật số lượng
      // Nếu không, thêm mới vào giỏ hàng
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId && 
                 (size ? item.size === size : true)
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
      } else {
        cart.items.push({ productId, quantity, size });
      }
      await cart.save();
    }

    // Populate product details for response
    await cart.populate("items.productId", "name price stock image");

    res.status(200).json({
      success: true,
      message: "Thêm vào giỏ hàng thành công!",
      cartItems: cart.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        size: item.size
      }))
    });
  } catch (error) {
    console.error('Cart add error:', error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi thêm vào giỏ hàng: " + error.message,
    });
  }
});

// Cập nhật giỏ hàng
exports.updateCart = asyncHandler(async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Số lượng không hợp lệ!",
      });
    }

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giỏ hàng!",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Sản phẩm không có trong giỏ hàng!",
      });
    }

    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    await cart.populate("items.productId", "name price stock");

    res.status(200).json({
      success: true,
      message: "Cập nhật giỏ hàng thành công!",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật giỏ hàng: " + error.message,
    });
  }
});

// Xóa sản phẩm khỏi giỏ hàng
exports.removeFromCart = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giỏ hàng!",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Sản phẩm không có trong giỏ hàng!",
      });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();
    await cart.populate("items.productId", "name price stock");

    res.status(200).json({
      success: true,
      message: "Đã xóa sản phẩm khỏi giỏ hàng!",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa sản phẩm khỏi giỏ hàng: " + error.message,
    });
  }
});

// Xóa toàn bộ giỏ hàng
exports.clearCart = asyncHandler(async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: "Đã xóa toàn bộ giỏ hàng!",
      cart: { items: [] },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa giỏ hàng: " + error.message,
    });
  }
});
