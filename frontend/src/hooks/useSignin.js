import { useState } from "react";
import { authService } from "@/services/auth.service";
import { useNotification } from "@/contexts/NotificationContext.jsx";
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
      const { user } = await authService.login({email, password});
      login({
        id: user.id,
        email: user.email,
        role: user.role,
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
      });
      showToastNotification('LoginForm successful!', 'info');
      navigate('/');
    } catch (err) {
      console.log(err);
      const {statusCode, message} = err;
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