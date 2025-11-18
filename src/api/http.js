import axios from 'axios';

const http = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// tự động gắn token từ localStorage
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default http;
