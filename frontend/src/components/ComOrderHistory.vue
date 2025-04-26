<template>
  <div class="order-history-container">
    <div class="order-history-header">
      <h1>Lịch sử đơn hàng</h1>
    </div>
    
    <div v-if="loading" class="loading-message">
      <p>Đang tải lịch sử đơn hàng...</p>
    </div>
    
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
      <router-link to="/" class="home-link">Quay lại trang chủ</router-link>
    </div>
    
    <div v-else-if="orders.length === 0" class="empty-orders">
      <p>Bạn chưa có đơn hàng nào.</p>
      <router-link to="/products" class="shop-link">Mua sắm ngay</router-link>
    </div>
    
    <div v-else class="orders-list">
      <div v-for="order in orders" :key="order._id" class="order-item">
        <div class="order-header">
          <div class="order-info">
            <div class="order-id">
              <span class="label">Mã đơn hàng:</span>
              <span class="value">#{{ order._id.slice(-8).toUpperCase() }}</span>
            </div>
            <div class="order-date">
              <span class="label">Ngày đặt:</span>
              <span class="value">{{ formatDate(order.createdAt) }}</span>
            </div>
          </div>
          <div class="order-status" :class="getStatusClass(order.status)">
            {{ getStatusText(order.status) }}
          </div>
        </div>
        
        <div class="order-products">
          <div v-for="(item, index) in order.items" :key="index" class="order-product">
            <div class="product-image" v-if="item.product && item.product.image">
              <img :src="item.product.image" :alt="item.product.name">
            </div>
            <div class="product-details">
              <h3>{{ item.name || (item.product ? item.product.name : 'Sản phẩm') }}</h3>
              <p v-if="item.size" class="product-size">Size: {{ item.size }}</p>
              <div class="product-price-qty">
                <span class="product-price">{{ formatPrice(item.price) }}</span>
                <span class="product-qty">x {{ item.quantity }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="order-footer">
          <div class="order-summary">
            <div class="summary-row">
              <span class="label">Tạm tính:</span>
              <span class="value">{{ formatPrice(order.totalAmount - (order.totalAmount * 0.1)) }}</span>
            </div>
            <div class="summary-row">
              <span class="label">VAT (10%):</span>
              <span class="value">{{ formatPrice(order.totalAmount * 0.1) }}</span>
            </div>
            <div class="summary-row total">
              <span class="label">Tổng cộng:</span>
              <span class="value">{{ formatPrice(order.totalAmount) }}</span>
            </div>
          </div>
          
          <div class="shipping-info">
            <h4>Thông tin giao hàng</h4>
            <p v-if="order.receiverInfo"><strong>Người nhận:</strong> {{ order.receiverInfo.fullname }}</p>
            <p v-if="order.receiverInfo"><strong>Số điện thoại:</strong> {{ order.receiverInfo.phone }}</p>
            <p v-if="order.receiverInfo"><strong>Địa chỉ:</strong> {{ order.receiverInfo.address }}</p>
            <p v-if="order.note"><strong>Ghi chú:</strong> {{ order.note }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import orderService from '../services/orderService';
import authService from '../services/authService';

export default {
  name: 'ComOrderHistory',
  data() {
    return {
      orders: [],
      loading: true,
      error: null
    }
  },
  created() {
    this.fetchOrderHistory();
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price)
    },
    formatDate(dateString) {
      const options = { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit', 
        minute: '2-digit'
      };
      return new Date(dateString).toLocaleDateString('vi-VN', options);
    },
    getStatusText(status) {
      const statusMap = {
        'pending': 'Chờ xác nhận',
        'processing': 'Đang xử lý',
        'shipping': 'Đang giao hàng',
        'delivered': 'Đã giao hàng',
        'cancelled': 'Đã hủy'
      };
      return statusMap[status] || status;
    },
    getStatusClass(status) {
      return `status-${status}`;
    },
    async fetchOrderHistory() {
      this.loading = true;
      this.error = null;
      
      try {
        // Kiểm tra đăng nhập
        if (!authService.isLoggedIn()) {
          this.error = 'Vui lòng đăng nhập để xem lịch sử đơn hàng';
          setTimeout(() => {
            this.$router.push('/login?redirect=/order-history');
          }, 2000);
          return;
        }
        
        const response = await orderService.getOrderHistory();
        
        if (response.data && response.data.orders) {
          this.orders = response.data.orders;
        } else {
          this.orders = [];
        }
      } catch (error) {
        console.error('Error fetching order history:', error);
        
        if (error.response) {
          if (error.response.status === 401) {
            this.error = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
            localStorage.removeItem('token');
            setTimeout(() => {
              this.$router.push('/login?redirect=/order-history');
            }, 2000);
          } else {
            this.error = `Không thể tải lịch sử đơn hàng: ${error.response.data?.message || 'Lỗi máy chủ'}`;
          }
        } else if (error.request) {
          this.error = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại sau.';
        } else {
          this.error = 'Lỗi khi tải lịch sử đơn hàng: ' + error.message;
        }
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.order-history-container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
}

.order-history-header {
  margin-bottom: 30px;
  text-align: center;
}

.order-history-header h1 {
  font-size: 2.2em;
  color: #333;
  margin-bottom: 10px;
}

.loading-message, .error-message, .empty-orders {
  text-align: center;
  margin: 50px 0;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.error-message {
  color: #e53935;
  background-color: rgba(229, 57, 53, 0.05);
}

.home-link, .shop-link {
  display: inline-block;
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #2196F3;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.home-link:hover, .shop-link:hover {
  background-color: #1976D2;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.order-item {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #eee;
}

.order-info {
  display: flex;
  gap: 20px;
}

.order-id .label, .order-date .label {
  color: #666;
  margin-right: 5px;
}

.order-id .value {
  font-weight: 600;
  color: #2196F3;
}

.order-status {
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 15px;
  text-transform: uppercase;
  font-size: 0.85em;
}

.status-pending {
  background-color: #FFF8E1;
  color: #FFA000;
}

.status-processing {
  background-color: #E3F2FD;
  color: #1976D2;
}

.status-shipping {
  background-color: #E8F5E9;
  color: #388E3C;
}

.status-delivered {
  background-color: #E8F5E9;
  color: #388E3C;
}

.status-cancelled {
  background-color: #FFEBEE;
  color: #D32F2F;
}

.order-products {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.order-product {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.order-product:last-child {
  border-bottom: none;
}

.product-image {
  width: 60px;
  height: 60px;
  margin-right: 15px;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.product-details {
  flex: 1;
}

.product-details h3 {
  margin: 0 0 5px;
  font-size: 1em;
  font-weight: 500;
}

.product-size {
  font-size: 0.85em;
  color: #666;
  margin-bottom: 5px;
}

.product-price-qty {
  display: flex;
  justify-content: space-between;
  font-size: 0.9em;
}

.product-price {
  font-weight: 600;
  color: #E53935;
}

.order-footer {
  display: flex;
  flex-wrap: wrap;
  padding: 15px 20px;
}

.order-summary {
  flex: 1;
  min-width: 250px;
  padding-right: 20px;
}

.shipping-info {
  flex: 2;
  min-width: 300px;
  padding-top: 10px;
}

.shipping-info h4 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #333;
  font-size: 1.1em;
}

.shipping-info p {
  margin: 5px 0;
  font-size: 0.9em;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.9em;
}

.summary-row .label {
  color: #666;
}

.summary-row.total {
  padding-top: 10px;
  margin-top: 10px;
  border-top: 1px solid #eee;
  font-weight: 600;
  font-size: 1em;
}

.summary-row.total .value {
  color: #E53935;
}

@media (max-width: 768px) {
  .order-header, .order-footer {
    flex-direction: column;
  }
  
  .order-info {
    flex-direction: column;
    gap: 5px;
    margin-bottom: 10px;
  }
  
  .order-summary {
    padding-right: 0;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
    margin-bottom: 15px;
  }
}
</style>
