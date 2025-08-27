import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import BidderManagement from "@/screens/AdminHub/User/BidderManagement/index.jsx";
import SellerManagement from "@/screens/AdminHub/User/SellerManagement/index.jsx";
import OrderManagement from "@/screens/AdminHub/OrderManagement/index.jsx";
import CommentReportsManagement from "@/screens/AdminHub/CommentReports/index.jsx";
import ComingSoon from "@/screens/AdminHub/ComingSoon/index.jsx";

export const AdminHubRoutes = () => {
  return (
    <Routes>
      {/* User Management Routes */}
      <Route path="user/bidder" element={<BidderManagement />} />
      <Route path="user/seller" element={<SellerManagement />} />
      <Route path="user" element={<Navigate to="/admin-hub/user/bidder" replace />} />
      
      {/* Other Routes - Coming Soon */}
      <Route path="overview" element={<ComingSoon title="Overview" />} />
      <Route path="orders" element={<OrderManagement />} />
      <Route path="listings" element={<ComingSoon title="Listings" />} />
      <Route path="store" element={<ComingSoon title="Store" />} />
      <Route path="performance" element={<ComingSoon title="Performance" />} />
      <Route path="payments" element={<ComingSoon title="Payments" />} />
      <Route path="research" element={<ComingSoon title="Research" />} />
      <Route path="reports" element={<CommentReportsManagement />} />
      <Route path="comments" element={<ComingSoon title="Comment Management" />} />
      
      {/* Default redirect */}
      <Route path="" element={<Navigate to="/admin-hub/user/bidder" replace />} />
      <Route path="*" element={<Navigate to="/admin-hub/user/bidder" replace />} />
    </Routes>
  );
};
