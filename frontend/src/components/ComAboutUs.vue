<template>
  <div class="about-container">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1>Chào mừng đến với DragonSneaker</h1>
        <p>Nơi mang đến những sản phẩm chất lượng hàng đầu</p>
      </div>
    </section>

    <!-- Our Story Section -->
    <section class="story-section">
      <div class="section-content">
        <h2>Câu chuyện của chúng tôi</h2>
        <div class="story-grid">
          <div class="story-text">
            <p>DragonSneaker được thành lập với sứ mệnh mang đến những đôi giày chất lượng cao cấp đến với khách hàng. Chúng tôi không chỉ đơn thuần là một cửa hàng giày, mà còn là nơi kết nối đam mê và phong cách.</p>
            <p>Với hơn 5 năm kinh nghiệm trong ngành, chúng tôi tự hào là đối tác tin cậy của các thương hiệu giày hàng đầu thế giới.</p>
          </div>
          <div class="story-image">
            <img src="@/assets/view4.jpg" alt="Our Store">
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="values-section">
      <div class="section-content">
        <h2>Giá trị cốt lõi</h2>
        <div class="values-grid">
          <div class="value-card">
            <i class="fas fa-medal"></i>
            <h3>Chất lượng</h3>
            <p>Cam kết mang đến sản phẩm chính hãng với chất lượng tốt nhất</p>
          </div>
          <div class="value-card">
            <i class="fas fa-heart"></i>
            <h3>Tận tâm</h3>
            <p>Luôn lắng nghe và phục vụ khách hàng với sự tận tâm nhất</p>
          </div>
          <div class="value-card">
            <i class="fas fa-sync"></i>
            <h3>Đổi mới</h3>
            <p>Không ngừng cập nhật xu hướng và mẫu mã mới nhất</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="section-content">
        <div class="stats-grid">
          <div class="stat-item">
            <h3>5000+</h3>
            <p>Khách hàng hài lòng</p>
          </div>
          <div class="stat-item">
            <h3>1000+</h3>
            <p>Sản phẩm</p>
          </div>
          <div class="stat-item">
            <h3>50+</h3>
            <p>Thương hiệu</p>
          </div>
          <div class="stat-item">
            <h3>24/7</h3>
            <p>Hỗ trợ khách hàng</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="team-section">
      <div class="section-content">
        <h2>Đội ngũ của chúng tôi</h2>
        <div class="team-grid">
          <div class="team-member">
            <img src="@/assets/b1.jpg" alt="Team Member">
            <h3>Nguyễn Hữu Lê Tuấn</h3>
            <p>Giám đốc điều hành</p>
          </div>
          <div class="team-member">
            <img src="@/assets/b2.jpg" alt="Team Member">
            <h3>Nguyễn Hoài Gia Bảo</h3>
            <p>Quản lý cửa hàng</p>
          </div>
          <div class="team-member">
            <img src="@/assets/b3.jpg" alt="Team Member">
            <h3>Nguyễn Phan Đăng Huỳnh</h3>
            <p>Chuyên viên tư vấn</p>
          </div>
          <div class="team-member">
            <img src="@/assets/b3.jpg" alt="Team Member">
            <h3>Vũ Phan Hoài Nam</h3>
            <p>Chuyên viên tư vấn</p>
          </div>
          <div class="team-member">
            <img src="@/assets/b3.jpg" alt="Team Member">
            <h3>Hồ Tấn Sanh</h3>
            <p>Chuyên viên tư vấn</p>
          </div>
          <div class="team-member">
            <img src="@/assets/b3.jpg" alt="Team Member">
            <h3>Cao Văn Nhân</h3>
            <p>Chuyên viên tư vấn</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'ComAboutUs'
}
</script>

<style scoped>
.about-container {
  width: 100%;
  overflow: hidden;
}

.hero-section {
  height: 800px;
  background-image: url('@/assets/view3.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
}

.hero-content h1 {
  font-size: 3.5em;
  margin-bottom: 20px;
  font-weight: 700;
}

.hero-content p {
  font-size: 1.5em;
  max-width: 600px;
  margin: 0 auto;
}

.section-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px;
}

h2 {
  text-align: center;
  font-size: 2.5em;
  margin-bottom: 50px;
  color: #333;
}

.story-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  align-items: center;
}

.story-text p {
  font-size: 1.1em;
  line-height: 1.8;
  color: #666;
  margin-bottom: 20px;
}

.story-image img {
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.value-card {
  text-align: center;
  padding: 40px 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.05);
  transition: transform 0.3s ease;
}

.value-card:hover {
  transform: translateY(-10px);
}

.value-card i {
  font-size: 2.5em;
  color: #ff6f61;
  margin-bottom: 20px;
}

.value-card h3 {
  margin-bottom: 15px;
  color: #333;
}

.stats-section {
  background: #f8f9fa;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.stat-item {
  text-align: center;
}

.stat-item h3 {
  font-size: 2.5em;
  color: #ff6f61;
  margin-bottom: 10px;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.team-member {
  text-align: center;
}

.team-member img {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin-bottom: 20px;
  object-fit: cover;
}

.team-member h3 {
  margin-bottom: 10px;
  color: #333;
}

.team-member p {
  color: #666;
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2.5em;
  }

  .story-grid,
  .values-grid,
  .stats-grid,
  .team-grid {
    grid-template-columns: 1fr;
  }

  .section-content {
    padding: 40px 20px;
  }

  .value-card {
    padding: 30px 15px;
  }
}
</style>