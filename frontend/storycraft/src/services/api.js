import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Base URL for all backend routes
});

export default API;
