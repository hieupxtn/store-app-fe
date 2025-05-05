import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false, // Disable sending cookies in cross-origin requests
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Request config:', {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers
    });
    // You can add auth token here if needed
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response received:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle specific error cases
      if (error.response.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('token');
      }
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', {
        request: error.request,
        message: error.message
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', {
        message: error.message,
        stack: error.stack
      });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 