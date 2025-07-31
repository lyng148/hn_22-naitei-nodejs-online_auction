import axios from 'axios';
import { API_CONFIG } from '../utils/config';

class AuthService {
  async registerUser(userData) {
    try {
      const response = await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REGISTER}`, userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;

      if (data.user && data.user.accessToken) {
        localStorage.setItem('token', data.user.accessToken);
        localStorage.setItem('refreshToken', data.user.refreshToken);
        localStorage.setItem('user', JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          role: data.user.role
        }));
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      // Axios wraps HTTP errors in error.response
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      throw new Error(errorMessage);
    }
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

const authService = new AuthService();

// Export individual functions for easier imports
export const registerUser = (userData) => authService.registerUser(userData);
export const loginUser = (credentials) => authService.loginUser(credentials);
export const logout = () => authService.logout();
export const getCurrentUser = () => authService.getCurrentUser();
export const getToken = () => authService.getToken();
export const isAuthenticated = () => authService.isAuthenticated();

export default authService;
