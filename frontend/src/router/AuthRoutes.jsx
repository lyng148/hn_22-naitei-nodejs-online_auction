import { Route, Routes } from "react-router-dom";
import { Login } from "@/screens/auth/Login.jsx";
export const AuthRoute = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
    </Routes>
  );
};
