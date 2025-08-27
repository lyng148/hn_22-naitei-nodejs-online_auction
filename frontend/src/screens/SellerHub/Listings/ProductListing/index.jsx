import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext.jsx";
import { useNotification } from "@/contexts/NotificationContext.jsx";
import { productService } from "@/services/product.service.js";
import { PRODUCT_STATUS } from "@/constants/productStatus.js";
import { Title, PrimaryButton } from "@/components/ui/index.js";
import { ProductFilters } from "@/components/ui/ProductFilters";
import { ProductTable } from "@/components/ui/ProductTable";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import ExportModal from "@/components/ui/ExportModal";
import { IoAddOutline, IoChevronDownOutline, IoDownloadOutline } from "react-icons/io5";

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, product: null });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportModal, setExportModal] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("name");
  const [period, setPeriod] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [statusFilter, setStatusFilter] = useState("");

  const { user } = useUser();
  const { showToastNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "SELLER") {
      fetchMyProducts();
    }
  }, [user]);

  // Filter and sort products based on current filter criteria
  const filterAndSortProducts = useCallback(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((product) => {
        const searchLower = searchTerm.toLowerCase();
        switch (searchBy) {
          case "name":
            return product.name?.toLowerCase().includes(searchLower);
          case "description":
            return product.description?.toLowerCase().includes(searchLower);
          case "category":
            return product.category?.name?.toLowerCase().includes(searchLower);
          case "status":
            return product.status?.toLowerCase().includes(searchLower);
          default:
            return true;
        }
      });
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(product => product.status === statusFilter);
    }

    // Apply period filter
    if (period) {
      const now = new Date();
      let startDate = new Date();

      switch (period) {
        case "7days":
          startDate.setDate(now.getDate() - 7);
          break;
        case "30days":
          startDate.setDate(now.getDate() - 30);
          break;
        case "90days":
          startDate.setDate(now.getDate() - 90);
          break;
        case "6months":
          startDate.setMonth(now.getMonth() - 6);
          break;
        case "1year":
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate = null;
          break;
      }

      if (startDate) {
        filtered = filtered.filter(product => new Date(product.createdAt) >= startDate);
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let valueA, valueB;

      switch (sortBy) {
        case "name":
          valueA = a.name?.toLowerCase() || "";
          valueB = b.name?.toLowerCase() || "";
          break;
        case "stockQuantity":
          valueA = a.stockQuantity || 0;
          valueB = b.stockQuantity || 0;
          break;
        case "status":
          valueA = a.status || "";
          valueB = b.status || "";
          break;
        case "updatedAt":
          valueA = new Date(a.updatedAt);
          valueB = new Date(b.updatedAt);
          break;
        case "createdAt":
        default:
          valueA = new Date(a.createdAt);
          valueB = new Date(b.createdAt);
          break;
      }

      if (typeof valueA === 'string') {
        return valueB.localeCompare(valueA); // Desc order for strings
      } else {
        return valueB - valueA; // Desc order for numbers and dates
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, searchBy, period, sortBy, statusFilter]);

  // Apply filters when dependencies change
  useEffect(() => {
    filterAndSortProducts();
  }, [filterAndSortProducts]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSearchBy("name");
    setPeriod("");
    setSortBy("createdAt");
    setStatusFilter("");
  };

  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getMyProducts();
      const productsList = response.products || [];
      setProducts(productsList);
      setFilteredProducts(productsList); // Initialize filtered products
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
    navigate(`/seller-hub/listings/product/edit/${product.productId}`);
  };

  const handleDeleteProduct = async (product) => {
    setDeleteModal({ isOpen: true, product });
  };

  const handleToggleStatus = async (product) => {
    if (toggleLoading === product.productId) return; // Prevent multiple clicks

    try {
      setToggleLoading(product.productId);

      // Determine new status
      const newStatus = product.status === PRODUCT_STATUS.ACTIVE
        ? PRODUCT_STATUS.INACTIVE
        : PRODUCT_STATUS.ACTIVE;

      // Update product status
      const updatedProduct = {
        productId: product.productId,
        name: product.name,
        description: product.description,
        stockQuantity: product.stockQuantity,
        status: newStatus,
        imageUrls: product.images?.map(img => img.imageUrl) || []
      };

      await productService.updateProducts([updatedProduct]);

      const statusText = newStatus === PRODUCT_STATUS.ACTIVE ? 'activated' : 'deactivated';
      showToastNotification(`Product ${statusText} successfully`, 'success');

      fetchMyProducts(); // Refresh the list
    } catch (err) {
      showToastNotification(err.message || 'Failed to update product status', 'error');
    } finally {
      setToggleLoading(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.product) return;

    try {
      setDeleteLoading(true);
      await productService.deleteProducts([deleteModal.product.productId]);
      showToastNotification('Product deleted successfully', 'success');
      setDeleteModal({ isOpen: false, product: null });
      fetchMyProducts(); // Refresh the list
    } catch (err) {
      showToastNotification(err.message || 'Failed to delete product', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, product: null });
  };

  const handleCreateMultipleProducts = () => {
    navigate('/products/add-multiple');
  };

  const handleExportProducts = async (params = {}) => {
    if (exportLoading) return; // Prevent multiple clicks

    try {
      setExportLoading(true);
      await productService.exportProductsToExcel(params);
      showToastNotification('Products exported successfully', 'success');
      setExportModal(false);
    } catch (err) {
      showToastNotification(err.message || 'Failed to export products', 'error');
    } finally {
      setExportLoading(false);
    }
  };

  const handleOpenExportModal = () => {
    setExportModal(true);
  };

  const handleCloseExportModal = () => {
    setExportModal(false);
  };

  if (loading) {
    return <LoadingSpinner text="Loading products..." />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <Title level={2} className="text-3xl font-bold text-gray-900">
          Manage product
        </Title>

        <div className="flex gap-3">
          <PrimaryButton
            onClick={handleOpenExportModal}
            disabled={products.length === 0}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-full flex items-center gap-2 transition-colors duration-200"
          >
            Export Excel
            <IoDownloadOutline size={16} />
          </PrimaryButton>

          <PrimaryButton
            onClick={handleCreateMultipleProducts}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full flex items-center gap-2 transition-colors duration-200"
          >
            Create products
            <IoChevronDownOutline size={16} />
          </PrimaryButton>
        </div>
      </div>

      {/* Filters Section */}
      <ProductFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchBy={searchBy}
        setSearchBy={setSearchBy}
        period={period}
        setPeriod={setPeriod}
        sortBy={sortBy}
        setSortBy={setSortBy}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onClearFilters={handleClearFilters}
      />

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Products Table */}
      <ProductTable
        products={filteredProducts}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
        onToggleStatus={handleToggleStatus}
        toggleLoading={toggleLoading}
      />

      {/* Empty State */}
      {!loading && filteredProducts.length === 0 && products.length > 0 && (
        <div className="text-center py-12">
          <div className="mb-4">
            <IoAddOutline size={48} className="mx-auto text-gray-400" />
          </div>
          <Title level={3} className="text-xl font-medium text-gray-900 mb-2">
            No products found
          </Title>
          <p className="text-gray-600 mb-6">
            Try adjusting your search criteria or filters
          </p>
          <button
            onClick={handleClearFilters}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Empty State - No products at all */}
      {!loading && products.length === 0 && (
        <div className="text-center py-12">
          <div className="mb-4">
            <IoAddOutline size={48} className="mx-auto text-gray-400" />
          </div>
          <Title level={3} className="text-xl font-medium text-gray-900 mb-2">
            No products yet
          </Title>
          <p className="text-gray-600 mb-6">
            Start selling by creating your products
          </p>
          <div className="flex gap-4 justify-center">
            <PrimaryButton
              onClick={handleCreateMultipleProducts}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
            >
              Create products
            </PrimaryButton>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        productName={deleteModal.product?.name || ""}
        isLoading={deleteLoading}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={exportModal}
        onClose={handleCloseExportModal}
        onExport={handleExportProducts}
        isLoading={exportLoading}
      />
    </div>
  );
};

export default ProductListing;
