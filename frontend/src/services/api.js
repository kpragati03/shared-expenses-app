import axios from 'axios';

// Backend instance configuration
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Agar backend ka port alag hai to 5000 ko change kar lena
});

// Request interceptor to attach JWT token dynamically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Defined API endpoints for clean code architecture
export const loginUser = (credentials) => API.post('/auth/login', credentials);
export const getGroupDetails = (groupId) => API.get(`/groups/${groupId}/expenses`);
export const uploadExpensesCSV = (formData) => API.post('/import/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export default API;