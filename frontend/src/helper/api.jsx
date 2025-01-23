import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

// Add a response interceptor
api.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    if (error.response?.status === 401) {
      // If unauthorized, clear token and set auth to false
      localStorage.removeItem('token');
      setAuth(false); // Make sure this is accessible
    }
    return Promise.reject(error); // Pass the error to be handled elsewhere
  }
);

export default api;
