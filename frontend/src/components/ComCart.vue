<template>
  <div class="cart-container">
    <div class="cart-header">
      <h1>Giỏ hàng của bạn</h1>
      <p v-if="loading" class="loading-message">Đang tải giỏ hàng...</p>
      <p v-else-if="error" class="error-message">{{ error }}</p>
      <p v-else-if="cartItems.length === 0" class="empty-cart">
        Giỏ hàng trống. <router-link to="/products">Tiếp tục mua sắm</router-link>
      </p>
    </div>

    <div v-if="!loading && !error && cartItems.length > 0" class="cart-content">
      <div class="cart-items">
        <div class="select-all-container">
          <input 
            type="checkbox" 
            id="select-all" 
            :checked="allItemsSelected" 
            @change="toggleSelectAll"
          >
          <label for="select-all">Chọn tất cả sản phẩm</label>
        </div>
        
        <div v-for="item in cartItems" :key="item.productId" class="cart-item">
          <div class="item-select">
            <input 
              type="checkbox" 
              :id="`item-${item.productId}`" 
              v-model="item.selected" 
              @change="updateCartSummary"
            >
          </div>
          <div class="item-image">
            <img :src="item.image" :alt="item.name">
          </div>
          <div class="item-details">
            <h3>{{ item.name }}</h3>
            <p class="item-size" v-if="item.size">Size: {{ item.size }}</p>
            <p class="item-price">{{ formatPrice(item.price) }}</p>
          </div>
          <div class="item-quantity">
            <button @click="decreaseQuantity(item)" :disabled="item.quantity <= 1 || updating">-</button>
            <span>{{ item.quantity }}</span>
            <button @click="increaseQuantity(item)" :disabled="updating">+</button>
          </div>
          <div class="item-total">
            {{ formatPrice(item.price * item.quantity) }}
          </div>
          <button class="remove-item" @click="removeItem(item)" :disabled="updating">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div class="cart-summary">
        <h2>Tổng giỏ hàng</h2>
        <div class="summary-row">
          <span>Tạm tính:</span>
          <span>{{ formatPrice(subtotal) }}</span>
        </div>
        <div class="summary-row">
          <span>VAT (10%):</span>
          <span>{{ formatPrice(vat) }}</span>
        </div>
        <div class="summary-row total">
          <span>Tổng cộng:</span>
          <span>{{ formatPrice(total) }}</span>
        </div>
        <button class="checkout-btn" @click="checkout" :disabled="checkoutLoading || !hasSelectedItems">
          <span v-if="checkoutLoading">Đang xử lý...</span>
          <span v-else>Tiến hành thanh toán</span>
        </button>
        <router-link to="/products" class="continue-shopping">
          <i class="fas fa-arrow-left"></i> Tiếp tục mua sắm
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import cartService from '../services/cartService';
import authService from '../services/authService';

export default {
  name: 'ComCart',
  data() {
    return {
      cartItems: [],
      loading: true,
      updating: false,
      checkoutLoading: false,
      error: null
    }
  },
  computed: {
    subtotal() {
      return this.cartItems
        .filter(item => item.selected)
        .reduce((total, item) => total + (item.price * item.quantity), 0)
    },
    vat() {
      return this.subtotal * 0.1; // 10% VAT
    },
    total() {
      return this.subtotal + this.vat;
    },
    isLoggedIn() {
      return authService.isLoggedIn();
    },
    allItemsSelected() {
      return this.cartItems.length > 0 && this.cartItems.every(item => item.selected);
    },
    hasSelectedItems() {
      return this.cartItems.some(item => item.selected);
    }
  },
  created() {
    this.fetchCartItems();
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price)
    },
    toggleSelectAll(event) {
      const isSelected = event.target.checked;
      this.cartItems.forEach(item => {
        item.selected = isSelected;
      });
      this.updateCartSummary();
    },
    updateCartSummary() {
      // This method can be used to update cart summary when selections change
      // or to sync with backend if needed
    },
    async fetchCartItems() {
      this.loading = true;
      this.error = null;
      
      try {
        // Kiểm tra đăng nhập trước khi lấy giỏ hàng
        if (!this.isLoggedIn) {
          this.cartItems = [];
          this.error = "Vui lòng đăng nhập để xem giỏ hàng";
          this.loading = false;
          return;
        }
        
        console.log('Fetching cart data from API...');
        const response = await cartService.getCart();
        console.log('Cart API response:', response.data);
        
        // Kiểm tra cấu trúc phản hồi
        if (response.data && (response.data.cart || response.data.cartItems)) {
          // Handle both response formats: {cart: {items: []}} or {cartItems: []}
          const items = response.data.cart?.items || response.data.cartItems || [];
          
          this.cartItems = items.map(item => {
            // Handle both formats of item: {productId: {_id, name, ...}} or {productId: string, product: {}}
            const product = item.productId?._id ? item.productId : item.product;
            
            return {
              productId: product._id || item.productId,
              name: product.name,
              price: product.price,
              image: product.image,
              size: item.size,
              quantity: item.quantity,
              selected: true // Default select all items
            };
          });
          console.log('Processed cart items:', this.cartItems);
        } else {
          this.cartItems = [];
          console.warn('Cart response does not contain expected data structure:', response.data);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        
        if (error.response) {
          if (error.response.status === 401) {
            // Token expired or invalid
            this.error = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
            localStorage.removeItem('token'); // Clear invalid token
            setTimeout(() => {
              this.$router.push('/login?redirect=/cart');
            }, 2000);
          } else {
            this.error = `Không thể tải giỏ hàng: ${error.response.data?.message || 'Lỗi máy chủ'}`;
          }
        } else if (error.request) {
          // Network error
          this.error = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại sau.";
        } else {
          this.error = "Không thể tải giỏ hàng: " + error.message;
        }
      } finally {
        this.loading = false;
      }
    },
    async increaseQuantity(item) {
      this.updating = true;
      try {
        await cartService.updateQuantity(item.productId, item.quantity + 1);
        item.quantity++;
        this.updateCartSummary();
      } catch (error) {
        console.error('Error updating quantity:', error);
        alert('Không thể cập nhật số lượng. Vui lòng thử lại.');
      } finally {
        this.updating = false;
      }
    },
    async decreaseQuantity(item) {
      if (item.quantity <= 1) return;
      
      this.updating = true;
      try {
        await cartService.updateQuantity(item.productId, item.quantity - 1);
        item.quantity--;
        this.updateCartSummary();
      } catch (error) {
        console.error('Error updating quantity:', error);
        alert('Không thể cập nhật số lượng. Vui lòng thử lại.');
      } finally {
        this.updating = false;
      }
    },
    async removeItem(item) {
      if (!confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) return;
      
      this.updating = true;
      try {
        await cartService.removeFromCart(item.productId);
        this.cartItems = this.cartItems.filter(i => i.productId !== item.productId);
        this.updateCartSummary();
      } catch (error) {
        console.error('Error removing item:', error);
        alert('Không thể xóa sản phẩm. Vui lòng thử lại.');
      } finally {
        this.updating = false;
      }
    },
    async checkout() {
      if (!this.hasSelectedItems) {
        alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán');
        return;
      }
      
      if (!this.isLoggedIn) {
        alert('Vui lòng đăng nhập để tiếp tục thanh toán');
        this.$router.push('/login?redirect=/checkout');
        return;
      }
      
      this.checkoutLoading = true;
      try {
        // Lưu thông tin sản phẩm đã chọn vào localStorage để sử dụng ở trang thanh toán
        localStorage.setItem('selectedItems', JSON.stringify(
          this.cartItems.filter(item => item.selected)
        ));
        localStorage.setItem('cartSummary', JSON.stringify({
          subtotal: this.subtotal,
          vat: this.vat,
          total: this.total
        }));
        
        // Chuyển hướng đến trang thanh toán
        this.$router.push('/checkout');
      } catch (error) {
        console.error('Error during checkout:', error);
        alert('Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.');
        this.checkoutLoading = false;
      }
    }
  }
}
</script>

<style scoped>
.cart-container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
}

.cart-header {
  margin-bottom: 30px;
  text-align: center;
}

.cart-header h1 {
  font-size: 2.5em;
  color: #333;
  margin-bottom: 10px;
}

.empty-cart, .loading-message {
  font-size: 1.2em;
  color: #666;
  text-align: center;
  margin-top: 20px;
}

.error-message {
  color: #e53935;
  font-size: 1.1em;
  text-align: center;
  margin-top: 20px;
}

.cart-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

@media (min-width: 768px) {
  .cart-content {
    flex-direction: row;
    align-items: flex-start;
  }
  
  .cart-items {
    flex: 1;
    margin-right: 30px;
  }
  
 .cart-summary {
    width: 350px;
  }
}

.select-all-container {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.select-all-container input {
  margin-right: 10px;
}

.cart-items {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.item-select {
  margin-right: 15px;
}

.item-image {
  width: 80px;
  height: 80px;
  margin-right: 20px;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.item-details {
  flex: 1;
}

.item-details h3 {
  margin: 0 0 5px;
  font-size: 1.1em;
}

.item-size {
  font-size: 0.9em;
  color: #666;
  margin: 5px 0;
}

.item-price {
  font-weight: bold;
  color: #e57373;
}

.item-quantity {
  display: flex;
  align-items: center;
  margin: 0 20px;
}

.item-quantity button {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background: #f5f5f5;
  font-size: 1.2em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-quantity button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.item-quantity span {
  width: 40px;
  text-align: center;
  font-weight: bold;
}

.item-total {
  font-weight: bold;
  width: 120px;
  text-align: right;
  color: #e53935;
  font-size: 1.1em;
}

.remove-item {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 1.2em;
  margin-left: 15px;
}

.remove-item:hover {
  color: #e53935;
}

.cart-summary {
  background: #fff;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.cart-summary h2 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.5em;
  color: #333;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 1.1em;
}

.summary-row.total {
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 15px;
  font-weight: bold;
  font-size: 1.2em;
  color: #e53935;
}

.checkout-btn {
  width: 100%;
  padding: 15px;
  background: #e53935;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 15px;
  transition: background 0.2s;
}

.checkout-btn:hover:not(:disabled) {
  background: #c62828;
}

.checkout-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.continue-shopping {
  display: block;
  text-align: center;
  color: #666;
  text-decoration: none;
  margin-top: 15px;
}

.continue-shopping:hover {
  color: #e53935;
}
</style>