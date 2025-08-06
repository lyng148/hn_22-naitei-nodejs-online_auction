import { useState, useEffect } from "react";
import { useNotification } from "@/contexts/NotificationContext.jsx";
import { useNavigate } from "react-router-dom";
import { productService } from "@/services/product.service.js";

export const useEditProduct = (productId) => {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [originalProduct, setOriginalProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  
  const { showToastNotification } = useNotification();
  const navigate = useNavigate();

  // Fetch product data when component mounts
  useEffect(() => {
    if (productId) {
      fetchProductData();
    }
  }, [productId]);

  const fetchProductData = async () => {
    try {
      setFetchLoading(true);
      const response = await productService.getProductById(productId);
      
      setOriginalProduct(response);
      setProductName(response.name || "");
      setDescription(response.description || "");
      setStockQuantity(response.stockQuantity?.toString() || "");
      
      // Set uploaded images from existing product images
      const existingImages = response.images?.map(img => img.imageUrl) || [];
      setUploadedImages(existingImages);
      
    } catch (err) {
      console.error('Failed to fetch product:', err);
      setError(err.message || 'Failed to fetch product');
      showToastNotification(err.message || 'Failed to fetch product', 'error');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return null;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only image files (JPEG, PNG, WebP, GIF) are allowed');
      return null;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File size must be less than 5MB');
      return null;
    }

    setUploading(true);
    setError("");

    try {
      const response = await productService.uploadImage(file, file.name);
      const imageUrl = response.imageUrl;
      setUploadedImages(prev => [...prev, imageUrl]);
      showToastNotification('Image uploaded successfully!', 'success');
      return imageUrl;
    } catch (err) {
      console.error('Image upload error:', err);
      setError(err.message || 'Image upload failed');
      showToastNotification(err.message || 'Image upload failed', 'error');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove) => {
    setUploadedImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!productName.trim()) {
      setError("Product name is required");
      setLoading(false);
      return;
    }

    if (!stockQuantity || parseInt(stockQuantity) < 0) {
      setError("Stock quantity must be a positive number");
      setLoading(false);
      return;
    }

    try {
      const productData = {
        productId: productId,
        name: productName.trim(),
        description: description.trim() || undefined,
        stockQuantity: parseInt(stockQuantity),
        imageUrls: uploadedImages,
      };

      const response = await productService.updateProducts([productData]);

      if (response?.products && response.products.length > 0) {
        showToastNotification('Product updated successfully!', 'success');
        navigate('/seller-hub/listings/product');
      }
    } catch (err) {
      console.error('Product update error:', err);
      setError(err.message || 'Product update failed');
      showToastNotification(err.message || 'Product update failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    if (originalProduct) {
      setProductName(originalProduct.name || "");
      setDescription(originalProduct.description || "");
      setStockQuantity(originalProduct.stockQuantity?.toString() || "");
      const existingImages = originalProduct.images?.map(img => img.imageUrl) || [];
      setUploadedImages(existingImages);
      setError("");
    }
  };

  return {
    productName,
    setProductName,
    description,
    setDescription,
    stockQuantity,
    setStockQuantity,
    uploadedImages,
    originalProduct,
    handleImageUpload,
    removeImage,
    handleSubmit,
    resetForm,
    error,
    loading,
    uploading,
    fetchLoading,
  };
};
