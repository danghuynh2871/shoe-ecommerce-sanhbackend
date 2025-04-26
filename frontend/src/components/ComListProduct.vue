<template>
  <div class="products-container">
    <!-- Filter Sidebar -->
    <div class="filters-sidebar">
      <h3>Bộ lọc sản phẩm</h3>

      <!-- Tìm kiếm theo tên -->
      <div class="filter-section">
        <h4>Tìm kiếm</h4>
        <div class="search-box">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Tên sản phẩm..."
          />
          <i class="fas fa-search"></i>
        </div>
      </div>

      <!-- Lọc theo giá -->
      <div class="filter-section">
        <h4>Sắp xếp theo giá</h4>
        <select v-model="priceSort">
          <option value="">Mặc định</option>
          <option value="asc">Giá thấp đến cao</option>
          <option value="desc">Giá cao đến thấp</option>
        </select>
      </div>

      <!-- Lọc theo hãng -->
      <div class="filter-section">
        <h4>Thương hiệu</h4>
        <div class="brand-filters">
          <label v-for="brand in brands" :key="brand">
            <input type="checkbox" v-model="selectedBrands" :value="brand" />
            {{ brand }}
          </label>
        </div>
      </div>

      <!-- Lọc theo kích cỡ -->
      <div class="filter-section">
        <h4>Kích cỡ</h4>
        <div class="size-filters">
          <button
            v-for="size in sizes"
            :key="size"
            :class="{ active: selectedSizes.includes(size) }"
            @click="toggleSize(size)"
          >
            {{ size }}
          </button>
        </div>
      </div>

      <button class="clear-filters" @click="clearFilters">Xóa bộ lọc</button>
    </div>

    <!-- Products Grid -->
    <div class="products-grid">
      <div class="products-header">
        <h2>Danh sách sản phẩm</h2>
        <p>Hiển thị {{ filteredProducts.length }} sản phẩm</p>
      </div>

      <div v-if="loading" class="loading">Đang tải dữ liệu sản phẩm...</div>
      <div v-else-if="error" class="error">
        {{ error }}
      </div>
      <div v-else class="products-list">
        <router-link 
          v-for="product in filteredProducts"
          :key="product._id"
          :to="`/products/${product._id}`"
          class="product-card"
        >
          <img :src="product.image" :alt="product.name" class="product-image" />
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p class="brand" v-if="product.brand">{{ product.brand }}</p>
            <p class="price">{{ formatPrice(product.price) }}</p>
            <p class="stock" v-if="product.stock > 0">Còn {{ product.stock }} sản phẩm</p>
            <p class="stock out-of-stock" v-else>Hết hàng</p>
            <button class="view-details-btn">Xem chi tiết</button>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import productService from "../services/productService";
import cartService from "../services/cartService";

export default {
  name: "ComListProduct",
  data() {
    return {
      searchQuery: "",
      priceSort: "",
      selectedBrands: [],
      selectedSizes: [],
      selectedProductSizes: {}, // Lưu kích cỡ được chọn cho từng sản phẩm
      brands: [],
      sizes: [],
      products: [],
      loading: true,
      error: null,
    };
  },
  computed: {
    filteredProducts() {
      if (this.products.length === 0) {
        return [];
      }

      let result = [...this.products];

      // Lọc theo tên
      if (this.searchQuery) {
        result = result.filter((product) =>
          product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }

      // Lọc theo thương hiệu
      if (this.selectedBrands.length) {
        result = result.filter((product) =>
          this.selectedBrands.includes(product.brand)
        );
      }

      // Lọc theo kích cỡ
      if (this.selectedSizes.length) {
        result = result.filter((product) =>
          product.sizes.some((size) => this.selectedSizes.includes(size))
        );
      }

      // Sắp xếp theo giá
      if (this.priceSort) {
        result.sort((a, b) => {
          if (this.priceSort === "asc") {
            return a.price - b.price;
          } else {
            return b.price - a.price;
          }
        });
      }

      return result;
    },
  },
  created() {
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      this.loading = true;
      try {
        const response = await productService.getAllProducts();
        this.products = response.data.products;

        // Trích xuất danh sách thương hiệu và kích cỡ duy nhất từ dữ liệu
        this.extractBrandsAndSizes();

        this.loading = false;
      } catch (error) {
        this.error =
          "Không thể tải danh sách sản phẩm: " +
          (error.response?.data?.message || error.message);
        this.loading = false;
      }
    },
    extractBrandsAndSizes() {
      // Lấy tất cả các thương hiệu duy nhất
      const allBrands = this.products
        .map((product) => product.brand)
        .filter((brand) => brand); // Lọc ra các giá trị null/undefined
      this.brands = [...new Set(allBrands)]; // Loại bỏ các giá trị trùng lặp

      // Lấy tất cả các kích cỡ duy nhất
      const allSizes = this.products
        .flatMap((product) => product.sizes || [])
        .filter((size) => size); // Lọc ra các giá trị null/undefined
      this.sizes = [...new Set(allSizes)].sort((a, b) => a - b); // Sắp xếp theo thứ tự tăng dần
    },
    formatPrice(price) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);
    },
    toggleSize(size) {
      const index = this.selectedSizes.indexOf(size);
      if (index === -1) {
        this.selectedSizes.push(size);
      } else {
        this.selectedSizes.splice(index, 1);
      }
    },
    selectSize(productId, size) {
      this.selectedProductSizes[productId] = size;
    },
    clearFilters() {
      this.searchQuery = "";
      this.priceSort = "";
      this.selectedBrands = [];
      this.selectedSizes = [];
    },
    canAddToCart(product) {
      // Kiểm tra xem sản phẩm có kích cỡ và đã chọn kích cỡ chưa
      if (product.sizes && product.sizes.length > 0) {
        return this.selectedProductSizes[product._id] !== undefined;
      }
      // Nếu sản phẩm không có kích cỡ, luôn có thể thêm vào giỏ hàng
      return true;
    },
    async addToCart(product) {
      if (!this.canAddToCart(product)) {
        alert("Vui lòng chọn kích cỡ!");
        return;
      }

      try {
        // Chuẩn bị dữ liệu để thêm vào giỏ hàng
        const cartItem = {
          productId: product._id,
          quantity: 1,
        };

        // Nếu có kích cỡ được chọn, thêm vào dữ liệu
        if (this.selectedProductSizes[product._id]) {
          cartItem.size = this.selectedProductSizes[product._id];
        }

        // Gọi API thêm vào giỏ hàng
        await cartService.addToCart(cartItem);

        // Thông báo thành công
        alert(`Đã thêm ${product.name} vào giỏ hàng!`);
      } catch (error) {
        alert(
          "Không thể thêm sản phẩm vào giỏ hàng: " +
            (error.response?.data?.message || error.message)
        );
      }
    },
  },
};
</script>

<style scoped>
.products-container {
  display: grid;
  grid-template-columns: 250px 1fr; /* Sidebar 250px, content 1fr */
  gap: 20px;
  padding-top: 30px;
  width: 100%;
  margin-bottom: 40px;
}

.filters-sidebar {
  background: white;
  padding: 15px;
  border-radius: 0;
  box-shadow: none;
  height: 100%;
  border-right: 1px solid #eee;
}

.products-grid {
  background: white;
  padding: 20px 30px;
  border-radius: 0;
  box-shadow: none;
}

.products-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 25px;
}

.filter-section {
  margin-bottom: 25px;
}

.filter-section h4 {
  margin-bottom: 15px;
  color: #333;
}

.search-box {
  position: relative;
}

.search-box input {
  width: 100%;
  padding: 10px 0px 10px 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.search-box i {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: white;
}

.brand-filters {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.brand-filters label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.size-filters {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.size-filters button {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.size-filters button.active {
  background: #ff6f61;
  color: white;
  border-color: #ff6f61;
}

.clear-filters {
  width: 100%;
  padding: 10px;
  background: #f5f5f5;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.clear-filters:hover {
  background: #e0e0e0;
}

.products-header {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-card {
  border: 1px solid #eee;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: white;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-info {
  padding: 15px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-info h3 {
  margin: 0 0 10px 0;
  font-size: 1.1em;
  color: #333;
}

.brand {
  color: #666;
  margin-bottom: 5px;
  font-size: 0.9em;
}

.price {
  color: #ff6f61;
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 1.1em;
}

.stock {
  color: #666;
  font-size: 0.9em;
  margin-top: auto;
  margin-bottom: 10px;
}

.out-of-stock {
  color: #f44336;
  font-weight: bold;
}

.view-details-btn {
  background-color: #ff6f61;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  margin-top: 10px;
  transition: background-color 0.3s ease;
}

.view-details-btn:hover {
  background-color: #ff5546;
}

.loading,
.error {
  text-align: center;
  padding: 20px;
  grid-column: 1 / -1;
}

.error {
  color: red;
}

@media (max-width: 768px) {
  .products-container {
    grid-template-columns: 1fr;
  }

  .filters-sidebar {
    position: fixed;
    top: 0;
    left: -100%;
    width: 80%;
    height: 100vh;
    z-index: 1000;
    transition: 0.3s;
  }

  .products-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .products-list {
    grid-template-columns: 1fr;
  }
}
</style>
