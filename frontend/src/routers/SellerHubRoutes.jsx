import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import ProductListing from "@/screens/SellerHub/Listings/ProductListing/index.jsx";
import EditProduct from "@/screens/products/EditProduct/index.jsx";
import AuctionListing from "@/screens/SellerHub/AuctionListing/index.jsx";

export const SellerHubRoutes = () => {
  return (
    <Routes>
      <Route path="listings/product" element={<ProductListing />} />
      <Route path="listings/product/edit/:productId" element={<EditProduct />} />
      <Route path="listings/auction" element={<AuctionListing />} />
      <Route path="listings" element={<Navigate to="/seller-hub/listings/product" replace />} />
      <Route path="*" element={<Navigate to="/seller-hub/listings/product" replace />} />
    </Routes>
  );
};
