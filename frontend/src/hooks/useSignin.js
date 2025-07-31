import { useState } from "react";
import { authService } from "@/services/auth.service";
import { useNotification } from "@/notifications/NotificationContext.jsx";
import { useNavigate } from "react-router-dom";
import {useUser} from "@/contexts/UserContext.jsx";

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
      const response = await authService.login({email, password});
      console.log(response)
      login({
        id: response.id,
        email: response.email,
        role: response.role,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
      showToastNotification('Login successful!', 'info');
      navigate('/');
    } catch (err) {
      const statusCode = err?.response?.status;
      const message = err?.response?.data?.message || "An error occurred during login";

      if (statusCode === 401) {
        setError(message);
      } else {
        showToastNotification(message, 'error');
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