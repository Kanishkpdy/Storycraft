// services/api.js
import axios from 'axios';

const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';

const API = axios.create({
  baseURL: isLocalhost 
    ? 'http://localhost:5000/api' 
    : 'https://storycraft-production.up.railway.app/api',
});

export default API;
