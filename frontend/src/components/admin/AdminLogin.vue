<template>
  <div class="admin-login-container">
    <div class="admin-login-form">
      <div class="admin-logo">
        <h1>Đăng Nhập Admin</h1>
      </div>
      <p class="subtitle">Vui lòng đăng nhập với tài khoản quản trị</p>
      
      <form @submit.prevent="handleAdminLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="text" id="email" v-model="email" placeholder="Email quản trị" required>
        </div>

        <div class="form-group">
          <label for="password">Mật khẩu</label>
          <input type="password" id="password" v-model="password" placeholder="Mật khẩu" required>
        </div>

        <transition name="fade">
          <div class="error-message" v-if="errorMessage">
            <i class="error-icon">⚠️</i>
            {{ errorMessage }}
          </div>
        </transition>

        <div class="form-actions">
          <button type="submit" class="login-btn" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            <span>{{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}</span>
          </button>
          <router-link to="/login" class="back-link">Quay lại trang đăng nhập người dùng</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import authService from '../../services/authService';

export default {
  name: 'AdminLogin',
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
      loading: false
    }
  },
  methods: {
    async handleAdminLogin() {
      this.loading = true;
      this.errorMessage = '';
      
      try {
        const response = await authService.adminLogin({
          email: this.email,
          password: this.password
        });
        
        // Lưu token vào localStorage
        localStorage.setItem('adminToken', response.data.token);
        
        // Chuyển hướng đến trang admin
        this.$router.push('/admin');
        
        console.log('Admin login successful!', response.data);
      } catch (error) {
        console.error('Admin login error:', error);
        
        // Handle specific error cases
        if (error.response) {
          // The request was made and the server responded with a status code
          if (error.response.status === 401) {
            this.errorMessage = 'Thông tin đăng nhập không chính xác';
          } else if (error.response.status === 404) {
            this.errorMessage = 'Endpoint không tồn tại. Vui lòng kiểm tra cấu hình API';
          } else {
            this.errorMessage = error.response.data?.message || 'Lỗi xác thực: ' + error.response.status;
          }
        } else if (error.request) {
          // The request was made but no response was received
          this.errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.';
        } else {
          // Something happened in setting up the request
          this.errorMessage = 'Lỗi đăng nhập: ' + error.message;
        }
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.admin-login-container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2c3e50, #34495e);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.admin-login-form {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 450px;
  text-align: left;
}

h1 {
  color: #333;
  margin-bottom: 10px;
  text-align: center;
  font-weight: 600;
}

.subtitle {
  color: #666;
  margin-bottom: 30px;
  text-align: center;
}

.form-group {
  position: relative;
  margin-bottom: 24px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  background: #f9f9f9;
  border-radius: 5px;
  color: #333;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
}

input::placeholder {
  color: #999;
}

input:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  background: white;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 30px;
}

.login-btn {
  width: 100%;
  padding: 14px;
  background: #3498db;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.login-btn:hover:not(:disabled) {
  background: #2980b9;
}

.login-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.admin-logo {
  margin-bottom: 20px;
  text-align: center;
}

.admin-logo h1 {
  color: #3498db;
  position: relative;
  display: inline-block;
}

.admin-logo h1:after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 3px;
  background-color: #3498db;
}

.error-message {
  color: #e74c3c;
  background-color: rgba(231, 76, 60, 0.1);
  padding: 12px;
  border-radius: 5px;
  margin-bottom: 20px;
  font-size: 14px;
  border-left: 3px solid #e74c3c;
  display: flex;
  align-items: center;
}

.error-icon {
  margin-right: 10px;
  font-size: 18px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  to {transform: rotate(360deg);}
}

.back-link {
  text-align: center;
  color: #666;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.back-link:hover {
  color: #3498db;
}
</style> 