import axios from 'axios';

// URL Backend kamu
const BASE_URL = "https://ebkitaapi-rikardoanju9587-pbb82rrt.leapcell.dev/api/v1";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, 
});

// =======================
// 🛠️ INTERCEPTORS (Otomatisasi)
// =======================

// 1. Request Interceptor: Otomatis pasang token setiap kali kirim data
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`🚀 [${config.method.toUpperCase()}] Request ke: ${config.url}`);
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 2. Response Interceptor: Menangani error secara global
apiClient.interceptors.response.use((response) => {
  return response;
}, (error) => {
  // Ambil pesan error dari backend Go kamu
  const message = error.response?.data?.message || "Terjadi kesalahan server";
  console.error("❌ API Error:", message);
  return Promise.reject(message);
});

// =======================
// 📡 FUNGSI API (Mirip ApiClient di Dart)
// =======================

const API = {
  // Ambil Data (GET)
  get: async (endpoint) => {
    try {
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Simpan Data Baru (POST)
  post: async (endpoint, data) => {
    try {
      const response = await apiClient.post(endpoint, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update Data (PUT)
  put: async (endpoint, data) => {
    try {
      const response = await apiClient.put(endpoint, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Hapus Data (DELETE)
  delete: async (endpoint) => {
    try {
      const response = await apiClient.delete(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default API;