import { useState } from "react";
import { loginUser } from "@/services/authService.js";
import { useNotification } from "@/contexts/NotificationContext.jsx";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext.jsx";

export const useSignin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { showToastNotification } = useNotification();
  const navigate = useNavigate();
  const { login } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await loginUser({ email, password });
      login({
        id: response.user.id,
        email: response.user.email,
        role: response.user.role,
        accessToken: response.user.accessToken,
        refreshToken: response.user.refreshToken,
      });
      showToastNotification('Login successful!', 'success');
      navigate('/');
    } catch (err) {
      console.log(err);
      const errorMessage = err.message;
      
      // Check if it's an email verification error
      if (errorMessage.includes('verify your email')) {
        setError(errorMessage);
        // Show additional action for resending verification
        showToastNotification(
          'Please verify your email address. Check your email or request a new verification link.', 
          'warning'
        );
      } else {
        setError(errorMessage);
        showToastNotification(errorMessage, 'error');
      }
    }
  };

  return {
    email,
    setEmail,
    setPassword,
    handleSubmit,
    error,
  };
};