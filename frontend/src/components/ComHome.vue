<template>
  <div class="home">
    <!-- Banner Section -->
    <div class="banner">
      <div class="banner-content">
        <h1>THE 2025</h1>
        <p>Worn by baby sea dragons</p>
        <button class="shop-now-btn">Mua sắm ngay</button>
      </div>
    </div>

    <!-- Featured Categories -->
    <section class="featured-categories">
      <h2 class="section-title">Danh Mục Nổi Bật</h2>
      <div class="category-grid">
        <div class="category-card">
          <img src="@/assets/view4.jpg" alt="">
          <h3>Nike</h3>
        </div>
        <div class="category-card">
          <img src="@/assets/balenciaga.jpg" alt="">
          <h3>Balenciaga</h3>
        </div>
        <div class="category-card">
          <img src="@/assets/balance.jpg" alt="">
          <h3>New Balance</h3>
        </div>
        <div class="category-card">
          <img src="@/assets/adidas.jpg" alt="">
          <h3>Adidas</h3>
        </div>
        <div class="category-card">
          <img src="@/assets/puma.jpg" alt="">
          <h3>Puma</h3>
        </div>
        <div class="category-card">
          <img src="@/assets/converse.jpg" alt="">
          <h3>Converse</h3>
        </div>
      </div>
    </section>

    <!-- New Arrivals -->
    <section class="new-arrivals">
      <h2 class="section-title">Sản phẩm mới</h2>
      
      <div v-if="loading" class="loading-container">
        <p>Đang tải sản phẩm mới...</p>
      </div>
      
      <div v-else-if="error" class="error-container">
        <p>{{ error }}</p>
      </div>
      
      <div v-else-if="newProducts.length === 0" class="empty-container">
        <p>Không có sản phẩm mới nào.</p>
      </div>
      
      <div v-else class="product-grid">
        <div v-for="product in newProducts" :key="product._id" class="product-card">
          <router-link :to="`/products/${product._id}`">
            <img :src="product.image" :alt="product.name">
            <h3>{{ product.name }}</h3>
            <p class="price">{{ formatPrice(product.price) }}</p>
          </router-link>
          <button class="add-to-cart-btn">Thêm vào giỏ</button>
        </div>
      </div>
    </section>

    <!-- Membership Benefits -->
    <section class="membership-section">
      <h2 class="section-title">ĐƯỢC NHIỀU HƠN KHI<br>LÀ HỘI VIÊN DRAGONSNEAKER</h2>
      <p class="membership-desc">
        Trở thành hội viên DragonSneaker để nhận ngay những ưu đãi độc quyền: giảm giá cực sốc trên các mẫu sneaker hot nhất, 
        tham gia sự kiện săn giày limited, hay cơ hội sở hữu những đôi giày phiên bản giới hạn không đâu có! Các chương trình 
        trước đây đã mang đến hàng loạt trải nghiệm đỉnh cao và phần quà hấp dẫn cho thành viên. Mùa này, DragonSneaker sẽ còn 
        bùng nổ hơn nữa với những bất ngờ đang chờ bạn khám phá!
      </p>
      <div class="member-gallery">
        <div class="gallery-item">
          <img src="https://i.pinimg.com/736x/3c/0a/ae/3c0aaee5c88ca1ed64e50258e40342f7.jpg" alt="Member 1">
        </div>
        <div class="gallery-item">
          <img src="https://i.pinimg.com/736x/54/93/19/549319421c6576b5f25c39e20e9b7486.jpg" alt="Member 2">
        </div>
        <div class="gallery-item">
          <img src="https://i.pinimg.com/736x/97/dd/92/97dd92a6b61c477f04bf1b6c0047966c.jpg" alt="Member 3">
        </div>
        <div class="gallery-item">
          <img src="https://i.pinimg.com/736x/bf/8c/f1/bf8cf120923c2c87ac5e9cb78631400b.jpg" alt="Member 4">
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import productService from '../services/productService';

export default {
  name: 'ComHome',
  data() {
    return {
      newProducts: [],
      loading: false,
      error: null
    }
  },
  created() {
    this.fetchNewProducts();
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price)
    },
    async fetchNewProducts() {
      this.loading = true;
      try {
        const response = await productService.getAllProducts();
        // Lấy 4 sản phẩm mới nhất (hoặc limit theo API)
        this.newProducts = response.data.products.slice(0, 4);
        console.log('Fetched new products:', this.newProducts);
      } catch (error) {
        console.error('Error fetching new products:', error);
        this.error = 'Không thể tải danh sách sản phẩm mới';
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.home {
  max-width: 100%;
  margin: 0 auto;   
}

.banner {
  height: 800px;
  background-image:url('@/assets/model1.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  color: white;
  text-align: center;
  margin-bottom: 40px;
  width: 100%;  
}

.banner-content h1 {
  font-size: 3em;
  margin-left: 200px ;
  margin-bottom: 20px;
}
.banner-content p { 
    margin-left: 200px;
    margin-bottom: 20px;
}

.section-title {
  text-align: center;
  margin: 40px 0;
  font-size: 2em;
  color: #333;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: 40px;
  margin-left: 15px;
  margin-right: 15px;
}

.category-card {
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.category-card img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.product-card {
  border: 1px solid #eee;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.product-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  margin-bottom: 10px;
  border-radius: 5px;
}

.product-card a {
  text-decoration: none;
  color: inherit;
  display: block;
}

.price {
  color: #e44d26;
  font-weight: bold;
  margin: 10px 0;
}

.add-to-cart-btn, .shop-now-btn {
  background-color: #e44d26;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.9em;
}
.shop-now-btn{
  margin-left: 200px;
}

.add-to-cart-btn:hover, .shop-now-btn:hover {
  background-color: #c73e1d;
}
.membership-section {
  max-width: 1200px;
  margin: 80px auto;
  padding: 0 20px;
  text-align: center;
}

.membership-section h2 {
  font-size: 2.5em;
  font-weight: bold;
  margin-bottom: 30px;
  line-height: 1.2;
}

.membership-desc {
  max-width: 800px;
  margin: 0 auto 40px;
  font-size: 1.1em;
  line-height: 1.6;
  color: #333;
}

.member-gallery {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.gallery-item {
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  aspect-ratio: 3/4;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.gallery-item:hover img {
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .member-gallery {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .membership-section h2 {
    font-size: 2em;
  }
  
  .membership-desc {
    font-size: 1em;
    padding: 0 20px;
  }
}

@media (max-width: 768px) {
  .category-grid {
    grid-template-columns: 1fr;
  }

  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .banner-content h1 {
    font-size: 2em;
  }
}

.loading-container, .error-container, .empty-container {
  text-align: center;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 40px;
}

.error-container {
  color: #e53935;
  background-color: rgba(229, 57, 53, 0.05);
}

.empty-container {
  color: #666;
}
</style>