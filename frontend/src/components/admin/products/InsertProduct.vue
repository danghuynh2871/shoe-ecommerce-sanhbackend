<template>
  <div class="insert-product-container">
    <h2>{{ isEditMode ? "Sửa sản phẩm" : "Thêm sản phẩm mới" }}</h2>

    <!-- Loading indicator -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>
        {{ isEditMode ? "Đang tải thông tin sản phẩm..." : "Đang xử lý..." }}
      </p>
    </div>

    <!-- Error message -->
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
      <button
        v-if="isEditMode"
        @click="fetchProduct(productId)"
        class="btn retry"
      >
        Thử lại
      </button>
    </div>

    <form v-if="!loading && !error" @submit.prevent="submitProduct">
      <div class="form-group">
        <input
          type="text"
          id="productName"
          v-model="productName"
          placeholder="Tên sản phẩm"
          required
        />
      </div>
      <div class="form-group">
        <input
          type="number"
          id="productPrice"
          v-model="productPrice"
          placeholder="Giá sản phẩm"
          required
        />
      </div>
      <div class="form-group">
        <input
          type="text"
          id="productImage"
          v-model="productImageUrl"
          placeholder="Đường dẫn hình ảnh"
          required
        />
        <img
          v-if="productImageUrl"
          :src="productImageUrl"
          alt="Product Image"
          class="product-img-preview"
        />
      </div>
      <div class="form-group">
        <input
          type="text"
          id="productType"
          v-model="productType"
          placeholder="Loại"
          required
        />
      </div>
      <div class="form-group">
        <input
          type="text"
          id="productBrand"
          v-model="productBrand"
          placeholder="Hãng"
          required
        />
      </div>
      <div class="form-group">
        <input
          type="number"
          id="productStock"
          v-model="productStock"
          placeholder="Số lượng"
          required
        />
      </div>
      <div class="form-group">
        <input
          type="text"
          id="productSize"
          v-model="productSize"
          placeholder="Kích thước"
          required
        />
      </div>
      <div class="form-group">
        <textarea
          id="productInfo"
          v-model="productInfo"
          placeholder="Mô tả"
          required
        ></textarea>
      </div>
      <div class="form-buttons">
        <button type="submit" class="btn-primary">
          {{ isEditMode ? "Cập nhật" : "Thêm sản phẩm" }}
        </button>
        <button
          v-if="isEditMode"
          type="button"
          @click="deleteProduct"
          class="btn-delete"
        >
          Xóa sản phẩm
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import productService from "@/services/productService";

export default {
  name: "InsertProduct",
  data() {
    return {
      productName: "",
      productPrice: "",
      productImageUrl: "",
      productType: "",
      productBrand: "",
      productStock: "",
      productSize: "",
      productInfo: "",
      isEditMode: false,
      loading: false,
      error: null,
    };
  },
  async created() {
    // Kiểm tra xem có phải là chế độ sửa không
    const productId = this.$route.query.id;
    if (productId) {
      this.isEditMode = true;
      this.productId = productId;
      await this.fetchProduct(productId);
    }
  },
  methods: {
    async fetchProduct(id) {
      this.loading = true;
      this.error = null;

      try {
        const response = await productService.getProductById(id);
        const product = response.data;

        // Điền thông tin sản phẩm vào form
        this.productName = product.name;
        this.productPrice = product.price.toString().replace(/[đ,.]/g, "");
        this.productImageUrl = product.image;
        this.productType = product.type || "";
        this.productBrand = product.brand || "";
        this.productStock = product.stock;
        this.productSize = product.size;
        this.productInfo = product.info;
      } catch (error) {
        console.error("Error fetching product:", error);
        this.error = "Không thể tải thông tin sản phẩm";
      } finally {
        this.loading = false;
      }
    },
    async submitProduct() {
      this.loading = true;
      this.error = null;

      try {
        // Chuẩn bị dữ liệu sản phẩm
        const productData = {
          name: this.productName,
          price: parseInt(this.productPrice),
          image: this.productImageUrl,
          type: this.productType,
          brand: this.productBrand,
          stock: parseInt(this.productStock),
          sizes: this.productSize.split(",").map((size) => size.trim()),
          description: this.productInfo,
        };

        if (this.isEditMode) {
          // Cập nhật sản phẩm
          await productService.updateProduct(this.productId, productData);
          alert("Cập nhật sản phẩm thành công!");
        } else {
          // Tạo sản phẩm mới
          await productService.createProduct(productData);
          alert("Thêm sản phẩm mới thành công!");
        }

        // Chuyển về trang danh sách sản phẩm
        this.$router.push("/admin/products/list");
      } catch (error) {
        console.error("Error saving product:", error);
        this.error =
          "Có lỗi xảy ra khi lưu sản phẩm: " +
          (error.response?.data?.message || error.message);
      } finally {
        this.loading = false;
      }
    },
    async deleteProduct() {
      if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        await productService.deleteProduct(this.productId);
        alert("Xóa sản phẩm thành công!");
        this.$router.push("/admin/products/list");
      } catch (error) {
        console.error("Error deleting product:", error);
        this.error =
          "Có lỗi xảy ra khi xóa sản phẩm: " +
          (error.response?.data?.message || error.message);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.insert-product-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

input,
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

input:focus,
textarea:focus {
  border-color: #3498db;
}

.product-img-preview {
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-top: 10px;
  border-radius: 4px;
}

.form-buttons {
  display: flex;
  gap: 10px;
}

.btn-primary {
  flex: 1;
  padding: 12px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
}

.btn-primary:hover {
  background: #2980b9;
}

.btn-delete {
  padding: 12px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
}

.btn-delete:hover {
  background: #c0392b;
}

.loading-container {
  text-align: center;
  padding: 20px;
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-message {
  text-align: center;
  padding: 20px;
  background: #ffdddd;
  border: 1px solid #ff9999;
  border-radius: 4px;
  margin-bottom: 20px;
}

.btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn:hover {
  background: #2980b9;
}

.btn.retry {
  background: #ff9999;
}

.btn.retry:hover {
  background: #ff6666;
}
</style>
