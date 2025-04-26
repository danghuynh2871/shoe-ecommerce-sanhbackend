require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI không được định nghĩa");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB đã kết nối thành công`);
  } catch (error) {
    console.error("Lỗi kết nối MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
