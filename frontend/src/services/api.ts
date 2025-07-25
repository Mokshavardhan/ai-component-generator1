// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  // 👇 Ensure this port number matches your running backend server (e.g., 3001)
  baseURL: 'https://ai-component-generator1.onrender.com', 
});

export default api;
