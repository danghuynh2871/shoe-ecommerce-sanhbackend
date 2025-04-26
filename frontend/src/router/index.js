import { createWebHistory, createRouter } from "vue-router";
import Register from "@/components/ComRegister.vue";
import Login from "@/components/ComLogin.vue";
import AdminLogin from "@/components/admin/AdminLogin.vue";
import Admin from "@/components/admin/ComAdmin.vue";
import ComProductManagement from "@/components/admin/ComProductManagement.vue"; // Updated to welcome interface
import ListProduct from "@/components/admin/products/ListProduct.vue"; // New component
import ListCustomer from "@/components/admin/customers/ListCustomer.vue"; // New component
import InsertProduct from "@/components/admin/products/InsertProduct.vue";
import EditProduct from "@/components/admin/products/EditProduct.vue";
import ListOrder from "@/components/admin/orders/ListOrder.vue";
import CustomerManagement from "@/components/admin/ComCustomerManagement.vue";
import ComOrderManagement from "@/components/admin/ComOrderManagement.vue";
import Home from "@/components/ComHome.vue";
import Cart from "@/components/ComCart.vue";
import Checkout from "@/components/ComCheckout.vue";
import OrderHistory from "@/components/ComOrderHistory.vue";
import About from "@/components/ComAboutUs.vue";
import Contact from "@/components/ComContact.vue";
import Products from "@/components/ComListProduct.vue";
import ProductDetail from "../components/ComProductDetail.vue";

const routes = [
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/",
    name: "Home",
    component: Home,
  },

  // đối tượng trang login
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  // đối tượng trang admin login
  {
    path: "/admin/login",
    name: "AdminLogin",
    component: AdminLogin,
  },
  // đối tượng trang cart
  {
    path: "/cart",
    name: "Cart",
    component: Cart,
  },
  // đối tượng trang checkout
  {
    path: "/checkout",
    name: "Checkout",
    component: Checkout,
    meta: { requiresAuth: true },
  },
  // đối tượng trang lịch sử đơn hàng
  {
    path: "/order-history",
    name: "OrderHistory",
    component: OrderHistory,
    meta: { requiresAuth: true },
  },
  // đối tượng trang about
  {
    path: "/about",
    name: "About",
    component: About,
  },
  // đối tượng trang contact
  {
    path: "/contact",
    name: "Contact",
    component: Contact,
  },
  // đối tượng trang products
  {
    path: "/products",
    name: "Products",
    component: Products,
  },
  {
    path: "/products/:id",
    name: "ProductDetail",
    component: ProductDetail,
    props: true,
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
    meta: { requiresAdminAuth: true },
    children: [
      {
        path: "products",
        name: "ComProductManagement",
        component: ComProductManagement,
      },
      {
        path: "products/list",
        name: "ListProduct",
        component: ListProduct,
      },
      {
        path: "products/insert",
        name: "InsertProduct",
        component: InsertProduct,
      },
      {
        path: "products/edit",
        name: "EditProduct",
        component: EditProduct,
      },
      {
        path: "customers",
        name: "CustomerManagement",
        component: CustomerManagement,
      },
      {
        path: "customers/list",
        name: "ListCustomer",
        component: ListCustomer,
      },
      {
        path: "orders",
        name: "OrderManagement",
        component: ComOrderManagement,
      },
      {
        path: "orders/list",
        name: "ListOrder",
        component: ListOrder,
      },
    ],
  },
];

// tạo đối tượng router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard to check for authentication
router.beforeEach((to, from, next) => {
  // Check if the route requires admin authentication
  if (to.meta.requiresAdminAuth) {
    // Check if admin is logged in
    if (!localStorage.getItem('adminToken')) {
      // If not logged in, redirect to admin login page
      next({ name: 'AdminLogin' });
    } else {
      // If logged in, proceed to the route
      next();
    }
  } 
  // Check if the route requires user authentication
  else if (to.meta.requiresAuth) {
    // Check if user is logged in
    if (!localStorage.getItem('token')) {
      // If not logged in, redirect to login page with redirect back
      next({ 
        name: 'Login',
        query: { redirect: to.fullPath } 
      });
    } else {
      // If logged in, proceed to the route
      next();
    }
  } else {
    // For routes that don't require authentication
    next();
  }
});

export default router;
