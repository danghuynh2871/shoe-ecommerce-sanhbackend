<template>
  <div class="edit-product-container">
    <h2>Sửa sản phẩm</h2>

    <!-- Loading indicator -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>{{ loadingMessage }}</p>
    </div>

    <!-- Error message -->
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
      <button v-if="productId" @click="fetchProduct" class="btn retry">
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
        <button type="submit" class="btn-primary">Cập nhật sản phẩm</button>
        <button type="button" @click="deleteProduct" class="btn-delete">Xóa sản phẩm</button>
      </div>
    </form>
  </div>
</template>

<script>
import productService from "@/services/productService";

export default {
  name: "EditProduct",
  data() {
    return {
      productId: "",
      productName: "",
      productPrice: "",
      productImageUrl: "",
      productType: "",
      productBrand: "",
      productStock: "",
      productSize: "",
      productSizes: [],
      productInfo: "",
      loading: false,
      error: null,
      loadingMessage: "Đang tải thông tin sản phẩm...",
    };
  },
  created() {
    // Kiểm tra token admin
    if (!localStorage.getItem('adminToken')) {
      this.error = "Bạn cần đăng nhập với tài khoản admin để thực hiện chức năng này";
      return;
    }
    
    const productId = this.$route.query.id;
    if (productId) {
      this.productId = productId;
      this.fetchProduct();
    } else {
      this.$router.push("/admin/products/list");
    }
  },
  methods: {
    async fetchProduct() {
      this.loading = true;
      this.error = null;
      this.loadingMessage = "Đang tải thông tin sản phẩm...";

      try {
        console.log("Đang tải thông tin sản phẩm ID:", this.productId);
        const response = await productService.getProductById(this.productId);
        console.log("Kết quả tải sản phẩm:", response);
        
        const product = response.data.product || response.data;
        console.log("Sản phẩm đang sửa:", product);

        this.productName = product.name;
        this.productPrice = product.price.toString();
        this.productImageUrl = product.image;
        this.productType = product.type || "";
        this.productBrand = product.brand || "";
        this.productStock = product.stock;
        this.productSizes = product.sizes || [];
        this.productSize = product.sizes ? product.sizes.join(", ") : product.size || "";
        this.productInfo = product.description || product.info || "";
      } catch (error) {
        console.error("Error fetching product:", error);
        this.error = "Không thể tải thông tin sản phẩm: " + (error.response?.data?.message || error.message);
      } finally {
        this.loading = false;
      }
    },
    async submitProduct() {
      this.loading = true;
      this.error = null;
      this.loadingMessage = "Đang cập nhật sản phẩm...";

      if (!this.productId) {
        this.error = "Không tìm thấy ID sản phẩm";
        this.loading = false;
        return;
      }

      try {
        // Đảm bảo token admin được gửi lên
        if (!localStorage.getItem('adminToken')) {
          throw new Error("Bạn không có quyền thực hiện chức năng này");
        }
        
        console.log("ID sản phẩm cần cập nhật:", this.productId);
        
        // Chuẩn bị dữ liệu theo định dạng API backend yêu cầu
        const productData = {
          name: this.productName,
          price: parseInt(this.productPrice),
          image: this.productImageUrl,
          type: this.productType,
          brand: this.productBrand,
          stock: parseInt(this.productStock),
          sizes: this.productSize.split(',').map(size => size.trim()),
          description: this.productInfo
        };

        console.log("Dữ liệu cập nhật:", productData);
        
        const response = await productService.updateProduct(this.productId, productData);
        console.log("Kết quả cập nhật:", response);
        
        alert('Cập nhật sản phẩm thành công!');
        this.$router.push("/admin/products/list");
      } catch (error) {
        console.error("Chi tiết lỗi cập nhật:", error);
        this.error = "Không thể cập nhật sản phẩm: " + (error.response?.data?.message || error.message);
        this.loading = false;
      }
    },
    async deleteProduct() {
      if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
        return;
      }
      
      if (!this.productId) {
        this.error = "Không tìm thấy ID sản phẩm";
        return;
      }
      
      this.loading = true;
      this.error = null;
      this.loadingMessage = "Đang xóa sản phẩm...";
      
      try {
        // Đảm bảo token admin được gửi lên
        if (!localStorage.getItem('adminToken')) {
          throw new Error("Bạn không có quyền thực hiện chức năng này");
        }
        
        console.log("ID sản phẩm cần xóa:", this.productId);
        const response = await productService.deleteProduct(this.productId);
        console.log("Kết quả xóa:", response);
        
        alert('Xóa sản phẩm thành công!');
        this.$router.push('/admin/products/list');
      } catch (error) {
        console.error('Chi tiết lỗi xóa:', error);
        this.error = 'Có lỗi xảy ra khi xóa sản phẩm: ' + (error.response?.data?.message || error.message);
        this.loading = false;
      }
    }
  },
};
</script>

<style scoped>
.edit-product-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-weight: bold;
}

.form-group {
  margin-bottom: 15px;
}

input,
textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  transition: border-color 0.3s;
  font-size: 14px;
}

input:focus,
textarea:focus {
  border-color: #3498db;
  outline: none;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

.product-img-preview {
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #eee;
}

.form-buttons {
  display: flex;
  gap: 10px;
  margin-top: 25px;
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
  font-weight: 500;
}

.btn-primary:hover {
  background: #2980b9;
}

.btn-delete {
  padding: 12px 20px;
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
  padding: 30px;
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
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
  padding: 15px;
  background: #ffdddd;
  border: 1px solid #ff9999;
  border-radius: 4px;
  margin-bottom: 20px;
  color: #e74c3c;
}

.btn.retry {
  background: #3498db;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  width: auto;
  display: inline-block;
}
</style>
