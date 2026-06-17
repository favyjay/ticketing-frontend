// src/api.js
import axios from 'axios';

// We replace 'http://localhost:5000/api' with your live Render backend URL
const API_BASE_URL = 'https://ticketing-backend-om89.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;