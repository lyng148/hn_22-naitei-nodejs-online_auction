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

      // Don't automatically log in user after registration
      // They need to verify email first
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

  async loginUser(credentials) {
    try {
      const response = await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`, credentials, {
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
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      throw new Error(errorMessage);
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  async verifyEmail(token) {
    try {
      const response = await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.VERIFY_EMAIL}`, {
        token
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Email verification error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Email verification failed';
      throw new Error(errorMessage);
    }
  }

  async resendVerification(email) {
    try {
      const response = await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.RESEND_VERIFICATION}`, {
        email
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Resend verification error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to resend verification email';
      throw new Error(errorMessage);
    }
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
export const verifyEmail = (token) => authService.verifyEmail(token);
export const resendVerification = (email) => authService.resendVerification(email);

export default authService;
