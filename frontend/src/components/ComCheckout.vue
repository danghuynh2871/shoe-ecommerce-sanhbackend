<template>
  <div class="checkout-container">
    <div class="checkout-header">
      <h1>Thanh toán</h1>
    </div>
    
    <div v-if="loading" class="loading-message">
      <p>Đang tải dữ liệu thanh toán...</p>
    </div>
    
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
      <router-link to="/cart" class="back-link">Quay lại giỏ hàng</router-link>
    </div>
    
    <div v-else class="checkout-content">
      <div class="checkout-left">
        <div class="checkout-items">
          <h2>Sản phẩm đã chọn</h2>
          <div v-if="selectedItems.length === 0" class="empty-selection">
            <p>Không có sản phẩm nào được chọn. <router-link to="/cart">Quay lại giỏ hàng</router-link></p>
          </div>
          <div v-else class="items-list">
            <div v-for="item in selectedItems" :key="item.productId" class="checkout-item">
              <div class="item-image">
                <img :src="item.image" :alt="item.name">
              </div>
              <div class="item-details">
                <h3>{{ item.name }}</h3>
                <p class="item-size" v-if="item.size">Size: {{ item.size }}</p>
                <div class="item-quantity-price">
                  <span class="item-quantity">Số lượng: {{ item.quantity }}</span>
                  <span class="item-price">{{ formatPrice(item.price) }}</span>
                </div>
              </div>
              <div class="item-total">
                {{ formatPrice(item.price * item.quantity) }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="checkout-form">
          <h2>Thông tin nhận hàng</h2>
          <form @submit.prevent="placeOrder">
            <div class="form-container">
              <div class="form-group">
                <label for="fullName">Họ tên người nhận</label>
                <input 
                  type="text" 
                  id="fullName" 
                  v-model="orderInfo.fullName" 
                  required
                  placeholder="Nhập họ tên người nhận"
                >
              </div>
              
              <div class="form-group">
                <label for="phone">Số điện thoại</label>
                <input 
                  type="tel" 
                  id="phone" 
                  v-model="orderInfo.phone" 
                  required
                  placeholder="Nhập số điện thoại"
                >
              </div>
              
              <div class="form-group">
                <label for="address">Địa chỉ nhận hàng</label>
                <textarea 
                  id="address" 
                  v-model="orderInfo.address" 
                  required
                  placeholder="Nhập địa chỉ nhận hàng chi tiết"
                  rows="3"
                ></textarea>
              </div>
              
              <div class="form-group">
                <label for="note">Ghi chú đơn hàng (tùy chọn)</label>
                <textarea 
                  id="note" 
                  v-model="orderInfo.note" 
                  placeholder="Nhập ghi chú, yêu cầu đặc biệt (nếu có)"
                  rows="2"
                ></textarea>
              </div>
              
              <div class="form-group payment-method">
                <label>Phương thức thanh toán</label>
                <div class="payment-options">
                  <div class="payment-option">
                    <input 
                      type="radio" 
                      id="cod" 
                      value="COD" 
                      v-model="orderInfo.paymentMethod"
                    >
                    <label for="cod">Thanh toán khi nhận hàng (COD)</label>
                  </div>
                  <div class="payment-option">
                    <input 
                      type="radio" 
                      id="banking" 
                      value="Banking" 
                      v-model="orderInfo.paymentMethod"
                    >
                    <label for="banking">Chuyển khoản ngân hàng</label>
                  </div>
                </div>
              </div>
              
              <div class="action-buttons">
                <router-link to="/cart" class="back-btn">Quay lại giỏ hàng</router-link>
                <button 
                  type="submit" 
                  class="place-order-btn" 
                  :disabled="processing || selectedItems.length === 0"
                >
                  <span v-if="processing">Đang xử lý...</span>
                  <span v-else>Đặt hàng</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      <div class="checkout-right">
        <div class="checkout-summary">
          <h2>Tổng thanh toán</h2>
          <div class="summary-row">
            <span>Tạm tính:</span>
            <span>{{ formatPrice(summary.subtotal) }}</span>
          </div>
          <div class="summary-row">
            <span>VAT (10%):</span>
            <span>{{ formatPrice(summary.vat) }}</span>
          </div>
          <div class="summary-row total">
            <span>Tổng cộng:</span>
            <span>{{ formatPrice(summary.total) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import orderService from '../services/orderService';
import authService from '../services/authService';
import cartService from '../services/cartService';

export default {
  name: 'ComCheckout',
  data() {
    return {
      selectedItems: [],
      summary: {
        subtotal: 0,
        vat: 0,
        total: 0
      },
      orderInfo: {
        fullName: '',
        phone: '',
        address: '',
        note: '',
        paymentMethod: 'COD'
      },
      loading: true,
      processing: false,
      error: null
    }
  },
  created() {
    this.loadCheckoutData();
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price)
    },
    loadCheckoutData() {
      this.loading = true;
      this.error = null;
      
      try {
        // Kiểm tra đăng nhập
        if (!authService.isLoggedIn()) {
          this.error = 'Vui lòng đăng nhập để tiếp tục thanh toán';
          this.$router.push('/login?redirect=/checkout');
          return;
        }
        
        // Lấy dữ liệu từ localStorage
        const storedItems = localStorage.getItem('selectedItems');
        const storedSummary = localStorage.getItem('cartSummary');
        
        console.log('Raw localStorage data:', { storedItems, storedSummary });
        
        if (!storedItems || !storedSummary) {
          this.error = 'Không tìm thấy thông tin sản phẩm. Vui lòng chọn sản phẩm từ giỏ hàng.';
          return;
        }
        
        const parsedItems = JSON.parse(storedItems);
        console.log('Parsed selectedItems:', parsedItems);
        
        this.selectedItems = parsedItems;
        this.summary = JSON.parse(storedSummary);
        
        if (this.selectedItems.length === 0) {
          this.error = 'Vui lòng chọn ít nhất một sản phẩm để thanh toán';
          return;
        }
        
        // Kiểm tra cấu trúc của ID sản phẩm
        this.selectedItems.forEach(item => {
          console.log(`Item: ${item.name}, ID type: ${typeof item.productId}, ID value: ${item.productId}`);
        });
        
        // Lấy thông tin người dùng để điền sẵn
        const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
        if (userInfo) {
          this.orderInfo.fullName = userInfo.fullName || '';
          this.orderInfo.phone = userInfo.phone || '';
          this.orderInfo.address = userInfo.address || '';
        }
      } catch (error) {
        console.error('Error loading checkout data:', error);
        this.error = 'Đã có lỗi xảy ra khi tải dữ liệu thanh toán';
      } finally {
        this.loading = false;
      }
    },
    async placeOrder() {
      if (this.selectedItems.length === 0) {
        this.error = 'Vui lòng chọn ít nhất một sản phẩm để thanh toán';
        return;
      }
      
      this.processing = true;
      try {
        // Kiểm tra format của selectedItems
        console.log('selectedItems:', this.selectedItems);
        
        // Chuẩn bị thông tin sản phẩm với size
        const orderItems = this.selectedItems.map(item => ({
          productId: typeof item.productId === 'string' ? item.productId : item.productId.toString(),
          quantity: item.quantity,
          size: item.size
        }));
        
        console.log('Order items to send:', orderItems);
        
        // Tạo đơn hàng đúng định dạng mà backend yêu cầu
        const orderData = {
          orderItems: orderItems,
          fullname: this.orderInfo.fullName,
          phone: this.orderInfo.phone,
          address: this.orderInfo.address,
          paymentMethod: this.orderInfo.paymentMethod === 'BANKING' ? 'Banking' : this.orderInfo.paymentMethod,
          note: this.orderInfo.note
        };
        
        console.log('Submitting order data:', orderData);
        
        const response = await orderService.createSelectedOrder(orderData);
        console.log('Order response:', response);
        
        // Xóa sản phẩm đã thanh toán khỏi giỏ hàng
        try {
          console.log('Removing ordered items from cart');
          // Xóa từng sản phẩm từ giỏ hàng trên server
          const removePromises = this.selectedItems.map(item => 
            cartService.removeFromCart(item.productId)
          );
          await Promise.all(removePromises);
          console.log('All ordered items have been removed from cart');
        } catch (cartError) {
          console.error('Error removing items from cart:', cartError);
          // Tiếp tục thực hiện mặc dù có lỗi khi xóa giỏ hàng
        }
        
        // Xóa dữ liệu localStorage
        localStorage.removeItem('selectedItems');
        localStorage.removeItem('cartSummary');
        
        // Hiển thị thông báo thành công
        alert('Đặt hàng thành công! Cảm ơn bạn đã mua sắm.');
        
        // Chuyển hướng đến trang lịch sử đơn hàng
        this.$router.push('/order-history');
      } catch (error) {
        console.error('Error placing order:', error);
        
        if (error.response) {
          console.error('Error response data:', error.response.data);
          this.error = `Lỗi đặt hàng: ${error.response.data?.message || 'Vui lòng thử lại sau'}`;
        } else {
          this.error = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại sau.';
        }
      } finally {
        this.processing = false;
      }
    }
  }
}
</script>

<style scoped>
.checkout-container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
}

.checkout-header {
  margin-bottom: 30px;
  text-align: center;
}

.checkout-header h1 {
  font-size: 2.2em;
  color: #333;
  margin-bottom: 10px;
}

.loading-message, .error-message {
  text-align: center;
  margin: 30px 0;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.error-message {
  color: #e53935;
  background-color: rgba(229, 57, 53, 0.05);
}

.back-link {
  display: block;
  margin-top: 15px;
  color: #2196F3;
  text-decoration: none;
}

.checkout-content {
  display: flex;
  gap: 30px;
}

.checkout-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.checkout-right {
  width: 350px;
}

.checkout-items, .checkout-summary, .checkout-form {
  background: #fff;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.checkout-items h2, .checkout-summary h2, .checkout-form h2 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.4em;
  color: #333;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  text-align: center;
}

.form-container {
  max-width: 600px;
  margin: 0 auto;
}

.empty-selection {
  text-align: center;
  padding: 20px;
  color: #666;
}

.checkout-item {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.checkout-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 70px;
  height: 70px;
  margin-right: 15px;
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
  font-size: 1em;
  font-weight: 500;
}

.item-size {
  font-size: 0.85em;
  color: #666;
  margin: 5px 0;
  display: block;
}

.item-quantity-price {
  display: flex;
  justify-content: space-between;
  font-size: 0.9em;
  color: #666;
  margin-top: 8px;
}

.item-total {
  min-width: 100px;
  text-align: right;
  font-weight: bold;
  color: #e53935;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.summary-row.total {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #eee;
  font-weight: bold;
  font-size: 1.2em;
  color: #e53935;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #2196F3;
  outline: none;
}

.payment-options {
  margin-top: 10px;
}

.payment-option {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.payment-option input[type="radio"] {
  margin-right: 10px;
  width: auto;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.back-btn,
.place-order-btn {
  padding: 12px 25px;
  border-radius: 4px;
  font-size: 1em;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.back-btn {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn:hover {
  background: #eeeeee;
}

.place-order-btn {
  background: #4CAF50;
  color: white;
  border: none;
  min-width: 150px;
}

.place-order-btn:hover:not(:disabled) {
  background: #43A047;
}

.place-order-btn:disabled {
  background: #A5D6A7;
  cursor: not-allowed;
}

@media (max-width: 992px) {
  .checkout-content {
    flex-direction: column;
  }
  
  .checkout-right {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
    gap: 15px;
  }
  
  .back-btn,
  .place-order-btn {
    width: 100%;
  }
}
</style> 