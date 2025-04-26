<template>
  <div id="app">
    <!-- Header ở trên cùng -->
    <Header v-if="!isAdminRoute" />

    <!-- Nội dung chính hiển thị thông qua router-view -->
    <main>
      <router-view />
    </main>

    <!-- Footer chỉ hiển thị nếu không phải trang admin -->
    <Footer v-if="!isAdminRoute" />
  </div>
</template>

<script>
// Import các thành phần Header và Footer
import Header from "./components/ComHeader.vue";
import Footer from "./components/ComFooter.vue";
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: "App",
  components: {
    Header,
    Footer,
  },
  setup() {
    const route = useRoute();
    const isAdminRoute = computed(() => route.path.startsWith('/admin'));
    return { isAdminRoute };
  }
};
</script>
<style>

/* Common breakpoints */
@media (max-width: 1200px) { /* Large devices */ }
@media (max-width: 992px) { /* Medium devices */ }
@media (max-width: 768px) { /* Small devices */ }
@media (max-width: 576px) { /* Extra small devices */ }
body {
  margin: 0;
  padding: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  margin: 0;
}

/* chọn tất cả các element trong HTML */
  /* *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  } */
main {
  flex: auto;
  padding: 0;
  display: block;
}

.login-container {
  min-height: 100vh;
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000; /* hoặc background bạn muốn */
  margin: 0;
  padding: 0;
}
</style>
