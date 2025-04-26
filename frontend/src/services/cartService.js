import api from './api';

export default {
  // Lấy giỏ hàng của người dùng hiện tại
  getCart() {
    return api.get('/carts');
  },

  // Thêm sản phẩm vào giỏ hàng
  addToCart(item) {
    console.log('Cart service addToCart called with:', item);
    return api.post('/carts/add', {
      productId: item.productId,
      quantity: item.quantity,
      size: item.size || undefined // Only include size if it's provided
    });
  },

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  updateQuantity(productId, quantity, size) {
    return api.put('/carts/update', { 
      productId, 
      quantity,
      size
    });
  },

  // Xóa sản phẩm khỏi giỏ hàng
  removeFromCart(productId) {
    return api.delete(`/carts/remove/${productId}`);
  },

  // Xóa tất cả sản phẩm khỏi giỏ hàng
  clearCart() {
    return api.delete('/carts/clear');
  }
}; 