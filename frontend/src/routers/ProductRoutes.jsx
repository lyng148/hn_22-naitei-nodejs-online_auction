import { Route, Routes } from "react-router-dom";
import AddProduct from "@/screens/products/AddProduct/index.jsx";
import EditProduct from "@/screens/products/EditProduct/index.jsx";

export const ProductRoutes = () => {
  return (
    <Routes>
      <Route path="add" element={<AddProduct />} />
      <Route path="edit/:id" element={<EditProduct />} />
    </Routes>
  );
};
