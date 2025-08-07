import { useState } from "react";
import { authService } from "@/services/auth.service";
import { useNotification } from "@/contexts/NotificationContext.jsx";

export const useForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { showToastNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSuccess(false);

    if (!email.trim()) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    try {
      const response = await authService.forgotPassword(email.trim());
      setSuccess(true);
      showToastNotification(response.message || 'Reset password email sent successfully!', 'success');
    } catch (err) {
      console.error('Forgot password error:', err);
      const errorMessage = err.message || 'Failed to send reset email';
      setError(errorMessage);
      showToastNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    loading,
    success,
    error,
    handleSubmit,
  };
};
