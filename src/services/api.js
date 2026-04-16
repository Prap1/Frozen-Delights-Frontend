import axios from 'axios';

const api = axios.create({
    baseURL: 'https://frozen-delights-backend.vercel.app/api',
    withCredentials: true, // 🔥 cookie support
});

export default api;
