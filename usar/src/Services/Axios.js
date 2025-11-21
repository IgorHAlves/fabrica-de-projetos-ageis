import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7181/api/',
  timeout: 30000, // Aumentado para 30 segundos para operações que podem demorar mais
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export default api;
