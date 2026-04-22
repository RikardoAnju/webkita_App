import axios from 'axios';

// Pastikan TIDAK ada tanda "/" di akhir v1
const BASE_URL = "https://ebkitaapi-vinskaco9956-b09mad4t.leapcell.dev/api/v1";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000, 
});

// Interceptor: Pasang Token Otomatis jika ada
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Interceptor: Ambil pesan error dari Backend
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Pesan error dari GORM/Gin di Go
    const message = error.response?.data?.message || "Koneksi ke server gagal";
    return Promise.reject(message);
  }
);

const API = {
  get: (url) => apiClient.get(url).then(res => res.data),
  post: (url, data) => apiClient.post(url, data).then(res => res.data),
  put: (url, data) => apiClient.put(url, data).then(res => res.data),
  delete: (url) => apiClient.delete(url).then(res => res.data),
};

export default API;