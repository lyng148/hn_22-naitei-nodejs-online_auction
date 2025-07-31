import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from '../screens/Register';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="*" element={<Navigate to="/register" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
