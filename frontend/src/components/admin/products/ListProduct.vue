<template>
  <div class="product-management">
    <h2>QUẢN LÝ SẢN PHẨM</h2>
    
    <!-- Loading indicator -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Đang tải dữ liệu...</p>
    </div>
    
    <!-- Error message -->
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="fetchProducts" class="btn retry">Thử lại</button>
    </div>
    
    <div v-if="!loading && !error">
      <div class="search-bar">
        <input type="text" v-model="searchQuery" placeholder="Tìm sản phẩm..." />
      </div>
      <div class="product-list">
        <table>
          <thead>
            <tr>
              <th>Mã sản phẩm</th>
              <th>Ảnh</th>
              <th>Tên</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Kích cỡ</th>
              <th>Mô tả</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in filteredProducts" :key="product._id">
              <td>{{ product._id }}</td>
              <td>
                <img :src="product.image" :alt="product.name" class="product-img">
              </td>
              <td>{{ product.name }}</td>
              <td>{{ product.price.toLocaleString('vi-VN') }} đ</td>
              <td>{{ product.stock }}</td>
              <td>{{ product.sizes ? product.sizes.join(', ') : '' }}</td>
              <td>{{ product.description ? (product.description.length > 50 ? product.description.substring(0, 50) + '...' : product.description) : '' }}</td>
              <td>
                <button class="btn edit" @click="editProduct(product)">Sửa</button>
                <button class="btn delete" @click="confirmDelete(product._id)">Xóa</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="total-products">
          Tổng số lượng sản phẩm: {{ products.length }}
        </div>
      </div>
    </div>

    <!-- Modal for confirmation -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <p>Bạn có chắc chắn muốn xóa sản phẩm này không?</p>
        <div class="modal-buttons">
          <button class="btn delete" @click="deleteProduct">Xóa</button>
          <button class="btn cancel" @click="closeModal">Không</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import productService from '@/services/productService';

export default {
  name: 'ListProduct',
  data() {
    return {
      searchQuery: '',
      products: [],
      showModal: false,
      productIdToDelete: null,
      loading: false,
      error: null
    }
  },
  created() {
    this.fetchProducts();
  },
  computed: {
    filteredProducts() {
      return this.products.filter(product => {
        const query = this.searchQuery.toLowerCase();
        return (
          product.name.toLowerCase().includes(query) ||
          (product._id && product._id.toLowerCase().includes(query))
        );
      });
    }
  },
  methods: {
    async fetchProducts() {
      this.loading = true;
      try {
        const response = await productService.getAllProducts();
        // Lấy dữ liệu sản phẩm từ response
        if (response.data && response.data.products) {
          this.products = response.data.products;
        } else {
          this.products = response.data; // Nếu API trả về trực tiếp mảng sản phẩm
        }
        console.log("Dữ liệu sản phẩm:", this.products);
      } catch (error) {
        this.error = 'Có lỗi khi tải dữ liệu sản phẩm';
        console.error('Error fetching products:', error);
      } finally {
        this.loading = false;
      }
    },
    navigateToInsert() {
      this.$router.push('/admin/products/insert');
    },
    editProduct(product) {
      this.$router.push({
        path: '/admin/products/edit',
        query: { id: product._id } // Sử dụng _id thay vì id
      });
    },
    confirmDelete(productId) {
      this.productIdToDelete = productId;
      this.showModal = true;
    },
    async deleteProduct() {
      try {
        await productService.deleteProduct(this.productIdToDelete);
        // Sau khi xóa thành công, cập nhật lại danh sách sản phẩm
        this.products = this.products.filter(product => product._id !== this.productIdToDelete);
        this.closeModal();
      } catch (error) {
        console.error('Error deleting product:', error);
        this.error = 'Có lỗi khi xóa sản phẩm';
      }
    },
    closeModal() {
      this.showModal = false;
      this.productIdToDelete = null;
    }
  }
}
</script>

<style scoped>
.product-management {
  padding: 20px;
  max-width: 100%;
  margin: 0 auto;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  font-weight: bold;
}

.search-bar {
  margin-bottom: 20px;
  text-align: right;
}

.search-bar input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 300px;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.product-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

th, td {
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #ddd;
  vertical-align: middle;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

th {
  background: #f8f9fa;
  font-size: 14px;
}

td {
  max-width: 150px;
  font-size: 14px;
}

/* Specific width for quantity column */
tr td:nth-child(5) {
  width: 80px;
}

/* Specific width for action column */
tr td:nth-child(8) {
  width: 120px;
  white-space: nowrap;
}

.btn {
  padding: 5px 10px;
  margin: 0 2px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  display: inline-block;
}

.btn.edit {
  background: #3498db;
  color: white;
}

.btn.delete {
  background: #e74c3c;
  color: white;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 300px;
}

.modal-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.btn.cancel {
  background: #95a5a6;
  color: white;
}

.total-products {
  margin-top: 20px;
  font-weight: bold;
  text-align: right;
  padding-right: 10px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  margin-top: 20px;
  text-align: center;
  color: #e74c3c;
}

.btn.retry {
  background: #3498db;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>