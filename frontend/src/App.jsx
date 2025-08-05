import {UserProvider} from "@/contexts/UserContext.jsx";
import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import {NotificationProvider} from "@/contexts/NotificationContext.jsx";
import {AuthRoute} from "@/routers/AuthRoutes.jsx";
import {ProductRoutes} from "@/routers/ProductRoutes.jsx";
import Dashboard from "@/screens/Dashboard/index.jsx";
import SellerHub from "@/screens/SellerHub/index.jsx";
import UserProfileScreen from "@/screens/profile/UserProfileScreen.jsx";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
          <NotificationProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/auth/login" replace />} />
              <Route path="/auth/*" element={<AuthRoute />}/>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products/*" element={<ProductRoutes />} />
              <Route path="/seller-hub/*" element={<SellerHub />} />
              <Route path="/profile" element={<UserProfileScreen />} />
            </Routes>
          </NotificationProvider>
        </UserProvider>
    </BrowserRouter>
  )
}

export default App
