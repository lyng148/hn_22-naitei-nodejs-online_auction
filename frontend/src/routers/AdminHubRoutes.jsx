import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import BidderManagement from "@/screens/AdminHub/User/BidderManagement/index.jsx";
import SellerManagement from "@/screens/AdminHub/User/SellerManagement/index.jsx";
import OrderManagement from "@/screens/AdminHub/OrderManagement/index.jsx";
import CommentReportsManagement from "@/screens/AdminHub/CommentReports/index.jsx";

export const AdminHubRoutes = () => {
  return (
    <Routes>
      {/* User Management Routes */}
      <Route path="user/bidder" element={<BidderManagement />} />
      <Route path="user/seller" element={<SellerManagement />} />
      <Route path="user" element={<Navigate to="/admin-hub/user/bidder" replace />} />
      
      {/* Implemented Routes */}
      <Route path="orders" element={<OrderManagement />} />
      <Route path="reports" element={<CommentReportsManagement />} />
      
      {/* Default redirect */}
      <Route path="" element={<Navigate to="/admin-hub/user/bidder" replace />} />
      <Route path="*" element={<Navigate to="/admin-hub/user/bidder" replace />} />
    </Routes>
  );
};
