import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 second timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    
    // Kiểm tra URL để xác định loại token cần sử dụng
    if (config.url.includes('/admin/')) {
      // Nếu là API admin, sử dụng adminToken
      const adminToken = localStorage.getItem('adminToken');
      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
        console.log('Using admin token for authentication');
      } else {
        console.warn('Admin token not found for admin request');
      }
    } else {
      // Nếu là API người dùng thường, sử dụng token thông thường
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Using user token for authentication');
      } else {
        console.warn('User token not found for authenticated request');
      }
    }
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with an error status
      console.error(`API Error ${error.response.status}:`, error.response.data);
      
      // Handle authentication errors
      if (error.response.status === 401) {
        console.warn('Authentication error - clearing tokens');
        if (error.config.url.includes('/admin/')) {
          localStorage.removeItem('adminToken');
        } else {
          localStorage.removeItem('token');
        }
      }
    } else if (error.request) {
      // No response received
      console.error('API No Response Error:', error.request);
    } else {
      // Error in request setup
      console.error('API Setup Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api; 