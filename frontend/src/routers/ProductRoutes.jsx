import { Route, Routes } from "react-router-dom";
import AddProduct from "@/screens/products/AddProduct/index.jsx";

export const ProductRoutes = () => {
  return (
    <Routes>
      <Route path="add" element={<AddProduct />} />
    </Routes>
  );
};
