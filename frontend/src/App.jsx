import AppRouter from './routers/AppRouter'
import { Toaster } from 'react-hot-toast'
import {UserProvider} from "@/contexts/UserContext.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {NotificationProvider} from "@/contexts/NotificationContext.jsx";
import {AuthRoute} from "@/routers/AuthRoutes.jsx";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
          <NotificationProvider>
            <Routes>
              <Route path="/auth/*" element={<AuthRoute />}/>
            </Routes>
          </NotificationProvider>
        </UserProvider>
    </BrowserRouter>
  )
}

export default App
