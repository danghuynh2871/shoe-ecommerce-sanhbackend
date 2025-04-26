<template>
  <div class="order-management">
    <h2>QUẢN LÝ ĐƠN HÀNG</h2>
    <div class="search-bar">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Tìm kiếm đơn hàng..."
      /><i class="fas fa-search"></i>
    </div>
    <div v-if="loading" class="loading">Đang tải dữ liệu...</div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    <div v-else class="order-list">
      <table>
        <thead>
          <tr>
            <th>Mã đơn hàng</th>
            <th>Thông tin sản phẩm</th>
            <th>Người đặt hàng</th>
            <th>Số điện thoại</th>
            <th>Địa chỉ</th>
            <th>Ngày đặt</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order._id">
            <td>{{ order._id.substring(0, 8) }}</td>
            <td>
              <div v-if="order.items && order.items.length > 0">
                <div v-for="(item, index) in order.items" :key="index">
                  {{ item.name || "Không có tên" }}, Size:
                  {{ item.size || "N/A" }}, SL: {{ item.quantity || 0 }}
                </div>
              </div>
              <div v-else>Không có thông tin</div>
            </td>
            <td>
              {{ order.userId ? order.userId.fullname : "Không có thông tin" }}
            </td>
            <td>
              {{
                order.receiverInfo
                  ? order.receiverInfo.phone
                  : "Không có thông tin"
              }}
            </td>
            <td>
              {{
                order.receiverInfo
                  ? order.receiverInfo.address
                  : "Không có thông tin"
              }}
            </td>
            <td>{{ formatDate(order.createdAt) }}</td>
            <td>{{ formatPrice(order.totalAmount) }}</td>
            <td>
              <span :class="'status-badge ' + order.status">
                {{ translateStatus(order.status) }}
              </span>
            </td>
            <td>
              <button @click="showStatusForm(order)" class="btn update-btn">
                Cập nhật
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="total-orders">Tổng số đơn hàng: {{ orders.length }}</div>
    </div>

    <!-- Modal cập nhật trạng thái -->
    <div v-if="showUpdateModal" class="modal">
      <div class="modal-content">
        <h3>Cập nhật trạng thái đơn hàng</h3>
        <div class="form-group">
          <label>Trạng thái mới:</label>
          <select v-model="newStatus">
            <option value="processing">Đang xử lý</option>
            <option value="delivered">Đã giao hàng</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
        <div class="modal-buttons">
          <button @click="updateOrderStatus" class="btn save-btn">Lưu</button>
          <button @click="showUpdateModal = false" class="btn cancel-btn">
            Hủy
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import orderService from "../../../services/orderService";

export default {
  name: "ListOrder",
  data() {
    return {
      searchQuery: "",
      orders: [],
      loading: true,
      error: null,
      showUpdateModal: false,
      selectedOrder: null,
      newStatus: "",
    };
  },
  computed: {
    filteredOrders() {
      if (!this.searchQuery) {
        return this.orders;
      }

      const query = this.searchQuery.toLowerCase();
      return this.orders.filter((order) => {
        return (
          (order._id && order._id.toLowerCase().includes(query)) ||
          (order.userId &&
            order.userId.fullname &&
            order.userId.fullname.toLowerCase().includes(query)) ||
          (order.status && order.status.toLowerCase().includes(query))
        );
      });
    },
  },
  created() {
    this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
      this.loading = true;
      try {
        const response = await orderService.getAllOrders();
        this.orders = response.data.orders;
        this.loading = false;
      } catch (error) {
        this.error =
          "Không thể tải danh sách đơn hàng: " +
          (error.response?.data?.message || error.message);
        this.loading = false;
      }
    },
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    formatPrice(price) {
      if (!price) return "0 đ";
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);
    },
    translateStatus(status) {
      const statusMap = {
        processing: "Đang xử lý",
        delivered: "Đã giao hàng",
        cancelled: "Đã hủy",
      };
      return statusMap[status] || status;
    },
    viewOrderDetails(orderId) {
      this.$router.push(`/admin/orders/${orderId}`);
    },
    showStatusForm(order) {
      this.selectedOrder = order;
      this.newStatus = order.status;
      this.showUpdateModal = true;
    },
    async updateOrderStatus() {
      if (!this.selectedOrder || !this.newStatus) return;

      try {
        await orderService.updateOrderStatus(this.selectedOrder._id, {
          status: this.newStatus,
        });
        // Cập nhật trạng thái trong danh sách hiện tại
        const index = this.orders.findIndex(
          (o) => o._id === this.selectedOrder._id
        );
        if (index !== -1) {
          this.orders[index].status = this.newStatus;
        }
        this.showUpdateModal = false;
        // Thông báo thành công (có thể sử dụng thư viện thông báo)
        alert("Cập nhật trạng thái đơn hàng thành công!");
      } catch (error) {
        alert(
          "Lỗi khi cập nhật trạng thái: " +
            (error.response?.data?.message || error.message)
        );
      }
    },
  },
};
</script>

<style scoped>
.order-management {
  padding: 20px;
  max-width: 100%;
  margin: 0 auto;
  font-family: 'Arial', sans-serif;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  font-weight: bold;
}

.search-bar {
  margin-bottom: 20px;
  text-align: right;
}

.search-bar input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 300px;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  table-layout: fixed;
}

th, td {
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #ddd;
  vertical-align: middle;
  word-wrap: break-word;
  overflow: visible;
}

/* Column widths for better content display */
tr th:nth-child(1), tr td:nth-child(1) {
  width: 8%; /* Mã đơn hàng */
}

tr th:nth-child(2), tr td:nth-child(2) {
  width: 18%; /* Thông tin sản phẩm */
}

tr th:nth-child(3), tr td:nth-child(3) {
  width: 10%; /* Người đặt hàng */
}

tr th:nth-child(4), tr td:nth-child(4) {
  width: 8%; /* Số điện thoại */
}

tr th:nth-child(5), tr td:nth-child(5) {
  width: 15%; /* Địa chỉ */
}

tr th:nth-child(6), tr td:nth-child(6) {
  width: 12%; /* Ngày đặt */
}

tr th:nth-child(7), tr td:nth-child(7) {
  width: 10%; /* Tổng tiền */
}

tr th:nth-child(8), tr td:nth-child(8) {
  width: 9%; /* Trạng thái */
}

tr th:nth-child(9), tr td:nth-child(9) {
  width: 10%; /* Hành động */
}

th {
  background: #f8f9fa;
  font-size: 14px;
}

td {
  font-size: 14px;
}

/* Product info styling */
td div div {
  margin-bottom: 4px;
}

.btn {
  padding: 5px 10px;
  margin: 0;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 13px;
  display: inline-block;
  width: 80px;
}

.view-btn {
  background: #4caf50;
  color: white;
}

.update-btn {
  background: #2196f3;
  color: white;
}

.total-orders {
  margin-top: 15px;
  font-weight: bold;
  text-align: right;
  padding-right: 10px;
}

.loading, .error {
  text-align: center;
  padding: 20px;
}

.error {
  color: #e74c3c;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
}

.processing {
  background-color: #ffc107;
  color: #000;
}

.delivered {
  background-color: #4caf50;
  color: white;
}

.cancelled {
  background-color: #f44336;
  color: white;
}

/* Modal styles */
.modal {
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  min-width: 300px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.save-btn {
  background: #4caf50;
  color: white;
}

.cancel-btn {
  background: #f44336;
  color: white;
}
</style>
