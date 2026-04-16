import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://frozen-delights-backend.vercel.app/api',
    withCredentials: true, // 🔥 cookie support
});

export default api;
