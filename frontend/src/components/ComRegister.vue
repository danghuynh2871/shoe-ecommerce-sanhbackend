<template>
  <div class="register-container">
    <div class="register-form">
      <h1>Đăng Kí Tài Khoản</h1>
      <p class="subtitle">Hãy đăng ký nếu bạn chưa có tài khoản.</p>
      <!-- hàm xử lý sự kiện submit của form -->
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="fullName">Họ Và Tên</label>
          <input type="text" id="fullName" v-model="fullName" placeholder="VD: Nguyễn Văn A" required>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" placeholder="VD: vana@gmail.com" required>
        </div>
        <div class="form-group">
          <label for="password">Mật Khẩu</label>
          <input type="password" id="password" v-model="password" placeholder="Mật Khẩu phải từ 4 ký tự" required>
        </div>
        <div class="form-group">
          <label for="confirmPassword">Xác Nhận Mật Khẩu</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" placeholder="Nhập lại mật khẩu" required>
        </div>
        <div class="form-group">
          <label for="phoneNumber">Số Điện Thoại</label>
          <input type="text" id="phoneNumber" v-model="phoneNumber" placeholder="VD: 0123456789" required>
        </div>
        
        <div class="error-message" v-if="error">
          {{ error }}
        </div>
        
        <button type="submit" class="register-btn" :disabled="loading">
          <span v-if="loading">Đang xử lý...</span>
          <span v-else>Đăng Kí</span>
        </button>
      </form>
      <p class="subtitle">Bạn đã có tài khoản? <router-link to="/login">Đăng nhập</router-link></p>
    </div>
  </div>
</template>

<script>
import authService from '../services/authService';

export default {
  name: 'ComRegister', //tên của component
  data() { //chứa các thuộc tính của component
    return {
      fullName: '', //gán giá trị cho các thuộc tính
      email: '', 
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      loading: false,
      error: null
    }
  },
  //methods là một đối tượng chứa các phương thức của component
  methods: { //chứa các phương thức của component
    async handleRegister() { //hàm xử lý sự kiện submit của form
      this.error = null;
      
      // Validate form
      if (this.password !== this.confirmPassword) { //kiểm tra mật khẩu nhập lại có khớp với mật khẩu đã nhập hay không
        alert('Mật khẩu nhập lại không khớp!');
        return;
      }
      
      if (this.password.length < 4) {
        alert('Mật khẩu phải có ít nhất 4 ký tự!');
        return;
      }

      if (!/^[0-9]{10}$/.test(this.phoneNumber)) {
        alert('Số điện thoại không hợp lệ! Vui lòng nhập 10 chữ số.');
        return;
      }

      try {
        this.loading = true;
        
        // Register user via auth service
        const userData = {
          fullname: this.fullName,
          email: this.email,
          password: this.password,
          phone: this.phoneNumber
        };
        
        const response = await authService.register(userData);
        
        // Show success message
        alert('Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.');
        
        // Redirect to login page
        this.$router.push('/login');
        
        console.log('Registration successful:', response.data);
      } catch (error) {
        console.error('Registration error:', error);
        
        if (error.response && error.response.data) {
          // Show API error message
          alert('Đăng ký thất bại: ' + (error.response.data.message || 'Vui lòng thử lại sau'));
        } else {
          // Show generic error message
          alert('Đăng ký thất bại: Vui lòng kiểm tra kết nối mạng và thử lại sau');
        }
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.register-container {
  min-height: 91vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('../assets/backgroundLogin.jpg');
  background-position: center;
  margin-top: 1px;
}

.register-form {
  background: rgba(255, 255, 255, 0.1);
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 375px;
  text-align: center;
  margin: 20px 0;
}

h1 {
  color: white;
  margin-bottom: 10px;
}

.form-group {
  position: relative;
  margin-bottom: 20px;
  text-align: left;
}

label {
  color: white;
  margin-bottom: 5px;
  display: block;
}

input[type="text"],
input[type="email"],
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

.register-btn {
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

.register-btn:hover {
  background: #e67e22;
}

.register-btn:disabled {
  background: #d9d9d9;
  cursor: not-allowed;
}

.error-message {
  color: #ff6b6b;
  background-color: rgba(255, 107, 107, 0.2);
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 15px;
  text-align: center;
}

.subtitle {
  color: #ccc;
  margin-bottom: 30px;
}
</style>