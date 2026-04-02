import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: Attach token if available
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bto_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Global 401 Unauthorized handling
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('bto_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
