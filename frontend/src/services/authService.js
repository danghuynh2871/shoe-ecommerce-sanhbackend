import api from './api';

export default {
  // Đăng nhập người dùng thông thường
  login(credentials) {
    return api.post('/users/login', credentials);
  },

  // Đăng ký
  register(userData) {
    return api.post('/users/register', userData);
  },

  // Lấy thông tin người dùng hiện tại
  getCurrentUser() {
    return api.get('/users/me');
  },

  // Đăng xuất người dùng (xóa token khỏi localStorage)
  logout() {
    localStorage.removeItem('token');
  },

  // Kiểm tra người dùng đã đăng nhập chưa
  isLoggedIn() {
    return !!localStorage.getItem('token');
  },

  // Đăng nhập với quyền Admin
  adminLogin(credentials) {
    return api.post('/admin/login', credentials);
  },
  
  // Đăng xuất Admin (xóa token admin khỏi localStorage)
  adminLogout() {
    localStorage.removeItem('adminToken');
  },
  
  // Kiểm tra Admin đã đăng nhập chưa
  isAdminLoggedIn() {
    return !!localStorage.getItem('adminToken');
  },
  
  // Lấy thông tin Admin hiện tại
  getCurrentAdmin() {
    // Sử dụng interceptor trong api.js để tự động đính kèm token
    return api.get('/admin/me', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    });
  }
}; 