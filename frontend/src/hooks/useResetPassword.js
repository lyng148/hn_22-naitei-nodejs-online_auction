import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authService } from "@/services/auth.service";
import { useNotification } from "@/contexts/NotificationContext.jsx";

export const useResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  
  const { showToastNotification } = useNotification();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Extract token from URL query parameters
    const urlParams = new URLSearchParams(location.search);
    const tokenFromUrl = urlParams.get('token');
    
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError("Invalid or missing reset token");
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSuccess(false);

    if (!newPassword.trim()) {
      setError("New password is required");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!token) {
      setError("Invalid reset token");
      setLoading(false);
      return;
    }

    try {
      const response = await authService.resetPassword({
        token,
        newPassword: newPassword.trim()
      });
      
      setSuccess(true);
      showToastNotification(response.message || 'Password reset successfully!', 'success');
      
      // Redirect to login page after successful reset
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
    } catch (err) {
      console.error('Reset password error:', err);
      const errorMessage = err.message || 'Failed to reset password';
      setError(errorMessage);
      showToastNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    success,
    error,
    token,
    handleSubmit,
  };
};
