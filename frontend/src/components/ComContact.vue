<template>
  <div class="contact-container">
    <!-- Contact Header -->
    <div class="contact-header">
      <h1>Liên Hệ Với Chúng Tôi</h1>
      <p>Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn</p>
    </div>

    <!-- Contact Content -->
    <div class="contact-content">
      <!-- Contact Information -->
      <div class="contact-info">
        <div class="info-card">
          <i class="fas fa-map-marker-alt"></i>
          <h3>Địa Chỉ</h3>
          <p>123 Đường ABC, Quận XYZ</p>
          <p>TP. Hồ Chí Minh, Việt Nam</p>
        </div>

        <div class="info-card">
          <i class="fas fa-phone"></i>
          <h3>Điện Thoại</h3>
          <p>Hotline: 1800 1234</p>
          <p>Di động: 0123 456 789</p>
        </div>

        <div class="info-card">
          <i class="fas fa-envelope"></i>
          <h3>Email</h3>
          <p>support@seadragon.com</p>
          <p>sales@seadragon.com</p>
        </div>

        <div class="info-card">
          <i class="fas fa-clock"></i>
          <h3>Giờ Làm Việc</h3>
          <p>Thứ 2 - Thứ 7: 8:00 - 22:00</p>
          <p>Chủ nhật: 10:00 - 20:00</p>
        </div>
      </div>

      <!-- Contact Form -->
      <div class="contact-form-container">
        <form class="contact-form" @submit.prevent="submitForm">
          <div class="form-header">
            <h2>Gửi Thông Tin</h2>
            <p>Điền thông tin của bạn và chúng tôi sẽ liên hệ lại trong thời gian sớm nhất</p>
          </div>

          <div class="form-group">
            <input type="text" v-model="formData.name" required>
            <label>Họ và tên</label>
          </div>

          <div class="form-group">
            <input type="email" v-model="formData.email" required>
            <label>Email</label>
          </div>

          <div class="form-group">
            <input type="tel" v-model="formData.phone" required>
            <label>Số điện thoại</label>
          </div>

          <div class="form-group">
            <select v-model="formData.subject" required>
              <option value="">Chọn chủ đề</option>
              <option value="support">Hỗ trợ sản phẩm</option>
              <option value="warranty">Bảo hành</option>
              <option value="feedback">Góp ý</option>
              <option value="other">Khác</option>
            </select>
          </div>

          <div class="form-group">
            <textarea v-model="formData.message" required></textarea>
            <label>Nội dung tin nhắn</label>
          </div>

          <button type="submit" class="submit-btn">Gửi tin nhắn</button>
        </form>
      </div>
    </div>

    <!-- Google Map -->
    <div class="map-container">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4241674197276!2d106.69843!3d10.777236!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ2JzM4LjEiTiAxMDbCsDQxJzU0LjMiRQ!5e0!3m2!1svi!2s!4v1635134073595!5m2!1svi!2s"
        width="100%"
        height="450"
        style="border:0;"
        allowfullscreen=""
        loading="lazy">
      </iframe>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComContact',
  data() {
    return {
      formData: {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      }
    }
  },
  methods: {
    submitForm() {
      // Xử lý gửi form ở đây
      console.log('Form submitted:', this.formData)
      // Reset form
      this.formData = {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      }
    }
  }
}
</script>

<style scoped>
.contact-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.contact-header {
  text-align: center;
  margin-bottom: 50px;
}

.contact-header h1 {
  font-size: 2.5em;
  color: #333;
  margin-bottom: 15px;
}

.contact-header p {
  color: #666;
  font-size: 1.1em;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  margin-bottom: 50px;
}

.contact-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
}

.info-card {
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  text-align: center;
  transition: transform 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
}

.info-card i {
  font-size: 2em;
  color: #ff6f61;
  margin-bottom: 15px;
}

.info-card h3 {
  color: #333;
  margin-bottom: 10px;
}

.info-card p {
  color: #666;
  line-height: 1.6;
}

.contact-form-container {
  background: #fff;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.form-header {
  text-align: center;
  margin-bottom: 30px;
}

.form-header h2 {
  color: #333;
  margin-bottom: 10px;
}

.form-header p {
  color: #666;
}

.form-group {
  position: relative;
  margin-bottom: 25px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1em;
  transition: all 0.3s ease;
}

.form-group label {
  position: absolute;
  left: 10px;
  top: 10px;
  color: #999;
  transition: all 0.3s ease;
  pointer-events: none;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #ff6f61;
  box-shadow: 0 0 5px rgba(255,111,97,0.2);
}

.form-group input:focus + label,
.form-group input:valid + label,
.form-group textarea:focus + label,
.form-group textarea:valid + label {
  top: -20px;
  left: 0;
  font-size: 0.9em;
  color: #ff6f61;
}

.form-group textarea {
  height: 120px;
  resize: none;
}

.submit-btn {
  width: 100%;
  padding: 15px;
  background: #ff6f61;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.1em;
  cursor: pointer;
  transition: background 0.3s ease;
}

.submit-btn:hover {
  background: #e65d50;
}

.map-container {
  margin-top: 50px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

@media (max-width: 768px) {
  .contact-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .contact-info {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .contact-info {
    grid-template-columns: 1fr;
  }

  .contact-form-container {
    padding: 15px;
  }
}
</style>