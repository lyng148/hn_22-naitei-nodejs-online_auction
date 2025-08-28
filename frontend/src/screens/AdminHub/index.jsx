import React from "react";
import { AdminHubLayout } from "@/components/layout/AdminHubLayout";
import { AdminHubNavigation } from "@/components/layout/AdminHubNavigation";
import { AdminHubUserSidebar } from "@/components/ui/AdminHubUserSidebar";
import { Routes, Route, Navigate } from "react-router-dom";
import BidderManagement from "@/screens/AdminHub/User/BidderManagement/index.jsx";
import SellerManagement from "@/screens/AdminHub/User/SellerManagement/index.jsx";
import OrderManagement from "@/screens/AdminHub/OrderManagement/index.jsx";
import AuctionManagement from "@/screens/AdminHub/AuctionManagement/index.jsx";
import AuctionDetailPage from "@/screens/AdminHub/AuctionManagement/AuctionDetailPage.jsx";
import CommentReportsManagement from "@/screens/AdminHub/CommentReports/index.jsx";

const AdminHub = () => {
  return (
    <AdminHubLayout>
      <AdminHubNavigation />
      <Routes>
        {/* User Management Routes */}
        <Route path="user/*" element={
          <div className="flex">
            <AdminHubUserSidebar />
            <div className="flex-1 p-6">
              <Routes>
                <Route path="bidder" element={<BidderManagement />} />
                <Route path="seller" element={<SellerManagement />} />
                <Route path="" element={<Navigate to="/admin-hub/user/bidder" replace />} />
              </Routes>
            </div>
          </div>
        } />

        {/* Implemented Routes */}
        <Route path="orders" element={<OrderManagement />} />
        <Route path="auctions" element={<AuctionManagement />} />
        <Route path="auctions/:auctionId" element={<AuctionDetailPage />} />
        <Route path="reports" element={<CommentReportsManagement />} />

        {/* Default redirect */}
        <Route path="" element={<Navigate to="/admin-hub/user/bidder" replace />} />
        <Route path="*" element={<Navigate to="/admin-hub/user/bidder" replace />} />
      </Routes>
    </AdminHubLayout>
  );
};

export default AdminHub;
