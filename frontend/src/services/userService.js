import api from "./api";

export default {
  // Đăng ký tài khoản
  register(userData) {
    return api.post("/users/register", userData);
  },

  // Đăng nhập
  login(credentials) {
    return api.post("/users/login", credentials);
  },

  // Lấy thông tin người dùng hiện tại
  getCurrentUser() {
    return api.get("/users/me");
  },

  // Cập nhật thông tin người dùng
  updateUser(userId, userData) {
    return api.put(`admin/users/${userId}`, userData);
  },

  // Lấy danh sách tất cả người dùng (Admin)
  getAllUsers() {
    return api.get("/admin/users");
  },

  // Xóa người dùng (Admin)
  deleteUser(userId) {
    return api.delete(`/admin/users/remove/${userId}`);
  },

  // Admin đăng nhập
  adminLogin(credentials) {
    return api.post("/admin/login", credentials);
  },
};
