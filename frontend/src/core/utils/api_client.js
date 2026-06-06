import axios from 'axios';

const BASE_URL = "https://webkita-worker-api.rikardoanju1110.workers.dev/api"

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Koneksi ke server gagal";
    return Promise.reject(message);
  }
);

const API = {
  get: (url, config) => apiClient.get(url, config).then(res => res.data),
  post: (url, data, config) => apiClient.post(url, data, config).then(res => res.data),
  put: (url, data, config) => apiClient.put(url, data, config).then(res => res.data),
  patch: (url, data, config) => apiClient.patch(url, data, config).then(res => res.data),
  delete: (url, config) => apiClient.delete(url, config).then(res => res.data),
};

export default API;