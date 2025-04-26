const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");

exports.getAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort("-createdAt");
    
    res.status(200).json({
      success: true,
      count: products.length,
      products
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
        message: "Không tìm thấy sản phẩm"
      });
    }
    
    res.status(200).json({
      success: true,
      product
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
    const {
      name,
      description,
      price,
      image,
      type,
      brand,
      sizes,
      stock
    } = req.body;

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
      } else if (typeof sizes === 'string') {
        sizesArray = sizes.split(',').map(size => size.trim());
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
      sold: 0
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Sản phẩm được tạo thành công",
      product: newProduct,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo sản phẩm: " + error.message,
    });
  }
});

exports.updateProduct = asyncHandler(async (req, res) => {
  try {
    const productId = req.params.id;
    const {
      name,
      description,
      price,
      image,
      type,
      brand,
      sizes,
      stock,
      sold
    } = req.body;

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
      } else if (typeof sizes === 'string') {
        sizesArray = sizes.split(',').map(size => size.trim());
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
      message: "Sản phẩm được cập nhật thành công",
      product: updatedProduct,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
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
      message: "Sản phẩm đã được xóa thành công"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa sản phẩm: " + error.message,
    });
  }
});
