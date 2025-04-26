<template>
  <div class="product-detail-container">
    <div v-if="loading" class="loading">Đang tải thông tin sản phẩm...</div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    <div v-else class="product-detail">
      <div class="product-images">
        <div class="main-image">
          <img :src="product.image" :alt="product.name" />
        </div>
      </div>

      <div class="product-info">
        <h1 class="product-title">{{ product.name }}</h1>

        <div class="product-specs" v-if="product.type || product.brand">
          <p>
            <span v-if="product.type"
              ><strong>Loại:</strong> {{ product.type }}</span
            >
            <span v-if="product.type && product.brand">, </span>
            <span v-if="product.brand"
              ><strong>Thương hiệu:</strong> {{ product.brand }}</span
            >
          </p>
        </div>

        <div class="product-description" v-if="product.description">
          {{ product.description }}
        </div>

        <div class="product-sold">Đã bán: {{ product.sold || 0 }}</div>

        <div class="product-price">
          Giá: <span class="price-value">{{ formatPrice(product.price) }}</span>
        </div>

        <div class="product-options">
          <div class="option-group">
            <label>Kích thước:</label>
            <select v-model="selectedSize">
              <option value="" disabled selected>Chọn kích thước</option>
              <option v-for="size in product.sizes" :key="size" :value="size">
                {{ size }}
              </option>
            </select>
          </div>
        </div>

        <div class="product-stock">Số lượng còn: {{ product.stock || 0 }}</div>

        <div class="quantity-selector">
          <label>Số lượng mua:</label>
          <div class="quantity-controls">
            <button @click="decreaseQuantity" :disabled="quantity <= 1">
              -
            </button>
            <input
              type="number"
              v-model.number="quantity"
              min="1"
              :max="product.stock"
            />
            <button
              @click="increaseQuantity"
              :disabled="quantity >= product.stock"
            >
              +
            </button>
          </div>
        </div>

        <div class="product-actions">
          <button
            class="add-to-cart-btn"
            @click="addToCart"
            
          >
            Thêm Vào Giỏ Hàng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import productService from "../services/productService";
import cartService from "../services/cartService";

export default {
  name: "ProductDetail",
  props: {
    productId: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      product: null,
      loading: true,
      error: null,
      quantity: 1,
      selectedSize: "",
    };
  },
  computed: {
    canAddToCart() {
      return (
        this.product &&
        this.product.stock > 0 &&
        this.quantity > 0 &&
        this.quantity <= this.product.stock &&
        this.selectedSize
      );
    },
    productIdFromRoute() {
      return this.productId || this.$route.params.id;
    },
  },
  created() {
    this.fetchProductDetails();
  },
  methods: {
    async fetchProductDetails() {
      this.loading = true;
      const id = this.productIdFromRoute;
      console.log("Fetching product with ID:", id);

      if (!id) {
        this.error = "ID sản phẩm không hợp lệ";
        this.loading = false;
        return;
      }

      try {
        const response = await productService.getProductById(id);
        this.product = response.data.product;
        console.log("Product data:", this.product);

        this.loading = false;
      } catch (error) {
        console.error("Error fetching product:", error);
        this.error =
          "Không thể tải thông tin sản phẩm: " +
          (error.response?.data?.message || error.message);
        this.loading = false;
      }
    },
    formatPrice(price) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      })
        .format(price)
        .replace("₫", "đ");
    },
    increaseQuantity() {
      if (this.quantity < this.product.stock) {
        this.quantity++;
      }
    },
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    },
    async addToCart() {
      if (!this.canAddToCart) {
        if (!this.selectedSize) {
          alert("Vui lòng chọn kích thước trước khi thêm vào giỏ hàng!");
          return;
        }
        if (this.quantity <= 0 || this.quantity > this.product.stock) {
          alert("Vui lòng chọn số lượng hợp lệ!");
          return;
        }
        return;
      }

      // Kiểm tra xem người dùng đã đăng nhập chưa
      const token = localStorage.getItem('token');
      if (!token) {
        const confirmLogin = confirm("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng. Chuyển đến trang đăng nhập?");
        if (confirmLogin) {
          this.$router.push(`/login?redirect=/products/${this.product._id}`);
        }
        return;
      }

      try {
        // Hiển thị thông báo đang xử lý
        const addingBtn = document.querySelector('.add-to-cart-btn');
        const originalText = addingBtn.textContent;
        addingBtn.disabled = true;
        addingBtn.textContent = "Đang thêm...";

        // Chuẩn bị dữ liệu sản phẩm để thêm vào giỏ hàng
        const cartItem = {
          productId: this.product._id,
          quantity: this.quantity,
          size: this.selectedSize
        };

        console.log('Sending to cart API:', JSON.stringify(cartItem));
        
        const response = await cartService.addToCart(cartItem);
        console.log('Add to cart response:', response.data);
        
        // Hiển thị thông báo thành công
        alert(`Đã thêm ${this.product.name} vào giỏ hàng!`);
        
        // Khôi phục nút
        addingBtn.disabled = false;
        addingBtn.textContent = originalText;
      } catch (error) {
        console.error('Add to cart error:', error);
        
        let errorMessage = "Không thể thêm sản phẩm vào giỏ hàng: ";
        
        if (error.response) {
          console.error('Response error:', error.response.status, error.response.data);
          if (error.response.status === 401) {
            errorMessage = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
            alert(errorMessage);
            localStorage.removeItem('token'); // Clear invalid token
            this.$router.push('/login');
            return;
          } else {
            errorMessage += error.response.data?.message || `Lỗi máy chủ (${error.response.status})`;
          }
        } else if (error.request) {
          console.error('Request error:', error.request);
          errorMessage += "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.";
        } else {
          errorMessage += error.message;
        }
        
        alert(errorMessage);
        
        // Khôi phục nút
        const addingBtn = document.querySelector('.add-to-cart-btn');
        if (addingBtn) {
          addingBtn.disabled = false;
          addingBtn.textContent = "Thêm Vào Giỏ Hàng";
        }
      }
    },
  },
};
</script>

<style scoped>
.product-detail-container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
}

.loading,
.error {
  text-align: center;
  padding: 60px;
  font-size: 18px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.error {
  color: #f44336;
  background-color: #ffebee;
}

.product-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 30px;
}

.product-images {
  position: relative;
}

.main-image {
  position: relative;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.main-image img {
  width: 100%;
  height: 500px;
  object-fit: cover;
  display: block;
}

.image-controls {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.control-btn {
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 0 15px;
  transition: background 0.3s ease;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.9);
}

.image-indicators {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #ddd;
  margin: 0 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.indicator.active {
  background-color: #ff6f61;
}

.product-info {
  display: flex;
  flex-direction: column;
  padding-right: 10px;
}

.product-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #333;
  line-height: 1.3;
}

.product-specs {
  margin-bottom: 20px;
  font-size: 15px;
  color: #555;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.product-description {
  color: #555;
  margin-bottom: 25px;
  line-height: 1.6;
  font-size: 15px;
}

.product-sold {
  color: #666;
  margin-bottom: 15px;
  font-size: 15px;
  display: flex;
  align-items: center;
}

.product-sold::before {
  content: "";
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #ff6f61;
  border-radius: 50%;
  margin-right: 8px;
}

.product-price {
  font-size: 18px;
  margin-bottom: 25px;
  color: #333;
  padding: 15px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.price-value {
  color: #ff6f61;
  font-weight: 600;
  font-size: 26px;
  margin-left: 5px;
}

.product-options {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 25px;
}

.option-group {
  display: flex;
  align-items: center;
}

.option-group label {
  min-width: 120px;
  font-weight: 500;
  font-size: 16px;
  color: #444;
}

.option-group select {
  padding: 12px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  min-width: 220px;
  font-size: 15px;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.option-group select:focus {
  border-color: #ff6f61;
  outline: none;
  box-shadow: 0 0 0 2px rgba(255, 111, 97, 0.2);
}

.product-stock {
  margin-bottom: 25px;
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

.quantity-selector {
  display: flex;
  align-items: center;
  margin-bottom: 35px;
}

.quantity-selector label {
  min-width: 120px;
  font-weight: 500;
  font-size: 16px;
  color: #444;
}

.quantity-controls {
  display: flex;
  align-items: center;
}

.quantity-controls button {
  width: 40px;
  height: 40px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.quantity-controls button:hover:not(:disabled) {
  background-color: #eaeaea;
}

.quantity-controls button:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.quantity-controls input {
  width: 60px;
  height: 40px;
  border: 1px solid #e0e0e0;
  text-align: center;
  font-size: 16px;
  margin: 0 8px;
  border-radius: 4px;
}

.product-actions {
  margin-top: 15px;
}

.add-to-cart-btn {
  background-color: #ff6f61;
  color: white;
  padding: 16px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 6px rgba(255, 111, 97, 0.3);
}

.add-to-cart-btn:hover:not(:disabled) {
  background-color: #e65d50;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(255, 111, 97, 0.4);
}

.add-to-cart-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(255, 111, 97, 0.3);
}

.add-to-cart-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  box-shadow: none;
}

@media (max-width: 768px) {
  .product-detail-container {
    margin: 20px auto;
  }
  
  .product-detail {
    grid-template-columns: 1fr;
    gap: 30px;
    padding: 20px;
  }

  .main-image img {
    height: 350px;
  }
  
  .option-group,
  .quantity-selector {
    flex-direction: column;
    align-items: flex-start;
  }

  .option-group label,
  .quantity-selector label {
    margin-bottom: 10px;
  }

  .quantity-controls {
    width: 100%;
    justify-content: flex-start;
  }
  
  .option-group select {
    width: 100%;
    min-width: unset;
  }
}
</style>
