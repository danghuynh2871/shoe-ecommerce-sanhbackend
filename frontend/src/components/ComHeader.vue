<template>
  <header class="main-header">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <div class="header-container">
      <!-- Logo -->
      <div class="logo">
        <router-link to="/"><img :src="require('@/assets/logo.png')" alt="Logo" /></router-link>
      </div>

      <!-- Thanh điều hướng -->
      <nav>
        <ul class="menu">
          <li><router-link to="/">TRANG CHỦ</router-link></li>
          <li><router-link to="/products">DANH SÁCH SẢN PHẨM</router-link></li>
          <li><router-link to="/about">VỀ CHÚNG TÔI</router-link></li>
          <li><router-link to="/contact">LIÊN HỆ</router-link></li>
        </ul>
      </nav>

      <!-- Header Actions -->
      <div class="header-actions">
        <!-- <div class="search-icon">
          <i class="fa-solid fa-magnifying-glass"></i>
        </div> -->
        <div class="user-icon" @click="toggleUserMenu">
          <i class="fa-regular fa-user"></i>
          <!-- User Dropdown Menu -->
          <div class="user-dropdown" v-show="isUserMenuOpen">
            <div v-if="!isLoggedIn">
              <router-link to="/login">Đăng nhập</router-link>
              <router-link to="/register">Đăng ký</router-link>
            </div>
            <div v-else>
              <span class="user-greeting">Xin chào, {{ username }}</span>
              <router-link to="/order-history">Lịch sử đơn hàng</router-link>
              <a href="#" @click.prevent="logout">Đăng xuất</a>
            </div>
          </div>
        </div>
        <router-link to="/cart" class="cart-icon">
          <i class="fa-solid fa-shopping-cart"></i>
        </router-link>
      </div>
    </div>
  </header>
</template>

<script>
import authService from '../services/authService';

export default {
  name: 'ComHeader',
  data() {
    return {
      isUserMenuOpen: false,
      username: ''
    }
  },
  computed: {
    isLoggedIn() {
      return authService.isLoggedIn();
    }
  },
  created() {
    // Load user info if logged in
    this.loadUserInfo();
  },
  methods: {
    toggleUserMenu() {
      this.isUserMenuOpen = !this.isUserMenuOpen;
    },
    loadUserInfo() {
      if (this.isLoggedIn) {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
          this.username = userInfo.username || userInfo.fullName || 'Khách hàng';
        }
      }
    },
    logout() {
      // Clear token and user info
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      
      // Close the dropdown
      this.isUserMenuOpen = false;
      
      // Redirect to home page
      this.$router.push('/');
      
      // Reload page to clear state
      window.location.reload();
    }
  }
};
</script>

<style scoped>
.main-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: #fff;
  font-family: 'Arial', sans-serif;
}

/* Top Bar */
.top-bar {
  background-color: #f5f5f5;
  padding: 5px 20px;
  font-size: 12px;
  text-align: right;
}

.top-bar-links a {
  color: #333;
  text-decoration: none;
  margin: 0 8px;
  transition: color 0.3s ease;
}

.top-bar-links a:hover {
  color: #ff6f61;
}

.top-bar-links span {
  color: #999;
}

/* User Section */
.user-section {
  display: inline-flex;
  align-items: center;
}

.user-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 14px;
  margin-right: 8px;
}

.user-icon img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.user-section span {
  margin: 0 8px;
  color: #333;
}

.user-section a {
  color: #333;
  text-decoration: none;
  transition: color 0.3s ease;
}

.user-section a:hover {
  color: #ff6f61;
}

/* Header Container */
.header-container {
  max-width: 1400px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  margin: 0 auto;
}

/* Logo */
.logo img {
  height: 40px;
  transition: transform 0.3s ease;
}

.logo img:hover {
  transform: scale(1.1);
}

/* Menu */
nav {
  flex: 1;
  display: flex;
  justify-content: center;
}

.menu {
  list-style: none;
  display: flex;
  gap: 20px;
  margin: 0;
  padding: 0;
}

.menu li a {
  color: #333;
  font-size: 14px;
  text-decoration: none;
  font-weight: 500;
  text-transform: uppercase;
  padding: 10px 15px;
  transition: color 0.3s ease;
}

.menu li a:hover {
  color: #ff6f61;
}

/* Header Actions */
.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}


.user-icon,
.cart-icon {
  font-size: 20px;
  color: #333;
  cursor: pointer;
  position: relative;
}

.user-icon {
  position: relative;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border-radius: 4px;
  padding: 10px;
  min-width: 150px;
  z-index: 1000;
}

.user-dropdown a {
  display: block;
  padding: 8px 15px;
  color: #333;
  text-decoration: none;
  transition: background-color 0.3s;
}

.user-dropdown a:hover {
  background-color: #f5f5f5;
  color: #ff6f61;
}

.user-greeting {
  display: block;
  padding: 8px 15px;
  color: #666;
  font-size: 14px;
  border-bottom: 1px solid #eee;
  margin-bottom: 5px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .header-actions {
    gap: 15px;
  }

  .user-icon,
  .cart-icon {
    font-size: 18px;
  }
}

@media (max-width: 992px) {
  .menu {
    display: none;
    position: fixed;
    top: 60px;
    left: 0;
    width: 100%;
    background: white;
    flex-direction: column;
    padding: 20px;
    box-shadow: 0 5px 10px rgba(0,0,0,0.1);
    gap: 0;
  }

  .menu li a {
    padding: 15px 0;
    display: block;
    border-bottom: 1px solid #eee;
  }
}
</style>