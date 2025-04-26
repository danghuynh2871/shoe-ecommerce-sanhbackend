const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// GET /products
router.get("/", productController.getAllProducts);
// GET /products/:id
router.get("/:id", productController.getProductById);
// POST /products
router.post("/add", productController.createProduct);
// PUT /products/:id
router.put("/update/:id", productController.updateProduct);
// DELETE /products/:id
router.delete("/remove/:id", productController.deleteProduct);

module.exports = router;
