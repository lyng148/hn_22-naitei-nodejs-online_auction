import { Route, Routes } from "react-router-dom";
import Register from "@/screens/auth/Register/index.jsx";
import LoginScreen from "@/screens/auth/LoginScreen.jsx";
import ChangePasswordScreen from "@/screens/auth/ChangePassword/ChangePasswordScreen.jsx";
import ForgotPasswordPage from "@/screens/auth/ForgotPassword/index.jsx";
import ResetPasswordPage from "@/screens/auth/ResetPassword/index.jsx";

export const AuthRoute = () => {
  return (
    <Routes>
      <Route path="login" element={< LoginScreen/>} />
      <Route path="register" element={< Register/>} />
      <Route path= "changePassword" element={<ChangePasswordScreen />} />
      <Route path="forgot-password" element={< ForgotPasswordPage/>} />
      <Route path="reset-password" element={< ResetPasswordPage/>} />
    </Routes>
  );
};
