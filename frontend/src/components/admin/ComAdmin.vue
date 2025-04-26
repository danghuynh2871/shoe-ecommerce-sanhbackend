<template>
  <div v-if="isAdmin" class="admin-container">
    <div class="admin-sidebar">
      <h2>Admin Dashboard</h2>
      <nav class="nav-menu">
        <div class="menu-item">
          <router-link to="/admin/products" class="nav-item" @click="toggleProductSubMenu">
            Quản lý sản phẩm
            <span class="arrow-icon">{{ showProductSubMenu ? '▲' : '▼' }}</span>
          </router-link>
          <div class="sub-menu" v-if="showProductSubMenu">
            <router-link to="/admin/products/list" class="nav-item sub-item">Danh sách sản phẩm</router-link>
            <router-link to="/admin/products/insert" class="nav-item sub-item">Thêm sản phẩm</router-link>
          </div>
        </div>

        <div class="menu-item">
          <router-link to="/admin/customers" class="nav-item" @click="toggleCustomerSubMenu">
            Quản lý người dùng
            <span class="arrow-icon">{{ showCustomerSubMenu ? '▲' : '▼' }}</span>
          </router-link>
          <div class="sub-menu" v-if="showCustomerSubMenu">
            <router-link to="/admin/customers/list" class="nav-item sub-item">Danh sách người dùng</router-link>
          </div>
        </div>

        <div class="menu-item">
          <router-link to="/admin/orders" class="nav-item" @click="toggleOrderSubMenu">
            Quản lý đơn hàng
            <span class="arrow-icon">{{ showOrderSubMenu ? '▲' : '▼' }}</span>
          </router-link>
          <div class="sub-menu" v-if="showOrderSubMenu">
            <router-link to="/admin/orders/list" class="nav-item sub-item">Lịch sử đơn hàng</router-link>
          </div>
        </div>
        
        <div class="logout-button">
          <button @click="logout" class="logout-btn">Đăng xuất</button>
        </div>
      </nav>
    </div>
    <div class="admin-content">
      <router-view></router-view>
    </div>
  </div>
  <div v-else class="access-denied">
    <h2>Không có quyền truy cập</h2>
    <p>Bạn cần đăng nhập với tài khoản admin để truy cập trang này.</p>
    <button @click="redirectToLogin" class="login-btn">Đăng nhập</button>
  </div>
</template>

<script>
import authService from '../../services/authService';

export default {
  name: 'ComAdmin',
  data() {
    return {
      showProductSubMenu: false,
      showCustomerSubMenu: false,
      showOrderSubMenu: false,
      isAdmin: false
    }
  },
  created() {
    this.checkAdminAuth();
  },
  methods: {
    checkAdminAuth() {
      this.isAdmin = authService.isAdminLoggedIn();
    },
    redirectToLogin() {
      this.$router.push('/admin/login');
    },
    logout() {
      authService.adminLogout();
      this.$router.push('/admin/login');
    },
    toggleProductSubMenu() {
      this.showProductSubMenu = !this.showProductSubMenu;
    },
    toggleCustomerSubMenu() {
      this.showCustomerSubMenu = !this.showCustomerSubMenu;
    },
    toggleOrderSubMenu() {
      this.showOrderSubMenu = !this.showOrderSubMenu;
    }
  }
}
</script>

<style scoped>
.admin-container {
  margin-bottom: 70px; /* Footer height */
  width: 100%;
}

.admin-sidebar {
  width: 300px;
  background: #2c3e50;
  color: white;
  min-height: calc(100vh - 0px); /* Adjust for header (70px) and footer (70px) */
  position: fixed;
}
h2{
  text-align: center;
}

.admin-content {
  flex: 1;
  padding: 20px;
  background: #f5f6fa;
  margin-left: 300px;
  min-height: calc(100vh - 140px); /* Adjust for header and footer */
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.menu-item {
  position: relative;
}

.nav-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background 0.3s;
}

.nav-item:hover {
  background: #34495e;
}

.arrow-icon {
  margin-left: 10px;
  cursor: pointer;
}

.sub-menu {
  margin-left: 20px; /* Indentation for child items */
}

.sub-item {
  padding-left: 35px; /* Additional padding for child items */
}

.access-denied {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f8f9fa;
  text-align: center;
  padding: 0 20px;
}

.access-denied h2 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 20px;
}

.access-denied p {
  font-size: 1.2rem;
  color: #7f8c8d;
  margin-bottom: 30px;
}

.login-btn {
  padding: 12px 30px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-btn:hover {
  background-color: #2980b9;
}

.logout-button {
  margin-top: 30px;
  padding: 0 20px;
}

.logout-btn {
  width: 100%;
  padding: 12px 20px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: #c0392b;
}
</style>
