const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const Admin = require("./models/adminModel");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// CORS
app.use(cors());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", orderRoutes);
// Admin routes
app.use("/api/admin", adminRoutes);

// Tạo admin mặc định khi kết nối DB thành công
connectDB().then(() => {
  Admin.createDefaultAdmin();
});

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
