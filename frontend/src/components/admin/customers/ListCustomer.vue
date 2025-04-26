<template>
  <h2>QUẢN LÝ NGƯỜI DÙNG</h2>
  <div class="customer-list">
    <!-- Success message -->
    <div v-if="successMessage" class="success-message">
      <p>{{ successMessage }}</p>
    </div>

    <!-- Loading indicator -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Đang tải dữ liệu người dùng...</p>
    </div>

    <!-- Error message -->
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
      <button
        v-if="!isAuthenticated"
        @click="redirectToLogin"
        class="btn login"
      >
        Đăng nhập
      </button>
      <button v-else @click="fetchUsers" class="btn retry">Thử lại</button>
    </div>

    <div v-if="!loading && !error && isAuthenticated">
      <div class="search-bar">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Tìm kiếm khách hàng..."
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Mã người dùng</th>
            <th>Họ và tên</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="customer in filteredCustomers" :key="customer._id">
            <td>{{ customer._id }}</td>
            <td>{{ customer.fullname || customer.name || "N/A" }}</td>
            <td>{{ customer.email }}</td>
            <td>{{ customer.numberPhone || customer.phone || "N/A" }}</td>
            <td>
              <button class="btn delete" @click="confirmDelete(customer._id)">
                Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="total-customers">
        Tổng số lượng người dùng: {{ customers.length }}
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <p>Bạn có chắc chắn muốn xóa người dùng này không?</p>
        <div class="modal-buttons">
          <button class="btn delete" @click="deleteCustomer">Xóa</button>
          <button class="btn cancel" @click="closeModal">Không</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userService from "@/services/userService";

export default {
  name: "ListCustomer",
  data() {
    return {
      customers: [],
      showModal: false,
      customerIdToDelete: null,
      searchQuery: "",
      loading: false,
      error: null,
      isAuthenticated: false,
      successMessage: null,
    };
  },
  computed: {
    filteredCustomers() {
      return this.customers.filter((customer) => {
        const query = this.searchQuery.toLowerCase();
        return (
          (customer.email && customer.email.toLowerCase().includes(query)) ||
          (customer.phone && customer.phone.includes(query)) ||
          (customer.numberPhone && customer.numberPhone.includes(query))
        );
      });
    },
  },
  created() {
    this.checkAuthentication();
  },
  methods: {
    checkAuthentication() {
      const adminToken = localStorage.getItem("adminToken");
      if (!adminToken) {
        this.error = "Bạn cần đăng nhập để xem danh sách người dùng";
        this.isAuthenticated = false;
        return;
      }

      this.isAuthenticated = true;
      this.fetchUsers();
    },
    async fetchUsers() {
      this.loading = true;
      this.error = null;

      try {
        const response = await userService.getAllUsers();
        if (response.data && response.data.users) {
          this.customers = response.data.users;
        } else {
          this.customers = response.data;
        }

        console.log("Dữ liệu người dùng:", this.customers);
      } catch (error) {
        console.error("Error fetching users:", error);
        if (error.response && error.response.status === 401) {
          this.error = "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại";
          this.isAuthenticated = false;
          localStorage.removeItem("adminToken");
        } else {
          this.error = "Không thể tải dữ liệu người dùng";
        }
      } finally {
        this.loading = false;
      }
    },
    redirectToLogin() {
      this.$router.push("/admin/login");
    },
    viewCustomer(customer) {
      console.log("Viewing customer:", customer);
    },
    confirmDelete(customerId) {
      this.customerIdToDelete = customerId;
      this.showModal = true;
    },
    async deleteCustomer() {
      try {
        await userService.deleteUser(this.customerIdToDelete);
        this.customers = this.customers.filter(
          (customer) => customer._id !== this.customerIdToDelete
        );
        this.closeModal();
        this.successMessage = "Xóa người dùng thành công!";
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
        console.log("Xóa người dùng thành công:", this.customerIdToDelete);
      } catch (error) {
        console.error("Error deleting user:", error);
        this.error = "Không thể xóa người dùng";
      }
    },
    closeModal() {
      this.showModal = false;
      this.customerIdToDelete = null;
    },
  },
};
</script>

<style scoped>
.customer-list {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

th,
td {
  padding: 15px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

th {
  background: #f8f9fa;
  text-align: center;
}

.btn {
  padding: 5px 10px;
  margin: 0 5px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.btn.block {
  background: #e74c3c;
  color: white;
}

.btn.delete {
  background: #e74c3c;
  color: white;
}

.btn.cancel {
  background: #95a5a6;
  color: white;
}

.btn.retry {
  background: #3498db;
  color: white;
  padding: 10px 20px;
}

.btn.login {
  background: #2ecc71;
  color: white;
  padding: 10px 20px;
  font-weight: bold;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.modal-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.total-customers {
  margin-top: 20px;
  font-weight: bold;
  text-align: right;
}

.search-bar {
  margin-bottom: 20px;
  text-align: right;
}

.search-bar input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 400px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-message {
  text-align: center;
  padding: 20px;
  color: #e74c3c;
  background-color: #ffeeee;
  border-radius: 4px;
  margin-bottom: 20px;
}

.success-message {
  text-align: center;
  padding: 15px;
  color: #2ecc71;
  background-color: #eeffee;
  border-radius: 4px;
  margin-bottom: 20px;
  border-left: 4px solid #2ecc71;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s, fadeOut 0.5s 2.5s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
}

/* Common breakpoints */
@media screen and (max-width: 1200px) {
  .admin-container {
    margin-left: 0;
  }
  
  .admin-sidebar {
    width: 250px;
  }
  
  .admin-content {
    margin-left: 250px;
  }
}

@media screen and (max-width: 992px) {
  .admin-sidebar {
    width: 200px;
  }
  
  .admin-content {
    margin-left: 200px;
  }
  
  table th, table td {
    padding: 8px 5px;
    font-size: 13px;
  }
}

@media screen and (max-width: 768px) {
  .admin-sidebar {
    width: 100%;
    position: relative;
    min-height: auto;
  }
  
  .admin-content {
    margin-left: 0;
  }
  
  .search-bar input {
    width: 100%;
    max-width: 300px;
  }
  
  .table-responsive {
    overflow-x: auto;
  }
  
  .form-group input,
  .form-group textarea {
    width: 100%;
  }
  
  .modal-content {
    width: 90%;
    margin: 20px;
  }
}

@media screen and (max-width: 576px) {
  .admin-container {
    padding: 10px;
  }
  
  h2 {
    font-size: 20px;
  }
  
  .btn {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .form-buttons {
    flex-direction: column;
    gap: 10px;
  }
  
  .form-buttons button {
    width: 100%;
  }
  
  .modal {
    padding: 10px;
  }
}
</style>
