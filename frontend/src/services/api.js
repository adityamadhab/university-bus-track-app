import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

export const fetchBusData = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    return await api.get(`/buses?${queryParams.toString()}`);
  } catch (error) {
    console.error('Error fetching bus data:', error);
    throw error;
  }
};

export const updateBusLocation = async (busId, locationData) => {
  try {
    return await api.put(`/buses/${busId}/location`, locationData);
  } catch (error) {
    console.error('Error updating bus location:', error);
    throw error;
  }
};

export const fetchBusDetails = async (busId) => {
  try {
    return await api.get(`/buses/${busId}`);
  } catch (error) {
    console.error('Error fetching bus details:', error);
    throw error;
  }
};

export const fetchRoutes = async () => {
  try {
    return await api.get('/routes');
  } catch (error) {
    console.error('Error fetching routes:', error);
    throw error;
  }
}; 