import axiosClient from "@/utils/axios.js";

const PRODUCT_API = {
  CREATE_PRODUCTS: '/api/products',
  UPLOAD_IMAGE: '/api/products/upload',
  MY_PRODUCTS: '/api/products/my-products',
};

export const productService = {
  // Upload product image
  uploadImage: async (file, fileName) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      // Only add fileName if it's provided and not empty
      if (fileName && fileName.trim()) {
        formData.append('fileName', fileName.trim());
      }

      const response = await axiosClient.post(
        PRODUCT_API.UPLOAD_IMAGE,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (err) {
      const statusCode = err?.status;
      const { message, code } = err?.response?.data || {};
      return Promise.reject({
        statusCode: statusCode || 500,
        message: message || 'Image upload failed',
        errorCode: code || 'INTERNAL_SERVER_ERROR',
      });
    }
  },

  // Create multiple products
  createProducts: async (products) => {
    // Ensure stockQuantity is a number for each product
    const processedProducts = products.map(product => ({
      ...product,
      stockQuantity: typeof product.stockQuantity === 'string' 
        ? parseInt(product.stockQuantity, 10) 
        : product.stockQuantity,
      imageUrls: product.imageUrls || []
    }));

    try {
      const response = await axiosClient.post(
        PRODUCT_API.CREATE_PRODUCTS,
        { products: processedProducts }
      );
      return response.data;
    } catch (err) {
      const statusCode = err?.status;
      const { message, code } = err?.response?.data || {};
      return Promise.reject({
        statusCode: statusCode || 500,
        message: message || 'Product creation failed',
        errorCode: code || 'INTERNAL_SERVER_ERROR',
      });
    }
  },

  // Get my products
  getMyProducts: async () => {
    try {
      const response = await axiosClient.get(PRODUCT_API.MY_PRODUCTS);
      return response.data;
    } catch (err) {
      const statusCode = err?.status;
      const { message, code } = err?.response?.data || {};
      return Promise.reject({
        statusCode: statusCode || 500,
        message: message || 'Failed to fetch products',
        errorCode: code || 'INTERNAL_SERVER_ERROR',
      });
    }
  }
};
