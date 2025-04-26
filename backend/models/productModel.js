const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, "Tên sản phẩm là bắt buộc"],
      trim: true,
      maxlength: [100, "Tên sản phẩm không được vượt quá 100 ký tự"]
    },
    description: { 
      type: String,
      trim: true 
    },
    price: { 
      type: Number, 
      required: [true, "Giá sản phẩm là bắt buộc"],
      min: [0, "Giá sản phẩm không được âm"] 
    },
    image: { 
      type: String,
      default: ""
    },
    type: { 
      type: String,
      trim: true 
    },
    brand: { 
      type: String,
      trim: true
    },
    sizes: [String],
    stock: { 
      type: Number, 
      required: [true, "Số lượng tồn kho là bắt buộc"],
      default: 0,
      min: [0, "Số lượng tồn kho không được âm"] 
    },
    sold: { 
      type: Number, 
      default: 0,
      min: [0, "Số lượng đã bán không được âm"]
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
