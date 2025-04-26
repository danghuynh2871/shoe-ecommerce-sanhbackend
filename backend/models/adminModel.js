const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "admin",
    }
  },
  { timestamps: true }
);

// Mã hóa mật khẩu trước khi lưu
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Tạo tài khoản admin mặc định
adminSchema.statics.createDefaultAdmin = async function () {
  try {
    const adminExists = await this.findOne({ email: "admin@gmail.com" });
    if (!adminExists) {
      await this.create({
        email: "admin@gmail.com",
        password: "Admin123",
        fullname: "Quản trị hệ thống",
      });
      console.log("Tạo tài khoản admin mặc định thành công!");
    }
  } catch (error) {
    console.error("Lỗi khi tạo admin:", error);
  }
};

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
