import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api';

const orderService = {
  // Tạo đơn hàng từ các sản phẩm được chọn
  createSelectedOrder: async (orderData) => {
    return axios.post(`${API_URL}/orders/create-selected`, orderData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  },

  // Lấy lịch sử đơn hàng
  getOrderHistory: async () => {
    return axios.get(`${API_URL}/orders/history`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  },

  // Lấy chi tiết đơn hàng
  getOrderDetail: async (orderId) => {
    return axios.get(`${API_URL}/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  },

  // Lấy thông tin chi tiết của một đơn hàng
  getOrderDetails(orderId) {
    return axios.get(`${API_URL}/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  },

  // Tạo đơn hàng mới từ giỏ hàng
  createOrder(orderData) {
    return axios.post(`${API_URL}/orders/create`, orderData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  },

  // ADMIN: Lấy tất cả đơn hàng (Admin)
  getAllOrders() {
    return axios.get(`${API_URL}/admin/orders`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    });
  },

  // ADMIN: Lấy chi tiết đơn hàng theo ID (Admin)
  getOrderById(orderId) {
    return axios.get(`${API_URL}/admin/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    });
  },

  // ADMIN: Cập nhật trạng thái đơn hàng (Admin)
  updateOrderStatus(orderId, statusData) {
    return axios.put(`${API_URL}/admin/orders/${orderId}/status`, statusData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    });
  }
};

export default orderService; 