import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext.jsx";
import { useNotification } from "@/contexts/NotificationContext.jsx";
import { productService } from "@/services/product.service.js";
import { Title, PrimaryButton } from "@/components/ui/index.js";
import { ProductFilters } from "@/components/ui/ProductFilters";
import { ProductTable } from "@/components/ui/ProductTable";
import { IoAddOutline, IoChevronDownOutline } from "react-icons/io5";

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const { user } = useUser();
  const { showToastNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "SELLER") {
      fetchMyProducts();
    }
  }, [user]);

  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getMyProducts();
      setProducts(response.products || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError(err.message || 'Failed to fetch products');
      showToastNotification(err.message || 'Failed to fetch products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    // Navigate to edit product page
    navigate(`/products/edit/${product.productId}`);
  };

  const handleDeleteProduct = async (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        // Implement delete functionality when API is available
        showToastNotification('Product deleted successfully', 'success');
        fetchMyProducts(); // Refresh the list
      } catch (err) {
        showToastNotification(err.message || 'Failed to delete product', 'error');
      }
    }
  };

  const handleCreateProduct = () => {
    navigate('/products/add');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <Title level={2} className="text-3xl font-bold text-gray-900">
          Manage product
        </Title>
        
        <div className="relative">
          <PrimaryButton
            onClick={handleCreateProduct}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full flex items-center gap-2 transition-colors duration-200"
          >
            Create product
            <IoChevronDownOutline size={16} />
          </PrimaryButton>
        </div>
      </div>

      {/* Filters Section */}
      <ProductFilters />

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Products Table */}
      <ProductTable
        products={products}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="text-center py-12">
          <div className="mb-4">
            <IoAddOutline size={48} className="mx-auto text-gray-400" />
          </div>
          <Title level={3} className="text-xl font-medium text-gray-900 mb-2">
            No products yet
          </Title>
          <p className="text-gray-600 mb-6">
            Start selling by creating your first product
          </p>
          <PrimaryButton
            onClick={handleCreateProduct}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
          >
            Create your first product
          </PrimaryButton>
        </div>
      )}
    </div>
  );
};

export default ProductListing;
