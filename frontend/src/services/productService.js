import api from './api';

export default {
  // Lấy tất cả sản phẩm
  getAllProducts() {
    console.log('Gọi API lấy tất cả sản phẩm');
    return api.get('/products');
  },


  // Lấy sản phẩm theo ID
  getProductById(id) {
    if (!id) {
      return Promise.reject(new Error('ID sản phẩm không được để trống'));
    }
    console.log('Fetching product with ID:', id);
    return api.get(`/admin/products/${id}`);
  },

  // Tạo sản phẩm mới
  createProduct(productData) {
    console.log('Tạo sản phẩm mới với dữ liệu:', productData);
    return api.post('/admin/products/add', productData);
  },

  // Cập nhật sản phẩm
  updateProduct(id, productData) {
    console.log('Cập nhật sản phẩm ID:', id, 'với dữ liệu:', productData);
    return api.put(`/admin/products/update/${id}`, productData);
  },

  // Xóa sản phẩm
  deleteProduct(id) {
    console.log('Xóa sản phẩm ID:', id);
    return api.delete(`/admin/products/remove/${id}`);
  }
}; 