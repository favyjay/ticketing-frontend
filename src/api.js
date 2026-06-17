// src/api.js
import axios from 'axios';

// While testing locally, we use localhost.
// When we deploy, we will change this URL to our live Render backend URL.
const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;