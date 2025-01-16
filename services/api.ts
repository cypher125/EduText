import axios from 'axios';

interface TokenResponse {
  access: string;
  refresh: string;
  user: ProfileResponse;
}

export interface ProfileResponse {
  id: number;
  username: string;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
}

const api = axios.create({
  baseURL: 'http://localhost:8000/api',  // Make sure this matches your Django backend URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true  // Important for handling cookies
});

// Add request interceptor to handle tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Set authorization header without type checking
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const auth = {
  login: async (username: string, password: string) => {
    const response = await api.post<TokenResponse>('/token/', { username, password });
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
  getProfile: async () => {
    const response = await api.get<ProfileResponse>('/auth/me/');
    return response.data;
  }
};

export default api;