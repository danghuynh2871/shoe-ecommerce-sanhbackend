const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Số lượng phải lớn hơn 0"],
  },
  size: {
    type: String,
    required: false
  }
});

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    cartSummary: {
      subTotal: { type: Number, default: 0 },
      vat: { type: Number, default: 0 },
      totalAmount: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Phương thức tính toán giá trị giỏ hàng
cartSchema.methods.calculateTotals = async function () {
  const VAT_RATE = 0.1; // 10%

  if (this.items.length === 0) {
    this.cartSummary = {
      subTotal: 0,
      vat: 0,
      totalAmount: 0,
    };
    return;
  }

  await this.populate("items.productId", "price");

  const subTotal = this.items.reduce(
    (total, item) => total + item.productId.price * item.quantity,
    0
  );

  this.cartSummary = {
    subTotal,
    vat: subTotal * VAT_RATE,
    totalAmount: subTotal * (1 + VAT_RATE),
  };
};

// Middleware tự động tính toán trước khi lưu
cartSchema.pre("save", async function (next) {
  await this.calculateTotals();
  next();
});

module.exports = mongoose.model("Cart", cartSchema);
