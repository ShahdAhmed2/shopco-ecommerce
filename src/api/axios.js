import axios from 'axios';

const api = axios.create({
  baseURL: 'https://6888080aadf0e59551b8d6e4.mockapi.io/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
