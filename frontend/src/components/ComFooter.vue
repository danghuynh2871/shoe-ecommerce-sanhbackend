<template>
  <footer class="footer">
    <div class="subscribe-section">
      <h2 class="title">Đăng ký nhận tin từ DragonSneaker</h2>
      <p class="subtitle">Hãy là người đầu tiên biết về các sản phẩm mới, tour trải nghiệm,<br>các sự kiện và nhiều thông tin hấp dẫn khác!</p>
      
      <div class="subscribe-form">
        <div class="input-group">
          <input type="text" placeholder="Họ và tên" class="form-input">
          <input type="email" placeholder="Địa chỉ email" class="form-input">
        </div>
        <button class="subscribe-btn">
          Tôi muốn nhận tin
          <span class="btn-icon">+</span>
        </button>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="copyright">
        <p>&copy; DragonSneaker / 2024</p>
        <p>Thiết kế bởi InternGDU Team</p>
      </div>
      
      <div class="social-links">
        <a href="#" class="social-link">Theo dõi DragonSneaker</a>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'ComFooter',
};
</script>

<style scoped>
.footer {
  background-color: #000;
  color: white;
  padding: 60px 20px;
  position: relative;
  overflow: hidden;
  width: 100%;
  margin: 0;
  box-sizing: border-box;
}

.subscribe-section {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.title {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 20px;
}

.subtitle {
  font-size: 16px;
  color: #888;
  line-height: 1.6;
  margin-bottom: 40px;
}

.subscribe-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.input-group {
  display: flex;
  gap: 15px;
}

.form-input {
  flex: 1;
  background: transparent;
  border: none;
  border-bottom: 1px solid #333;
  padding: 10px 0;
  color: white;
  font-size: 16px;
}

.form-input::placeholder {
  color: #666;
}

.form-input:focus {
  outline: none;
  border-bottom-color: white;
}

.subscribe-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: transparent;
  border: 1px solid white;
  color: white;
  padding: 15px 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
}

.subscribe-btn:hover {
  background: white;
  color: black;
}

.btn-icon {
  font-size: 20px;
  font-weight: bold;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 60px;
  padding-top: 30px;
  border-top: 1px solid #333;
}

.copyright {
  font-size: 14px;
  color: #666;
}

.social-link {
  color: white;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.social-link:hover {
  color: #888;
}

@media (max-width: 768px) {
  .input-group {
    flex-direction: column;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
}
</style>