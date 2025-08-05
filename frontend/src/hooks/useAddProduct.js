import { useState } from "react";
import { useNotification } from "@/contexts/NotificationContext.jsx";
import { useNavigate } from "react-router-dom";
import { productService } from "@/services/product.service.js";

export const useAddProduct = () => {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const { showToastNotification } = useNotification();
  const navigate = useNavigate();

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
        name: productName.trim(),
        description: description.trim() || undefined,
        stockQuantity: parseInt(stockQuantity),
        imageUrls: uploadedImages,
      };

      const response = await productService.createProducts([productData]);

      if (response?.products && response.products.length > 0) {
        showToastNotification('Product created successfully!', 'success');
        // Reset form
        setProductName("");
        setDescription("");
        setStockQuantity("");
        setUploadedImages([]);
        navigate('/seller-hub/listings/product');
      }
    } catch (err) {
      console.error('Product creation error:', err);
      setError(err.message || 'Product creation failed');
      showToastNotification(err.message || 'Product creation failed', 'error');
    } finally {
      setLoading(false);
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
    handleImageUpload,
    removeImage,
    handleSubmit,
    error,
    loading,
    uploading,
  };
};
