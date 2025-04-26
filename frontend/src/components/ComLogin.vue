<template>
  <div class="login-container">
    <div class="login-form">
      <h1>Đăng Nhập</h1>
      <p class="subtitle">Điền vào mẫu dưới đây để đăng nhập</p>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <input type="text" v-model="email" placeholder="Email" required>
        </div>

        <div class="form-group">
          <input type="password" v-model="password" placeholder="Mật khẩu" required>
        </div>

        <div class="error-message" v-if="errorMessage">
          {{ errorMessage }}
        </div>

        <p class="subtitle">Bạn chưa có tài khoản? <router-link to="/register">Đăng ký</router-link></p>
        <p class="admin-link"><router-link to="/admin/login">Đăng nhập với tư cách quản trị viên</router-link></p>

        <button type="submit" class="login-btn" :disabled="loading">
          {{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import authService from '../services/authService';

export default {
  name: 'ComLogin',
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
      loading: false
    }
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.errorMessage = '';
      
      try {
        const response = await authService.login({
          email: this.email,
          password: this.password
        });
        
        // Lưu token vào localStorage
        localStorage.setItem('token', response.data.token);
        
        // Chuyển hướng đến trang chủ
        this.$router.push('/');
        
        console.log('Login successful!', response.data);
      } catch (error) {
        console.error('Login error:', error);
        this.errorMessage = error.response?.data?.message || 'Đăng nhập không thành công. Vui lòng thử lại.';
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('../assets/backgroundLogin.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-top: 10px;
}

.login-form {
  background: rgba(255, 255, 255, 0.1);
  padding: 120px;
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
  margin: 20px 0; /* Add some vertical margin */
}

h1 {
  color: white;
  margin-bottom: 10px;
}

.subtitle {
  color: #ccc;
  margin-bottom: 30px;
}

.form-group {
  position: relative;
  margin-bottom: 20px;
}

input[type="text"],
input[type="password"] {
  width: 85%;
  padding: 12px 40px 12px 15px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  color: white;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

input:focus {
  border-color: #00e6e6;
}

.icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #00e6e6;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
}

.remember-me {
  display: flex;
  align-items: center;
  color: white;
  gap: 5px;
}

.forgot-password {
  color: #00e6e6;
  text-decoration: none;
}

.login-btn {
  width: 100%;
  padding: 12px;
  background: #f39c12;

  border: none;
  border-radius: 5px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.login-btn:hover {
  background: #e67e22;
}

.error-message {
  color: #ff4d4d;
  background-color: rgba(255, 77, 77, 0.1);
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 15px;
  font-size: 14px;
}

.login-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.admin-link {
  margin-top: 10px;
  margin-bottom: 20px;
  font-size: 14px;
}

.admin-link a {
  color: #00e6e6;
  text-decoration: none;
  transition: color 0.3s;
}

.admin-link a:hover {
  color: white;
  text-decoration: underline;
}
</style>